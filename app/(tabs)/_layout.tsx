import { Tabs } from 'expo-router';
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import BurgerMenu from '../../components/burgerMenu';

export default function TabLayout() {
  const [drawerVisible, setDrawerVisible] = useState(false);

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Burger icon at the top-left corner */}
      <TouchableOpacity onPress={toggleDrawer} style={styles.burgerButton}>
        <Ionicons name="menu" size={30} color="black" />
      </TouchableOpacity>

      {/* Tab navigation */}
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: 'purple',
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
            ),
          }}
        />
        <Tabs.Screen
          name="users"
          options={{
            title: 'Usuarios',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'person-sharp' : 'person-outline'} color={color} size={24} />
            ),
          }}
        />
        <Tabs.Screen
          name="vehicle"
          options={{
            title: 'Vehículos',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'car-sharp' : 'car-outline'} color={color} size={24} />
            ),
          }}
        />
        <Tabs.Screen
          name="payments"
          options={{
            title: 'Pagos',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'cash-sharp' : 'cash-outline'} color={color} size={24} />
            ),
          }}
        />
        <Tabs.Screen
          name="dashboard"
          options={{
            title: 'Dashboard',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'bar-chart-sharp' : 'bar-chart-outline'} color={color} size={24} />
            ),
          }}
        />
      </Tabs>

      {/* Side menu */}
      <BurgerMenu visible={drawerVisible} onClose={() => setDrawerVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  burgerButton: {
    position: 'absolute',
    top: 20,
    left: 10,
    zIndex: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
});
