import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'https://awplacasbackend-dqfchaakake3hagv.eastus-01.azurewebsites.net/api/graphql', // Asegúrate de que esta URL sea correcta
});

const authLink = setContext((_, { headers }) => {
  // Obtén el token de autenticación si es necesario
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;