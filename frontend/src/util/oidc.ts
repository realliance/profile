import * as oidc from 'oauth4webapi';
import Cookies from 'js-cookie';
import { useMemo } from 'react';

interface OpenIdConnectProvider {
  issuer: string;
  /** In certain scenarios the OIDC discovery url is different than the issuer. Use this in those cases. */
  expectedIssuer?: string;
  redirectUriPath?: string;
  client: oidc.Client;
  scopes: string[];
}

export const ReallianceProvider: OpenIdConnectProvider = {
  issuer: 'https://id.realliance.net/application/o/community/',
  client: {
    client_id: 'LNXdUuOZUue5HPlw8Vyglo83sIYndFaGUCIdQrSZ',
    token_endpoint_auth_method: 'none',
  },
  scopes: ['openid', 'profile'],
};

// https://wiki.vg/Microsoft_Authentication_Scheme
export const MicrosoftProvider: OpenIdConnectProvider = {
  issuer: 'https://login.microsoftonline.com/consumers/v2.0/',
  expectedIssuer:
    'https://login.microsoftonline.com/9188040d-6c67-4c5b-b112-36a304b66dad/v2.0',
  client: {
    client_id: '82b06481-a938-4def-88e6-656a35a1d648',
    token_endpoint_auth_method: 'none',
  },
  scopes: ['openid', 'profile', 'XboxLive.signin'],
  redirectUriPath: '/minecraft',
};

const REDIRECT_URI = import.meta.env.PROD
  ? 'https://community.realliance.net'
  : 'http://localhost:8080';

interface OpenIdConnectContext {
  beginFlow: () => Promise<void>;
  completeFlow: (updateToken: (token: string) => void, updateRefreshToken: (token: string | undefined) => void) => Promise<void>;
  refreshToken: (refreshToken: string, updateToken: (token: string) => void, updateRefreshToken: (token: string | undefined) => void) => Promise<void>;
}

export const useOIDCProvider = ({
  issuer,
  expectedIssuer,
  client,
  scopes,
  redirectUriPath,
}: OpenIdConnectProvider): OpenIdConnectContext => {
  const authorizationServer = useMemo(() => oidc
    .discoveryRequest(new URL(issuer))
    .then((response) =>
      oidc.processDiscoveryResponse(
        new URL(expectedIssuer ?? issuer),
        response,
      ),
    ), []);

  return {
    beginFlow: async () =>
      beginAuthFlow(client, scopes, authorizationServer, redirectUriPath),
    completeFlow: async (updateToken, updateRefreshToken) =>
      onRedirect(client, authorizationServer, redirectUriPath, updateToken, updateRefreshToken),
    refreshToken: async (refreshToken, updateToken, updateRefreshToken) => handleRefreshToken(client, authorizationServer, refreshToken, updateToken, updateRefreshToken),
  };
};

async function beginAuthFlow(
  client: oidc.Client,
  scopes: string[],
  as: Promise<oidc.AuthorizationServer>,
  redirectPath?: string,
) {
  const authServer = await as;

  const code_verifier = oidc.generateRandomCodeVerifier();
  const code_challenge = await oidc.calculatePKCECodeChallenge(code_verifier);
  const code_challenge_method = 'S256';

  if (!Cookies.set('codeVerifier', code_verifier)) {
    throw new Error('Error setting cookie');
  }

  const authorizationUrl = new URL(authServer.authorization_endpoint!);
  authorizationUrl.searchParams.set('client_id', client.client_id);
  authorizationUrl.searchParams.set('code_challenge', code_challenge);
  authorizationUrl.searchParams.set(
    'code_challenge_method',
    code_challenge_method,
  );
  authorizationUrl.searchParams.set(
    'redirect_uri',
    `${REDIRECT_URI}${redirectPath ?? ''}`,
  );
  authorizationUrl.searchParams.set('response_type', 'code');
  authorizationUrl.searchParams.set('scope', scopes.join(' '));

  window.location.href = authorizationUrl.toString();
}

async function onRedirect(
  client: oidc.Client,
  as: Promise<oidc.AuthorizationServer>,
  redirectPath: string | undefined,
  updateToken: (token: string) => void,
  updateRefreshToken: (refreshToken: string | undefined) => void,
) {
  const codeVerifier = Cookies.get('codeVerifier');
  if (!codeVerifier) {
    return;
  }
  Cookies.remove('codeVerifier');

  const authServer = await as;

  const currentUrl = new URL(window.location.href);
  const params = oidc.validateAuthResponse(
    authServer,
    client,
    currentUrl,
    oidc.skipStateCheck,
  );
  if (oidc.isOAuth2Error(params)) {
    console.log('error', params);
    throw new Error('oauth2 Failed'); // Handle oauth 2.0 redirect error
  }

  const response = await oidc.authorizationCodeGrantRequest(
    authServer,
    client,
    params,
    REDIRECT_URI + (redirectPath ?? ''),
    codeVerifier,
  );

  let challenges: oidc.WWWAuthenticateChallenge[] | undefined;
  if ((challenges = oidc.parseWwwAuthenticateChallenges(response))) {
    for (const challenge of challenges) {
      console.log('challenge', challenge);
    }
    throw new Error('www-authenticate challenge encountered, not supported');
  }

  if (window.history.pushState) {
    const newurl =
      window.location.protocol +
      '//' +
      window.location.host +
      (redirectPath ?? '');
    window.history.pushState({ path: newurl }, '', newurl);
  }

  const result = await oidc.processAuthorizationCodeOpenIDResponse(
    authServer,
    client,
    response,
  );
  if (oidc.isOAuth2Error(result)) {
    console.error(result);
    throw new Error();
  }


  updateToken(result.access_token);
  updateRefreshToken(result.refresh_token);
}

async function handleRefreshToken(client: oidc.Client,
  as: Promise<oidc.AuthorizationServer>,
  refreshToken: string,
  updateToken: (token: string) => void,
  updateRefreshToken: (refreshToken: string | undefined) => void
) {
  const authServer = await as;

  const response = await oidc.refreshTokenGrantRequest(authServer, client, refreshToken);
  const result = await oidc.processRefreshTokenResponse(
    authServer,
    client,
    response,
  );

  if (oidc.isOAuth2Error(result)) {
    console.error(result);
    throw new Error();
  }

  updateToken(result.access_token);
  updateRefreshToken(result.refresh_token);
}