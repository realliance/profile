import * as oauth from 'oauth4webapi';
import Cookies from 'js-cookie';

const ISSUER = new URL('https://id.realliance.net/application/o/community/');
const REDIRECT_URI = import.meta.env.PROD ? "https://profile.realliance.net" : "http://localhost:8080";

const as = oauth
  .discoveryRequest(ISSUER)
  .then((response) => oauth.processDiscoveryResponse(ISSUER, response));

const client: oauth.Client = {
  client_id: 'LNXdUuOZUue5HPlw8Vyglo83sIYndFaGUCIdQrSZ',
  token_endpoint_auth_method: 'none',
}

export async function beginAuthFlow() {
  const authServer = await as;

  if (authServer.code_challenge_methods_supported?.includes('S256') !== true) {
    // This example assumes S256 PKCE support is signalled
    // If it isn't supported, random `nonce` must be used for CSRF protection.
    throw new Error("S256 PKCE not supported");
  }
  
  const code_verifier = oauth.generateRandomCodeVerifier()
  const code_challenge = await oauth.calculatePKCECodeChallenge(code_verifier)
  const code_challenge_method = 'S256'

  Cookies.remove('codeVerifier');
  Cookies.set('codeVerifier', code_verifier);

  const authorizationUrl = new URL(authServer.authorization_endpoint!)
  authorizationUrl.searchParams.set('client_id', client.client_id)
  authorizationUrl.searchParams.set('code_challenge', code_challenge)
  authorizationUrl.searchParams.set('code_challenge_method', code_challenge_method)
  authorizationUrl.searchParams.set('redirect_uri', REDIRECT_URI)
  authorizationUrl.searchParams.set('response_type', 'code')
  authorizationUrl.searchParams.set('scope', 'openid profile')

  window.location.href = authorizationUrl.toString();
}

export async function onRedirect(updateToken: (token: string) => void) {
  const authServer = await as;

  const currentUrl = new URL(window.location.href);
  const params = oauth.validateAuthResponse(authServer, client, currentUrl, oauth.skipStateCheck)
  if (oauth.isOAuth2Error(params)) {
    console.log('error', params)
    throw new Error("Oauth2 Failed") // Handle OAuth 2.0 redirect error
  }

  const code_verifier = Cookies.get('codeVerifier') ?? "";
  Cookies.remove('codeVerifier');

  const response = await oauth.authorizationCodeGrantRequest(
    authServer,
    client,
    params,
    REDIRECT_URI,
    code_verifier,
  )

  let challenges: oauth.WWWAuthenticateChallenge[] | undefined
  if ((challenges = oauth.parseWwwAuthenticateChallenges(response))) {
    for (const challenge of challenges) {
      console.log('challenge', challenge)
    }
    throw new Error() // Handle www-authenticate challenges as needed
  }

  if (window.history.pushState) {
    var newurl = window.location.protocol + "//" + window.location.host;
    window.history.pushState({path:newurl},'',newurl);
  }

  const result = await oauth.processAuthorizationCodeOpenIDResponse(authServer, client, response)
  if (oauth.isOAuth2Error(result)) {
    console.log('error', result)
    throw new Error() // Handle OAuth 2.0 response body error
  }

  updateToken(result.access_token);
}