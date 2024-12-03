import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';
import { azureAuthConfig } from './AzureAuthConfig';
import { jwtDecode } from 'jwt-decode';

export class AuthManager {

  static signInAsync = async () => {
    const redirectUri = AuthSession.makeRedirectUri({ scheme: 'myapp', path: '' });
    try {
      const authRequest = new AuthSession.AuthRequest({
        clientId: azureAuthConfig.clientId,
        redirectUri: redirectUri,
        scopes: azureAuthConfig.scopes,
        responseType: AuthSession.ResponseType.Code,
        usePKCE: true,
        prompt: AuthSession.Prompt.SelectAccount,
      });

      const result = await authRequest.promptAsync(azureAuthConfig.discovery);

      if (result.type === 'success') {
        const tokenResult = await AuthSession.exchangeCodeAsync(
          {
            code: result.params.code,
            clientId: azureAuthConfig.clientId,
            redirectUri: redirectUri,
            extraParams: {
              code_verifier: authRequest.codeVerifier || '',
            },
          },
          azureAuthConfig.discovery
        );

        const { accessToken, idToken, refreshToken, expiresIn } = tokenResult;

        const decodedToken: any = jwtDecode(idToken || accessToken);

        const userName = decodedToken.name;
        const userEmail = decodedToken.preferred_username;

        console.log('Decoded Token:', decodedToken);

        await AsyncStorage.setItem('userToken', accessToken);
        await AsyncStorage.setItem('refreshToken', refreshToken || '');
        if (expiresIn !== undefined) {
          const expireTime = new Date(new Date().getTime() + expiresIn * 1000).toISOString();
          await AsyncStorage.setItem('expireTime', expireTime);
        }
        await AsyncStorage.setItem('userEmail', userEmail);
        await AsyncStorage.setItem('userName', userName);

        return { accessToken, userEmail };
      } else {
        throw new Error('Authentication failed');
      }
    } catch (error) {
      console.error('Failed to sign in:', error);
      throw error;
    }
  };

  static signOutAsync = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('expireTime');
      await AsyncStorage.removeItem('userEmail');
      await AsyncStorage.removeItem('userName');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  static getAccessTokenAsync = async () => {
    try {
      const expireTime = await AsyncStorage.getItem('expireTime');

      if (expireTime !== null) {
        const expire = new Date(expireTime);
        const now = new Date();

        if (now >= expire) {
          console.log('Refreshing token');
          const refreshToken = await AsyncStorage.getItem('refreshToken');
          const tokenResult = await AuthSession.refreshAsync(
            {
              clientId: azureAuthConfig.clientId,
              refreshToken: refreshToken || '',
            },
            azureAuthConfig.discovery
          );
          const { accessToken, idToken, refreshToken: newRefreshToken, expiresIn } = tokenResult;
          const decodedToken: any = jwtDecode(idToken || accessToken);
          console.log(decodedToken);
          const userName = decodedToken.name;
          const userEmail = decodedToken.preferred_username;

          await AsyncStorage.setItem('userToken', accessToken);
          await AsyncStorage.setItem('refreshToken', newRefreshToken || '');
          if (expiresIn !== undefined) {
            const expireTime = new Date(new Date().getTime() + expiresIn * 1000).toISOString();
            await AsyncStorage.setItem('expireTime', expireTime);
          }
          await AsyncStorage.setItem('userEmail', userEmail);
          await AsyncStorage.setItem('userName', userName);

          return { accessToken, userEmail };
        }

        const accessToken = await AsyncStorage.getItem('userToken');
        const userEmail = await AsyncStorage.getItem('userEmail');
        return { accessToken, userEmail };
      }

      return null;
    } catch (error) {
      console.error('Failed to get access token:', error);
      return null;
    }
  };
}