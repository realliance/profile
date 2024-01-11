export async function authenticateAgainstMinecraft(
  msAccessToken: string,
): Promise<string> {
  const xboxLiveAuth = {
    Properties: {
      AuthMethod: 'RPS',
      SiteName: 'user.auth.xboxlive.com',
      RpsTicket: `d=${msAccessToken}`,
    },
    RelyingParty: 'http://auth.xboxlive.com',
    TokenType: 'JWT',
  };

  const xboxLiveRes = await fetch(
    'https://user.auth.xboxlive.com/user/authenticate',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(xboxLiveAuth),
    },
  );

  if (xboxLiveRes.status !== 200) {
    throw new Error(await xboxLiveRes.text());
  }

  const xboxLiveJson = await xboxLiveRes.json();
  console.log('xboxLiveJson');
  const xboxLiveToken = xboxLiveJson['Token'];

  const xstsAuth = {
    Properties: {
      SandboxId: 'RETAIL',
      UserTokens: [xboxLiveToken],
    },
    RelyingParty: 'rp://api.minecraftservices.com/',
    TokenType: 'JWT',
  };

  const xstsRes = await fetch('https://xsts.auth.xboxlive.com/xsts/authorize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(xstsAuth),
  });

  if (xstsRes.status !== 200) {
    throw new Error(await xstsRes.text());
  }

  const xstsJson = await xstsRes.json();
  console.log('xstsJson');

  const xstsToken = xstsJson['Token'];
  const xstsUhs = xstsJson['DisplayClaims']['xui'][0]['uhs'];

  const minecraftAuth = {
    identityToken: `XBL3.0 x=${xstsUhs};${xstsToken}`,
  };

  const minecraftRes = await fetch(
    'https://api.minecraftservices.com/authentication/login_with_xbox',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(minecraftAuth),
    },
  );

  if (minecraftRes.status !== 200) {
    throw new Error(await minecraftRes.text());
  }

  const minecraftResJson = await minecraftRes.json();
  console.log('minecraftResJson');
  const minecraftToken = minecraftResJson['access_token'];

  const profileRes = await fetch(
    'https://api.minecraftservices.com/minecraft/profile',
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${minecraftToken}`,
        Accept: 'application/json',
      },
    },
  );

  if (profileRes.status !== 200) {
    throw new Error(await profileRes.text());
  }

  console.log('Profile');

  return (await profileRes.json()).id;
}
