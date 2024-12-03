import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TextInput, Image, Alert, Animated } from 'react-native';
import { Text, Button, ActivityIndicator, useTheme } from 'react-native-paper';
import { gql, useQuery, useMutation } from '@apollo/client';

// Consulta para obtener los vehículos
const GET_VEHICLES_QUERY = gql`
  query GetVehicles {
    vehiculos {
      id
      placa
      marca
      modelo
      color
      fechaCreacion
    }
  }
`;

// Mutación para actualizar un vehículo
const UPDATE_VEHICLE_MUTATION = gql`
  mutation UpdateVehicle($id: ID!, $marca: String!, $modelo: String!, $color: String!) {
    updateVehiculo(
      where: { id: $id }
      data: { marca: $marca, modelo: $modelo, color: $color }
    ) {
      id
      marca
      modelo
      color
    }
  }
`;

const vehicle = ({ navigation }) => {
  const theme = useTheme();
  const { loading, error, data, refetch } = useQuery(GET_VEHICLES_QUERY);
  const [updateVehicle, { loading: updating }] = useMutation(UPDATE_VEHICLE_MUTATION);

  const [editingVehicle, setEditingVehicle] = useState(null);
  const [newMarca, setNewMarca] = useState('');
  const [newModelo, setNewModelo] = useState('');
  const [newColor, setNewColor] = useState('');

  const animatedBorderColor = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedBorderColor, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(animatedBorderColor, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const borderColorInterpolation = animatedBorderColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['#FFFFFF', '#FFD700'],
  });

  const getImageForBrand = (brand: string): any => {
    const images = {
      nissan: require('@/assets/images/nissan.png'),
      toyota: require('@/assets/images/toyota.png'),
      mazda: require('@/assets/images/mazda.png'),
      byd: require('@/assets/images/byd.png'),
      default: require('@/assets/images/default.png'),
    };
    return images[brand?.toLowerCase()] || images.default;
  };

  const handleEditVehicle = (vehicle) => {
    setEditingVehicle(vehicle.id);
    setNewMarca(vehicle.marca || '');
    setNewModelo(vehicle.modelo || '');
    setNewColor(vehicle.color || '');
  };

  const handleSaveChanges = async () => {
    try {
      await updateVehicle({
        variables: {
          id: editingVehicle,
          marca: newMarca,
          modelo: newModelo,
          color: newColor,
        },
      });

      Alert.alert('Éxito', 'El vehículo fue actualizado correctamente');
      setEditingVehicle(null);
      setNewMarca('');
      setNewModelo('');
      setNewColor('');
      refetch();
    } catch (error) {
      console.error('Error actualizando vehículo:', error);
      Alert.alert('Error', 'No se pudo actualizar el vehículo');
    }
  };

  const renderItem = ({ item }) => {
    const isIncomplete = !item.marca || !item.modelo || !item.color;

    return (
      <Animated.View
        style={[
          styles.itemContainer,
          isIncomplete && { borderColor: borderColorInterpolation, borderWidth: 5 },
        ]}
      >
        {editingVehicle === item.id ? (
          <View style={styles.editContainer}>
            <Text style={styles.text}>Placa: {item.placa}</Text>
            <TextInput
              placeholder="Marca"
              value={newMarca}
              onChangeText={setNewMarca}
              style={styles.input}
            />
            <TextInput
              placeholder="Modelo"
              value={newModelo}
              onChangeText={setNewModelo}
              style={styles.input}
            />
            <TextInput
              placeholder="Color"
              value={newColor}
              onChangeText={setNewColor}
              style={styles.input}
            />
            <Button onPress={handleSaveChanges} loading={updating} style={styles.button}>
              Save Changes
            </Button>
          </View>
        ) : (
          <View>
            <Image source={getImageForBrand(item.marca)} style={styles.brandImage} />
            <Text style={styles.text}>Placa: {item.placa}</Text>
            <Text style={styles.text}>Marca: {item.marca || 'N/A'}</Text>
            <Text style={styles.text}>Modelo: {item.modelo || 'N/A'}</Text>
            <Text style={styles.text}>Color: {item.color || 'N/A'}</Text>
            <Text style={styles.text}>
              Fecha de Creación: {new Date(item.fechaCreacion).toLocaleDateString()}
            </Text>
            <Button onPress={() => handleEditVehicle(item)} style={styles.button}>
              Edit
            </Button>
          </View>
        )}
      </Animated.View>
    );
  };

  if (loading) {
    return <ActivityIndicator animating={true} style={styles.loading} />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={styles.header}>Vehicles List</Text>
      <FlatList
        data={data.vehiculos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#000', // Fondo negro
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#f00', // Texto rojo para errores
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff', // Texto blanco
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#fff', // Bordes blancos
    backgroundColor: '#fff', // Fondo blanco de las tarjetas
    marginVertical: 5,
    borderRadius: 8, // Bordes redondeados
  },
  incompleteItem: {
    borderColor: '#FFD700', // Borde amarillo para tarjetas incompletas
    borderWidth: 5,
  },
  editContainer: {
    padding: 10,
  },
  brandImage: {
    width: 80, // Tamaño original de la imagen
    height: 40,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  text: {
    color: '#000', // Texto blanco
    marginVertical: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#f00', // Bordes rojos
    padding: 8,
    marginVertical: 5,
    borderRadius: 5,
    color: '#000', // Texto blanco
  },
  button: {
    backgroundColor: '#f00', // Fondo rojo
    marginTop: 10,
  },
});

export default vehicle;
