import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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

export default function OrderDetails({ onBack, order }) {
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  // const BASE_URL = 'http://192.168.1.113:3000';


  useEffect(() => {
    fetchOrderItems();
  }, []);

  const fetchOrderItems = async () => {
    try {
      const resp = await fetch(`${BASE_URL}/orders/${order.id}`);
      const data = await resp.json();
      setItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const subtotal = items.reduce((acc, item) => acc + parseFloat(item.price), 0);
  const tax = subtotal * 0.05;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="chevron-back" size={24} color={THEME.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Order Details</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Order Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusIconWrap}>
            <Ionicons name="fast-food" size={32} color={THEME.white} />
          </View>
          <View style={styles.statusInfo}>
            <Text style={styles.statusLabel}>Order Status</Text>
            <Text style={styles.statusValue}>{order.status}</Text>
          </View>
          <View style={styles.orderMeta}>
            <Text style={styles.metaId}>#QB-{order.id}</Text>
            <Text style={styles.metaDate}>{new Date(order.created_at).toLocaleDateString()}</Text>
          </View>
        </View>

        {/* Items List */}
        <Text style={styles.sectionTitle}>Review Items</Text>
        {loading ? (
          <ActivityIndicator size="small" color={THEME.primary} style={{ marginTop: 20 }} />
        ) : (
          <View style={styles.itemsContainer}>
            {items.map((item, idx) => (
              <View key={idx} style={styles.itemRow}>
                <View style={styles.qtyBox}><Text style={styles.qtyText}>1x</Text></View>
                <Text style={styles.itemName}>{item.item_name}</Text>
                <Text style={styles.itemPrice}>PKR {item.price}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Price Breakdown */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>PKR {subtotal}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Vat (5%)</Text>
            <Text style={styles.summaryValue}>PKR {tax.toFixed(0)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>PKR 150</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Grand Total</Text>
            <Text style={styles.totalValue}>PKR {order.total_price}</Text>
          </View>
        </View>

        {/* Location Simulation */}
        <View style={styles.addressCard}>
          <Ionicons name="location-sharp" size={24} color={THEME.primary} />
          <View style={styles.addressInfo}>
            <Text style={styles.addressTitle}>Delivery Address</Text>
            <Text style={styles.addressText}>House 123, Block 4, Gulshan-e-Iqbal, Karachi</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.reorderBtn} 
          onPress={() => alert('Feature coming soon: Items added to cart!')}
        >
          <LinearGradient colors={[THEME.primary, THEME.secondary]} style={styles.reorderGrad}>
             <Text style={styles.reorderText}>Reorder Now</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: THEME.white },
  backBtn: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '900', color: THEME.text },
  
  scrollContent: { padding: 20 },
  
  statusCard: { backgroundColor: THEME.white, borderRadius: 24, padding: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 25, elevation: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  statusIconWrap: { width: 56, height: 56, borderRadius: 20, backgroundColor: THEME.primary, justifyContent: 'center', alignItems: 'center' },
  statusInfo: { flex: 1, marginLeft: 15 },
  statusLabel: { fontSize: 13, color: THEME.textSecondary, fontWeight: '700', marginBottom: 2 },
  statusValue: { fontSize: 18, fontWeight: '900', color: THEME.primary },
  orderMeta: { alignItems: 'flex-end' },
  metaId: { fontSize: 13, fontWeight: '900', color: THEME.text },
  metaDate: { fontSize: 11, color: THEME.textMuted, fontWeight: '600', marginTop: 4 },
  
  sectionTitle: { fontSize: 18, fontWeight: '900', color: THEME.text, marginBottom: 15 },
  itemsContainer: { backgroundColor: THEME.white, borderRadius: 24, padding: 10, marginBottom: 25 },
  itemRow: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  qtyBox: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, backgroundColor: '#FFF5F0', marginRight: 12 },
  qtyText: { color: THEME.primary, fontSize: 12, fontWeight: '900' },
  itemName: { flex: 1, fontSize: 15, fontWeight: '700', color: THEME.text },
  itemPrice: { fontSize: 15, fontWeight: '800', color: THEME.textSecondary },
  
  summaryContainer: { backgroundColor: THEME.white, borderRadius: 24, padding: 20, marginBottom: 25 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  summaryLabel: { fontSize: 14, color: THEME.textSecondary, fontWeight: '600' },
  summaryValue: { fontSize: 14, color: THEME.text, fontWeight: '800' },
  divider: { height: 1, backgroundColor: THEME.border, marginVertical: 10 },
  totalLabel: { fontSize: 16, fontWeight: '900', color: THEME.text },
  totalValue: { fontSize: 20, fontWeight: '900', color: THEME.primary },
  
  addressCard: { backgroundColor: THEME.white, borderRadius: 24, padding: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  addressInfo: { marginLeft: 15, flex: 1 },
  addressTitle: { fontSize: 14, fontWeight: '900', color: THEME.text, marginBottom: 4 },
  addressText: { fontSize: 12, color: THEME.textSecondary, lineHeight: 18 },
  
  reorderBtn: { height: 60, borderRadius: 20, overflow: 'hidden', marginTop: 10 },
  reorderGrad: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  reorderText: { color: THEME.white, fontSize: 16, fontWeight: '900' },
});
