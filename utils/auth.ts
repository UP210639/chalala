import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAccessToken = async () => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    return token;
  } catch (error) {
    console.error('Failed to retrieve access token:', error);
    return null;
  }
};

export const getUserName = async () => {
  try {
    const token = await AsyncStorage.getItem('userName');
    return token;
  } catch (error) {
    console.error('Failed to retrieve access token:', error);
    return null;
  }
};