import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import BASE_URL from '../src/api/apiConfig';


const THEME = {
  bg: '#FCFCFC',
  headerBg: '#FFB900',
  primary: '#FF4E00',
  secondary: '#FF7D00',
  text: '#121212',
  textSecondary: '#666666',
  white: '#FFFFFF',
  border: 'rgba(0,0,0,0.06)',
};

const StatusBadge = ({ status }) => {
  const isDelivered = status === 'Delivered';
  return (
    <View style={[styles.badge, { backgroundColor: isDelivered ? '#E8F5E9' : '#FFF3E0' }]}>
      <View style={[styles.dot, { backgroundColor: isDelivered ? '#4CAF50' : '#FF9800' }]} />
      <Text style={[styles.badgeText, { color: isDelivered ? '#2E7D32' : '#E65100' }]}>{status}</Text>
    </View>
  );
};

export default function OrderHistory({ onBack, onOrderPress }) {
  const insets = useSafeAreaInsets();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  // const BASE_URL = 'http://192.168.1.113:3000';


  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const resp = await fetch(`${BASE_URL}/orders`);
      const data = await resp.json();
      setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity style={styles.orderCard} onPress={() => onOrderPress(item)}>
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>Order #QB-{item.id}</Text>
          <Text style={styles.orderDate}>{new Date(item.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</Text>
        </View>
        <StatusBadge status={item.status} />
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.orderFooter}>
        <View style={styles.priceRow}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalPrice}>PKR {item.total_price}</Text>
        </View>
        <View style={styles.arrowCircle}>
          <Ionicons name="chevron-forward" size={18} color={THEME.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="chevron-back" size={24} color={THEME.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Order History</Text>
        <TouchableOpacity style={styles.refreshBtn} onPress={fetchOrders}>
          <Ionicons name="refresh" size={20} color={THEME.text} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={THEME.primary} />
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => item.id.toString()}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="receipt-outline" size={80} color={THEME.border} />
              <Text style={styles.emptyText}>No orders yet</Text>
              <Text style={styles.emptySub}>Time to order some delicious food!</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: THEME.white },
  backBtn: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '900', color: THEME.text },
  refreshBtn: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  
  listContent: { padding: 20, paddingBottom: 40 },
  orderCard: { backgroundColor: THEME.white, borderRadius: 24, padding: 20, marginBottom: 16, elevation: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 },
  orderId: { fontSize: 16, fontWeight: '900', color: THEME.text, marginBottom: 4 },
  orderDate: { fontSize: 13, color: THEME.textSecondary, fontWeight: '600' },
  
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  badgeText: { fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
  
  divider: { height: 1, backgroundColor: THEME.border, marginVertical: 15 },
  
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceRow: { flex: 1 },
  totalLabel: { fontSize: 12, color: THEME.textSecondary, fontWeight: '700', marginBottom: 2 },
  totalPrice: { fontSize: 18, fontWeight: '900', color: THEME.primary },
  arrowCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: THEME.lightOrange, justifyContent: 'center', alignItems: 'center' },
  
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { fontSize: 20, fontWeight: '800', color: THEME.text, marginTop: 20 },
  emptySub: { fontSize: 14, color: THEME.textSecondary, marginTop: 8 },
});
