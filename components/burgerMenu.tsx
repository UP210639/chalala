import React, { useEffect, useRef, useState } from 'react';
import { Modal, View, StyleSheet, TouchableWithoutFeedback, Animated, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
}

const BurgerMenu: React.FC<SideMenuProps> = ({ visible, onClose }) => {
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const navigation = useNavigation();
  const theme = useTheme();

  const [isDropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -300,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleLogoutPress = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('userName');
      await AsyncStorage.removeItem('userEmail');
      navigation.navigate('index');
    } catch (error) {
      console.error('Error removing access token:', error);
    }
    onClose();
  };

  const handleNavigation = (route: string) => {
    navigation.navigate(route);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.drawerContainer,
                { transform: [{ translateX: slideAnim }], backgroundColor: theme.colors.surface },
              ]}
            >
              <View style={styles.menuOptions}>
                <TouchableOpacity
                  style={styles.menuButton} 
                  onPress={() => handleNavigation('home')}
                >
                  <Ionicons name="home-outline" size={24} color={theme.colors.primary} />
                  <Text style={[styles.menuText, { color: theme.colors.secondary }]}>Home</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.spacer} />
              <TouchableOpacity
                style={[
                  styles.logoutButton,
                  { backgroundColor: theme.colors.primaryContainer },
                ]}
                onPress={handleLogoutPress}
              >
                <Text style={[styles.logoutButtonText, {color: theme.colors.secondary}]}>Log Out</Text>
              </TouchableOpacity>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  drawerContainer: {
    width: '70%',
    height: '100%',
    overflow: 'hidden',
  },
  menuOptions: {
    paddingVertical: 20,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  menuText: {
    fontSize: 18,
    marginLeft: 10,
  },
  spacer: {
    flexGrow: 1,
  },
  logoutButton: {
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 50,
    color: 'red' ,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 26,
  },
});

export default BurgerMenu;