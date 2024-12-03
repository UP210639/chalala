import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, ActivityIndicator, Menu } from 'react-native-paper';
import { gql, useQuery, useMutation } from '@apollo/client';

// Consulta para obtener todos los vehículos
const GET_VEHICLES_QUERY = gql`
  query GetVehicles {
    vehiculos {
      id
      placa
      marca
      modelo
      fechaCreacion
    }
  }
`;

// Mutación para registrar el pago
const CREATE_PAYMENT_MUTATION = gql`
  mutation CreatePago($data: PagoCreateInput!) {
    createPago(data: $data) {
      id
      monto
      fechaPago
      horaPago
      status
    }
  }
`;

const payments: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [calculatedAmount, setCalculatedAmount] = useState<number | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [processing, setProcessing] = useState(false);

  const { loading: loadingVehicles, error, data: vehiclesData } = useQuery(GET_VEHICLES_QUERY);
  const [createPayment] = useMutation(CREATE_PAYMENT_MUTATION);

  // Calcular el monto en función de la fecha de creación del vehículo
  const calculateAmount = (creationDate: string) => {
    const creation = new Date(creationDate);
    const now = new Date();
    const differenceInHours = Math.floor((now.getTime() - creation.getTime()) / (1000 * 60 * 60));
    return differenceInHours * 100; // $100 por cada hora
  };

  const handleVehicleSelection = (vehicleId: string, creationDate: string) => {
    setSelectedVehicle(vehicleId);
    const amount = calculateAmount(creationDate);
    setCalculatedAmount(amount);
    setMenuVisible(false);
  };

  const handlePayment = async () => {
    if (!selectedVehicle || calculatedAmount === null) {
      alert('Por favor, selecciona un vehículo y verifica el monto.');
      return;
    }

    try {
      setProcessing(true);

      const currentDate = new Date();
      const fechaPago = currentDate.toISOString();
      const horaPago = currentDate.toISOString();

      console.log('Datos enviados:', {
        monto: calculatedAmount,
        fechaPago,
        horaPago,
        status: 'Completado',
        selectedVehicle,
      });

      // Registrar el pago
      const { data } = await createPayment({
        variables: {
          data: {
            monto: calculatedAmount,
            fechaPago,
            horaPago,
            status: 'Completado',
          },
        },
      });

      alert(`¡Pago registrado exitosamente! ID de transacción: ${data.createPago.id}`);
    } catch (err) {
      console.error('Error al registrar el pago:', err);
      alert('No se pudo registrar el pago.');
    } finally {
      setProcessing(false);
    }
  };

  if (loadingVehicles) {
    return <ActivityIndicator animating={true} style={styles.loading} />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error al cargar los vehículos: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Registrar Pago</Text>

      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Button
            mode="outlined"
            onPress={() => setMenuVisible(true)}
            style={styles.menuButton}
          >
            {selectedVehicle
              ? `Vehículo Seleccionado: ${
                  vehiclesData?.vehiculos.find((v) => v.id === selectedVehicle)?.placa || 'N/A'
                }`
              : 'Seleccionar Vehículo'}
          </Button>
        }
      >
        {vehiclesData?.vehiculos.map((vehicle) => (
          <Menu.Item
            key={vehicle.id}
            onPress={() => handleVehicleSelection(vehicle.id, vehicle.fechaCreacion)}
            title={`${vehicle.placa} - ${vehicle.marca} ${vehicle.modelo}`}
          />
        ))}
      </Menu>

      {calculatedAmount !== null && (
        <Text style={styles.amountText}>Monto Calculado: ${calculatedAmount}</Text>
      )}

      <Button
        mode="contained"
        onPress={handlePayment}
        loading={processing}
        disabled={processing || !selectedVehicle}
        style={styles.button}
      >
        Confirmar Pago
      </Button>

      {processing && <ActivityIndicator size="large" color="#f00" style={styles.loadingIndicator} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  menuButton: {
    marginBottom: 20,
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginVertical: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#e53935',
    paddingVertical: 10,
    borderRadius: 8,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIndicator: {
    marginTop: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});

export default payments;
