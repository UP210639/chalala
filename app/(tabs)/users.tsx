import React from 'react';
import { View, StyleSheet, FlatList, Image } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { gql, useQuery } from '@apollo/client';

// Consulta GraphQL para obtener los usuarios
const GET_USERS_QUERY = gql`
  query GetUsuarios {
    usuarios {
      id
      nombre
      email
      fechaRegistro
    }
  }
`;

const users: React.FC = () => {
  const { loading, error, data } = useQuery(GET_USERS_QUERY);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Cargando usuarios...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Error al cargar los usuarios: {error.message}
        </Text>
      </View>
    );
  }

  // Renderizar cada usuario
  const renderUser = ({ item }: { item: typeof data.usuarios[0] }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <Image
          source={require('@/assets/images/logo.png')} // Cambia esto a la ruta de tu ícono de usuario
          style={styles.userIcon}
        />
        <View>
          <Text style={styles.userName}>{item.nombre}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
        </View>
      </View>
      <Text style={styles.userDate}>
        Fecha de Registro: {new Date(item.fechaRegistro).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lista de Usuarios</Text>
      <FlatList
        data={data.usuarios}
        keyExtractor={(item) => item.id}
        renderItem={renderUser}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141320',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
  },
  list: {
    paddingBottom: 16,
  },
  userCard: {
    backgroundColor: '#3a3a3a',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userIcon: {
    width: 40,
    height: 40,
    marginRight: 12,
    tintColor: '#ff0500', // Color del ícono
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  userEmail: {
    fontSize: 16,
    color: '#b0b0b0',
    marginTop: 4,
  },
  userDate: {
    fontSize: 14,
    color: '#777',
    marginTop: 8,
  },
});

export default users;
