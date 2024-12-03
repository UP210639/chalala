import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { gql, useQuery } from '@apollo/client';
import { LineChart } from 'react-native-chart-kit';
import { captureRef } from 'react-native-view-shot';

// Consulta GraphQL para obtener los vehículos
const GET_VEHICLES_QUERY = gql`
  query GetVehicles {
    vehiculos {
      fechaCreacion
    }
  }
`;

const dashboard: React.FC = () => {
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [{ data: [] }],
  });
  const [totalVehiclesToday, setTotalVehiclesToday] = useState<number>(0);
  const chartRef = useRef<any>(null);

  const { loading, error, data } = useQuery(GET_VEHICLES_QUERY);

  useEffect(() => {
    if (data) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const hourlyCounts: Record<number, number> = {};

      // Inicializar todas las horas del día con 0 (sin registros)
      for (let hour = 0; hour < 24; hour++) {
        hourlyCounts[hour] = 0;
      }

      // Contar registros por hora
      let totalCount = 0;
      data.vehiculos.forEach((vehicle: any) => {
        const creationDate = new Date(vehicle.fechaCreacion);
        if (creationDate >= today) {
          const hour = creationDate.getHours(); // Obtener la hora de la fecha de creación
          hourlyCounts[hour] += 1; // Contar accesos en esa hora
          totalCount += 1; // Incrementar contador total
        }
      });

      // Crear etiquetas para las horas y valores (total de accesos por hora)
      const labels = Object.keys(hourlyCounts).map((hour) => `${hour}:00`);
      const values = Object.values(hourlyCounts);

      // Actualizar datos de la gráfica
      setChartData({
        labels,
        datasets: [{ data: values }],
      });

      // Actualizar el contador total
      setTotalVehiclesToday(totalCount);
    }
  }, [data]);

  const handleDownloadGraph = async () => {
    try {
      const uri = await captureRef(chartRef, {
        format: 'png',
        quality: 1,
      });

      // Para aplicaciones web: crear un enlace de descarga
      const link = document.createElement('a');
      link.href = uri;
      link.download = 'graph.png';
      link.click();
    } catch (error) {
      console.error('Error al descargar la gráfica:', error);
    }
  };

  if (loading) {
    return <ActivityIndicator animating={true} style={styles.loading} />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error al cargar los datos: {error.message}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.counterContainer}>
        <Image source={require('@/assets/images/default.png')} style={styles.carIcon} />
        <Text style={styles.counterText}>Carros Registrados Hoy</Text>
        <Text style={styles.counterNumber}>{totalVehiclesToday}</Text>
      </View>
      <View ref={chartRef}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <LineChart
            data={chartData}
            width={chartData.labels.length * 50} // Ancho dinámico basado en las etiquetas
            height={300} // Alto de la gráfica
            yAxisLabel=""
            yAxisSuffix=""
            yAxisInterval={1} // Mostrar todos los valores en el eje Y
            chartConfig={{
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              color: (opacity = 1) => `rgba(255, 5, 0, ${opacity})`, // Línea azul
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Etiquetas negras
              strokeWidth: 2, // Grosor de la línea
              propsForDots: {
                r: '5',
                strokeWidth: '2',
                stroke: '#FF0500',
              },
              formatYLabel: (value) => (parseInt(value) >= 1 ? value : '1'), // Asegurar que el valor mínimo sea 1
            }}
            style={styles.chart}
          />
        </ScrollView>
      </View>
      <TouchableOpacity style={styles.downloadButton} onPress={handleDownloadGraph}>
        <Text style={styles.downloadButtonText}>Descargar Gráfica</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  counterContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  carIcon: {
    width: 50,
    height: 50,
    marginBottom: 8,
  },
  counterText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  counterNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF0500',
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
    color: 'red',
    textAlign: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 8,
  },
  downloadButton: {
    backgroundColor: '#FF0500',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  downloadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default dashboard;
