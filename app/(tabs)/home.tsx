import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, Divider, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { getUserName } from '../../utils/auth';

const HomePage = () => {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccessToken = async () => {
      const token = await getUserName();
      setUsername(token);
    };

    fetchAccessToken();
  }, []);

  const theme = useTheme();
  const navigation = useNavigation(); // Initialize navigation

  return (
    <View style={[styles.container, { backgroundColor: '#141320' }]}>
      <Text variant="headlineSmall" style={styles.title}>
        Bienvenido {username}
      </Text>
      <Text variant="labelLarge" style={styles.subtitle}>
        Espero que tenga un buen día
      </Text>
      <Divider style={styles.divider} />
      <Button
        style={styles.button}
        icon="account-circle-outline" // Ícono de personita
        mode="contained"
        onPress={() => navigation.navigate('users')}
      >
        Administrar Usuarios
      </Button>
      <Button
        style={styles.button}
        icon="car" // Ícono de carrito
        mode="contained"
        onPress={() => navigation.navigate('vehicle')}
      >
        Administrar Vehículos
      </Button>
      <Button
        style={styles.button}
        icon="chart-line" // Ícono de gráfica
        mode="contained"
        onPress={() => navigation.navigate('dashboard')}
      >
        Ver Gráficas
      </Button>
      <Button
        style={styles.button}
        icon="cash" // Ícono de dinero
        mode="contained"
        onPress={() => navigation.navigate('payments')}
      >
        Realizar Pago
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Fondo oscuro
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff', // Blanco para el título
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff', // Morado intenso
    marginBottom: 20,
    textAlign: 'center',
  },
  divider: {
    width: '80%',
    height: 1,
    backgroundColor: '#29293d', // Línea divisoria sutil
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#ff0055', // Fondo morado intenso para los botones
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25, // Bordes redondeados
    width: '80%', // Botones uniformes
  },
});

export default HomePage;
