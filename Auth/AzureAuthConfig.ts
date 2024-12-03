export const azureAuthConfig = {
  clientId: 'ecf5a8b6-543a-47aa-a6e1-57a3ad50c690',
  tenantId: 'common',
  redirectUri: 'myapp://auth',
  bundleIdentifier: 'com.myapp',
  scopes: ['User.Read', 'openid', 'profile', 'email'],
  discovery: {
    authorizationEndpoint: `https://login.microsoftonline.com/common/oauth2/v2.0/authorize`,
    tokenEndpoint: `https://login.microsoftonline.com/common/oauth2/v2.0/token`,
    issuer: `https://login.microsoftonline.com/common/v2.0`,
  },
};