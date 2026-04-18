import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import FoodHome from './screens/FoodHome';
import OrderHistory from './screens/OrderHistory';
import OrderDetails from './screens/OrderDetails';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Home');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const navigateToHistory = () => setCurrentScreen('History');
  const navigateToHome = () => setCurrentScreen('Home');
  const navigateToOrderDetails = (order) => {
    setSelectedOrder(order);
    setCurrentScreen('OrderDetails');
  };
  const backFromDetails = () => {
    setSelectedOrder(null);
    setCurrentScreen('History');
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      {currentScreen === 'Home' ? (
        <FoodHome onOpenHistory={navigateToHistory} />
      ) : currentScreen === 'History' ? (
        <OrderHistory onBack={navigateToHome} onOrderPress={navigateToOrderDetails} />
      ) : (
        <OrderDetails order={selectedOrder} onBack={backFromDetails} />
      )}
    </SafeAreaProvider>
  );
}
