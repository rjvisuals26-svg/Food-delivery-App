import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  TextInput,
  Image,
  Dimensions,
  Platform,
  Animated,
  LayoutAnimation,
  UIManager,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import BASE_URL from '../src/api/apiConfig';



// LayoutAnimation initialization removed to support New Architecture

const { width } = Dimensions.get('window');

// ─── THEME DEFINITION (Solar Ember) ──────────────────────────────
const THEME = {
  bg: '#FCFCFC',
  headerBg: '#FFB900', // Deep Solar Yellow
  primary: '#FF4E00', // Ember Orange
  secondary: '#FF7D00',
  text: '#121212',
  textSecondary: '#666666',
  textMuted: '#9E9E9E',
  white: '#FFFFFF',
  lightOrange: '#FFF1E0',
  danger: '#FF3B30',
  success: '#34C759',
  border: 'rgba(0,0,0,0.06)',
};

// ─── MINI COMPONENTS ───────────────────────────────────────────

const BestSellerCard = ({ item, index, onAdd, isFavorite, onToggleFavorite }) => {
  const slideAnim = useRef(new Animated.Value(20)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 400, delay: index * 100, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 400, delay: index * 100, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.bestSellerCard, { opacity: opacityAnim, transform: [{ translateY: slideAnim }] }]}>
      <View style={{ flex: 1 }}>
        <View style={styles.bsImageWrap}>
          <Image source={{ uri: item.image_url }} style={styles.bsImg} />
          
          {/* Like Button */}
          <TouchableOpacity style={styles.heartBtn} onPress={() => onToggleFavorite(item.id)}>
            <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={16} color={isFavorite ? THEME.danger : THEME.white} />
          </TouchableOpacity>

          <View style={styles.bsRatingBadge}>
            <Ionicons name="star" size={10} color={THEME.headerBg} />
            <Text style={styles.bsRatingText}>{item.rating}</Text>
          </View>
        </View>
        <View style={styles.bsBody}>
          <Text style={styles.bsTitle} numberOfLines={1}>{item.name}</Text>
          <View style={styles.bsFooter}>
            <Text style={styles.bsTime}>{item.delivery_time}</Text>
            <TouchableOpacity style={styles.bsAddBtn} onPress={() => onAdd(item)}>
              <Ionicons name="add" size={16} color={THEME.white} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const OfferBanner = ({ onPress }) => (
  <TouchableOpacity style={styles.offerContainer} activeOpacity={0.9} onPress={onPress}>
    <LinearGradient colors={['#FF4E00', '#FF7D00', '#FF9F00']} start={{x: 0, y: 0}} end={{x: 1, y: 1}} style={styles.offerBanner}>
       <View style={styles.offerTextCol}>
         <Text style={styles.offerTitle}>Ongoing Offers{"\n"}You Can't Miss!</Text>
         <TouchableOpacity style={styles.offerBtn} onPress={onPress}>
           <Text style={styles.offerBtnText}>Order Now</Text>
         </TouchableOpacity>
       </View>
       <View style={styles.offerImgWrap}>
          <Image source={{uri: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=400'}} style={styles.offerImg} />
       </View>
    </LinearGradient>
  </TouchableOpacity>
);

const PremiumCard = ({ item, onAdd, isFavorite, onToggleFavorite }) => (
  <View style={styles.premiumCard}>
    <View style={styles.pcImgWrap}>
      <Image source={{ uri: item.image_url }} style={styles.pcImg} />
      <TouchableOpacity style={styles.pcHeart} onPress={() => onToggleFavorite(item.id)}>
         <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={16} color={isFavorite ? THEME.danger : THEME.white} />
      </TouchableOpacity>
      <View style={styles.pcRating}>
        <Ionicons name="star" size={10} color={THEME.headerBg} />
        <Text style={styles.pcRateText}>{item.rating}</Text>
      </View>
    </View>
    <View style={styles.pcBody}>
      <Text style={styles.pcTitle} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.pcCuisine}>{item.cuisine}</Text>
      <View style={styles.pcFooter}>
        <Text style={styles.pcPrice}>PKR {item.price}</Text>
        <TouchableOpacity style={styles.pcAddBtn} onPress={() => onAdd(item)}>
          <Ionicons name="add" size={18} color={THEME.white} />
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const VerticalFoodCard = ({ item, onAdd, isFavorite, onToggleFavorite }) => (
  <View style={styles.verticalCard}>
    <Image source={{ uri: item.image_url }} style={styles.vcImg} />
    <View style={styles.vcBody}>
      <View style={styles.vcHeader}>
        <Text style={styles.vcTitle} numberOfLines={1}>{item.name}</Text>
        <TouchableOpacity onPress={() => onToggleFavorite(item.id)}>
          <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={22} color={isFavorite ? THEME.danger : THEME.textMuted} />
        </TouchableOpacity>
      </View>
      <Text style={styles.vcCuisine}>{item.cuisine}</Text>
      <View style={styles.vcFooter}>
        <View style={styles.vcMeta}>
          <Ionicons name="time-outline" size={14} color={THEME.textSecondary} />
          <Text style={styles.vcMetaText}>{item.delivery_time}</Text>
          <Ionicons name="star" size={14} color={THEME.headerBg} style={{ marginLeft: 10 }} />
          <Text style={styles.vcMetaText}>{item.rating}</Text>
        </View>
        <TouchableOpacity style={styles.vcAddBtn} onPress={() => onAdd(item)}>
          <Text style={styles.vcAddText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

export default function DesiFoodApp({ goBack, onOpenHistory }) {
  const insets = useSafeAreaInsets();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  
  // New Interactive States
  const [cartItems, setCartItems] = useState([]);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [favorites, setFavorites] = useState([]); 
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'menu' (view all), 'favorites'

  // --- NEW: POPPING FEEDBACK STATES ---
  const [toast, setToast] = useState({ visible: false, message: '', icon: 'cart' });
  const toastPopAnim = useRef(new Animated.Value(100)).current; 
  const cartScaleAnim = useRef(new Animated.Value(1)).current;
  const timeoutRef = useRef(null);

  // const BASE_URL = 'http://192.168.1.113:3000'; // Updated to machine IP for physical device testing


  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`${BASE_URL}/restaurants`);
      const data = await resp.json();
      setRestaurants(data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRestaurants(); }, []);

  // ─── HANDLERS ──────────────────────────────────────────────────
  const showPoppingToast = (message, icon = 'cart') => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    setToast({ visible: true, message, icon });
    
    // 1. Reset and Animate Toast UP
    toastPopAnim.setValue(100);
    Animated.spring(toastPopAnim, {
      toValue: 0,
      useNativeDriver: true,
      friction: 8,
      tension: 40
    }).start();

    // 2. Pulse the Cart Icon
    cartScaleAnim.setValue(1);
    Animated.sequence([
      Animated.timing(cartScaleAnim, { toValue: 1.3, duration: 150, useNativeDriver: true }),
      Animated.spring(cartScaleAnim, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start();

    // 3. Auto Hide
    timeoutRef.current = setTimeout(() => {
      Animated.timing(toastPopAnim, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true
      }).start(() => setToast(prev => ({ ...prev, visible: false })));
    }, 2500);
  };

  const handleAddToCart = (item) => {
    setCartItems(prev => [...prev, { ...item, cartId: Math.random().toString(36).substr(2, 9) }]);
    showPoppingToast(`${item.name} added! 😋`);
  };

  const handleRemoveFromCart = (cartId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCartItems(prev => prev.filter(item => item.cartId !== cartId));
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price || 0), 0);
  };

  const handleToggleFavorite = (id) => {
    LayoutAnimation.easeInEaseOut();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  const switchTab = (tab) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveTab(tab);
  };

  // ─── FILTERING LOGIC ───────────────────────────────────────────
  const filteredData = useMemo(() => {
    let data = restaurants.filter(item => {
      // Normalize strings for robust matching (lowercase and no spaces)
      const normCuisine = (item.cuisine || "").toLowerCase().replace(/\s/g, '');
      const normSelected = selectedCat.toLowerCase().replace(/\s/g, '');
      
      const matchesCuisine = selectedCat === 'All' || normCuisine.includes(normSelected);
      const matchesSearch = item.name && item.name.toLowerCase().includes(search.toLowerCase());
      return matchesCuisine && matchesSearch;
    });

    if (activeTab === 'favorites') {
      data = data.filter(item => favorites.includes(item.id));
    }
    return data;
  }, [restaurants, selectedCat, search, activeTab, favorites]);

  const bestSellers = useMemo(() => filteredData.filter(item => item.is_featured === 1), [filteredData]);
  const popularItems = useMemo(() => [...filteredData].sort((a,b) => b.rating - a.rating).slice(0, 5), [filteredData]);
  const trendingItems = useMemo(() => [...filteredData].sort((a,b) => b.id - a.id).filter(item => item.rating >= 4.5).slice(0, 5), [filteredData]);

  const CUISINES = ['All', 'Pakistani', 'Fast Food', 'Desserts', 'Traditional', 'Street Food', 'Italian'];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { title: 'Good Morning', sub: 'Ready for a fresh breakfast?' };
    if (hour < 16) return { title: 'Good Afternoon', sub: 'Time for a delicious Desi Lunch!' };
    return { title: 'Good Evening', sub: 'Let\'s find you a perfect meal.' };
  };
  const greeting = useMemo(() => getGreeting(), []);

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === 'ios' ? 0 : insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.headerBg} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* 1. SOLAR HEADER SECTION */}
        <View style={styles.headerArea}>
          <View style={styles.topIconsRow}>
            <TouchableOpacity style={styles.backBtn} onPress={goBack}>
              <Ionicons name="grid-outline" size={24} color={THEME.white} />
            </TouchableOpacity>
            <View style={styles.rightIcons}>
              <Animated.View style={{ transform: [{ scale: cartScaleAnim }] }}>
                <TouchableOpacity style={styles.iconCircle} onPress={() => setIsCartVisible(true)}>
                  <Ionicons name="cart-outline" size={22} color={THEME.white} />
                  {cartItems.length > 0 && (
                    <View style={styles.cartBadge}>
                      <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>
              <TouchableOpacity style={styles.avatarCircle}>
                <LinearGradient colors={['#FFF', '#EEE']} style={styles.avatarGrad}>
                  <Text style={styles.avatarLetter}>R</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.greetingTitle}>{activeTab === 'favorites' ? 'Your Favorites' : `${greeting.title}, Rukhsar`}</Text>
          <Text style={styles.greetingSub}>{activeTab === 'favorites' ? 'The dishes you love the most.' : greeting.sub}</Text>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Feather name="search" size={18} color={THEME.textMuted} />
            <TextInput 
              style={styles.searchInput}
              placeholder="Search for biryani, kebabs..."
              placeholderTextColor="#A0A0A0"
              value={search}
              onChangeText={setSearch}
            />
            <TouchableOpacity style={styles.searchBtn}>
              <Ionicons name="options-outline" size={18} color={THEME.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. CATEGORIES FILTER */}
        <View style={styles.section}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
            {CUISINES.map(cat => (
              <TouchableOpacity 
                key={cat} 
                style={[styles.catItem, selectedCat === cat && styles.catItemActive]}
                onPress={() => {
                  LayoutAnimation.easeInEaseOut();
                  setSelectedCat(cat);
                }}
              >
                <View style={[styles.catIconWrap, selectedCat === cat && styles.catIconActive]}>
                  <Ionicons name="restaurant" size={24} color={selectedCat === cat ? THEME.white : THEME.primary} />
                </View>
                <Text style={[styles.catText, selectedCat === cat && styles.catTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* LOADING STATE */}
        {loading ? (
           <ActivityIndicator size="large" color={THEME.primary} style={{ marginTop: 50 }} />
        ) : (
          <>
            {/* VIEW MODE CONTROLLER: HORIZONTAL VS VERTICAL */}
            {activeTab === 'home' ? (
              <>
                {/* 3. BEST SELLER (Horizontal) */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Featured Picks</Text>
                    <TouchableOpacity onPress={() => switchTab('menu')}>
                      <Text style={styles.viewAll}>View All</Text>
                    </TouchableOpacity>
                  </View>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bsScroll}>
                    {bestSellers.map((item, idx) => (
                      <BestSellerCard key={item.id} item={item} index={idx} onAdd={handleAddToCart} isFavorite={favorites.includes(item.id)} onToggleFavorite={handleToggleFavorite} />
                    ))}
                  </ScrollView>
                </View>

                {/* 4. ONGOING OFFERS BANNER */}
                <OfferBanner onPress={() => switchTab('menu')} />

                {/* 5. POPULAR SECTION */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Popular Items ✨</Text>
                    <TouchableOpacity onPress={() => switchTab('menu')}>
                      <Text style={styles.viewAllText}>View All</Text>
                    </TouchableOpacity>
                  </View>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bsScroll}>
                    {popularItems.map(item => (
                      <PremiumCard key={item.id} item={item} onAdd={handleAddToCart} isFavorite={favorites.includes(item.id)} onToggleFavorite={handleToggleFavorite} />
                    ))}
                  </ScrollView>
                </View>

                {/* 6. TRENDING SECTION */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Trending Now 🔥</Text>
                    <TouchableOpacity onPress={() => switchTab('menu')}>
                      <Text style={styles.viewAllText}>View All</Text>
                    </TouchableOpacity>
                  </View>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bsScroll}>
                    {trendingItems.map(item => (
                      <PremiumCard key={item.id} item={item} onAdd={handleAddToCart} isFavorite={favorites.includes(item.id)} onToggleFavorite={handleToggleFavorite} />
                    ))}
                  </ScrollView>
                </View>
              </>
            ) : (
              /* VERTICAL LIST MODE (Menu or Favorites) */
              <View style={styles.verticalSection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{activeTab === 'favorites' ? 'Saved Items' : 'All Menu Items'}</Text>
                  <Text style={styles.itemCount}>{filteredData.length} items</Text>
                </View>
                
                {filteredData.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Ionicons name={activeTab === 'favorites' ? 'heart-dislike-outline' : 'fast-food-outline'} size={60} color={THEME.border} />
                    <Text style={styles.emptyText}>Nothing found here.</Text>
                  </View>
                ) : (
                  filteredData.map(item => (
                    <VerticalFoodCard key={item.id} item={item} onAdd={handleAddToCart} isFavorite={favorites.includes(item.id)} onToggleFavorite={handleToggleFavorite} />
                  ))
                )}
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* 5.5 CART MODAL (Premium View) */}
      <Modal visible={isCartVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Your Orders 🛒</Text>
              <TouchableOpacity onPress={() => setIsCartVisible(false)} style={styles.modalCloseBtn}>
                <Ionicons name="close" size={24} color={THEME.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.cartList}>
              {cartItems.length === 0 ? (
                <View style={styles.emptyCart}>
                  <Ionicons name="basket-outline" size={80} color={THEME.border} />
                  <Text style={styles.emptyCartText}>Your cart is empty</Text>
                  <Text style={styles.emptyCartSub}>Add some delicious items to get started!</Text>
                </View>
              ) : (
                cartItems.map((item, index) => (
                  <View key={item.cartId} style={styles.cartItem}>
                    <Image source={{ uri: item.image_url }} style={styles.cartItemImg} />
                    <View style={styles.cartItemBody}>
                      <Text style={styles.cartItemTitle}>{item.name}</Text>
                      <Text style={styles.cartItemCuisine}>{item.cuisine}</Text>
                      <Text style={styles.cartItemPrice}>PKR {item.price}</Text>
                    </View>
                    <TouchableOpacity style={styles.cartRemoveBtn} onPress={() => handleRemoveFromCart(item.cartId)}>
                      <Ionicons name="trash-outline" size={20} color={THEME.danger} />
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </ScrollView>

            {cartItems.length > 0 && (
              <View style={styles.cartFooter}>
                <View style={styles.summaryBox}>
                  <View style={styles.summaryRowMini}>
                    <Text style={styles.sumLabel}>Subtotal</Text>
                    <Text style={styles.sumVal}>PKR {calculateTotal()}</Text>
                  </View>
                  <View style={styles.summaryRowMini}>
                    <Text style={styles.sumLabel}>Delivery Fee</Text>
                    <Text style={styles.sumVal}>PKR 150</Text>
                  </View>
                  <View style={styles.summaryRowMini}>
                    <Text style={styles.sumLabel}>Vat (5%)</Text>
                    <Text style={styles.sumVal}>PKR {(calculateTotal() * 0.05).toFixed(0)}</Text>
                  </View>
                </View>

                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Grand Total</Text>
                  <Text style={styles.totalVal}>
                    PKR {(calculateTotal() + 150 + (calculateTotal() * 0.05)).toFixed(0)}
                  </Text>
                </View>

                <TouchableOpacity style={styles.checkoutBtn} onPress={async () => {
                  if (cartItems.length === 0) return;
                  
                  try {
                    const total = calculateTotal();
                    const grandTotal = total + 150 + (total * 0.05);
                    const response = await fetch(`${BASE_URL}/orders`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        total_price: grandTotal.toFixed(0),
                        items: cartItems.map(item => ({ name: item.name, price: item.price }))
                      })
                    });

                    if (response.ok) {
                      Alert.alert("Order Placed! 🎉", "Your food is being prepared with love.");
                      setCartItems([]);
                      setIsCartVisible(false);
                    } else {
                      const err = await response.json();
                      Alert.alert("Checkout Error", err.error || "Failed to place order");
                    }
                  } catch (e) {
                    console.error('Checkout failed', e);
                    Alert.alert("Sync Error", "Could not connect to the chef. Try again!");
                  }
                }}>
                  <LinearGradient colors={[THEME.primary, THEME.secondary]} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.checkoutGrad}>
                    <Text style={styles.checkoutText}>Confirm Order</Text>
                    <Ionicons name="arrow-forward" size={20} color={THEME.white} />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* 6. BOTTOM NAVIGATION (Functional) */}
      <View style={[styles.bottomNav, { paddingBottom: Platform.OS === 'ios' ? insets.bottom : 15 }]}>
        
        <TouchableOpacity style={styles.navItem} onPress={() => switchTab('home')}>
          {activeTab === 'home' && <View style={styles.activeIndicator} />}
          <Ionicons name="home" size={24} color={activeTab === 'home' ? THEME.white : 'rgba(255,255,255,0.5)'} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => switchTab('menu')}>
          {activeTab === 'menu' && <View style={styles.activeIndicator} />}
          <MaterialCommunityIcons name="room-service-outline" size={26} color={activeTab === 'menu' ? THEME.white : 'rgba(255,255,255,0.5)'} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => switchTab('favorites')}>
          {activeTab === 'favorites' && <View style={styles.activeIndicator} />}
          <Ionicons name="heart" size={26} color={activeTab === 'favorites' ? THEME.white : 'rgba(255,255,255,0.5)'} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={onOpenHistory}>
          <Ionicons name="clipboard-outline" size={24} color="rgba(255,255,255,0.5)" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person-outline" size={24} color="rgba(255,255,255,0.5)" />
        </TouchableOpacity>

      </View>

      {/* --- POPPING TOAST NOTIFICATION --- */}
      {toast.visible && (
        <Animated.View style={[styles.toastWrapper, { transform: [{ translateY: toastPopAnim }] }]}>
          <LinearGradient colors={[THEME.primary, THEME.secondary]} start={{x:0, y:0}} end={{x:1, y:0}} style={styles.toastContainer}>
             <Ionicons name={toast.icon} size={20} color={THEME.white} />
             <Text style={toast.message.length > 25 ? styles.toastTextSmall : styles.toastText}>{toast.message}</Text>
          </LinearGradient>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.bg },
  scrollContent: { paddingBottom: 120 },
  
  // Header
  headerArea: { 
    backgroundColor: THEME.headerBg, paddingHorizontal: 20, paddingBottom: 40,
    borderBottomLeftRadius: 35, borderBottomRightRadius: 35, paddingTop: 20
  },
  topIconsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  backBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'flex-start' },
  rightIcons: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.25)', justifyContent: 'center', alignItems: 'center' },
  cartBadge: { position: 'absolute', top: -5, right: -5, width: 20, height: 20, borderRadius: 10, backgroundColor: THEME.primary, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: THEME.headerBg },
  cartBadgeText: { color: THEME.white, fontSize: 10, fontWeight: '900' },
  avatarCircle: { width: 42, height: 42, borderRadius: 21, overflow: 'hidden', borderWidth: 1.5, borderColor: THEME.white },
  avatarGrad: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  avatarLetter: { color: THEME.primary, fontSize: 18, fontWeight: '900' },
  
  greetingTitle: { fontSize: 26, fontWeight: '900', color: THEME.white, marginBottom: 4 },
  greetingSub: { fontSize: 14, color: 'rgba(255,255,255,0.85)', fontWeight: '600', marginBottom: 25 },
  
  searchContainer: { flexDirection: 'row', backgroundColor: THEME.white, borderRadius: 25, height: 55, alignItems: 'center', paddingHorizontal: 20, elevation: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 15 },
  searchInput: { flex: 1, height: '100%', fontSize: 15, color: THEME.text, fontWeight: '600', marginLeft: 10 },
  searchBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: THEME.primary, justifyContent: 'center', alignItems: 'center' },

  // Categories
  section: { marginTop: 30 },
  catScroll: { paddingHorizontal: 20, gap: 20 },
  catItem: { alignItems: 'center', gap: 10 },
  catIconWrap: { width: 64, height: 64, borderRadius: 32, backgroundColor: THEME.white, justifyContent: 'center', alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  catIconActive: { backgroundColor: THEME.primary },
  catText: { fontSize: 12, fontWeight: '700', color: THEME.textSecondary },
  catTextActive: { color: THEME.primary, fontWeight: '900' },

  // Shared Section Header
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
  sectionTitle: { fontSize: 22, fontWeight: '900', color: THEME.text },
  viewAll: { fontSize: 14, fontWeight: '800', color: THEME.primary },
  itemCount: { fontSize: 14, fontWeight: '600', color: THEME.textMuted },
  
  // Best Sellers (Horizontal)
  bsScroll: { paddingHorizontal: 20, gap: 20 },
  bestSellerCard: { width: 160, backgroundColor: THEME.white, borderRadius: 28, elevation: 6, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 15, overflow: 'hidden', marginBottom: 10 },
  bsImageWrap: { height: 140, width: '100%' },
  bsImg: { width: '100%', height: '100%' },
  heartBtn: { position: 'absolute', top: 12, left: 12, backgroundColor: 'rgba(0,0,0,0.4)', padding: 6, borderRadius: 12 },
  bsRatingBadge: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(0,0,0,0.6)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, gap: 4 },
  bsRatingText: { color: '#FFF', fontSize: 10, fontWeight: '900' },
  bsBody: { padding: 15 },
  bsTitle: { fontSize: 15, fontWeight: '800', color: THEME.text, marginBottom: 8 },
  bsFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bsTime: { fontSize: 12, fontWeight: '700', color: THEME.textSecondary },
  bsAddBtn: { width: 28, height: 28, borderRadius: 8, backgroundColor: THEME.primary, justifyContent: 'center', alignItems: 'center' },

  // Promo Banner
  promoContainer: { paddingHorizontal: 20, marginTop: 30 },
  promoBanner: { borderRadius: 30, flexDirection: 'row', alignItems: 'center', overflow: 'hidden', height: 120, elevation: 10, shadowColor: THEME.primary, shadowOpacity: 0.3, shadowRadius: 15 },
  promoTextCol: { flex: 1, paddingLeft: 25, justifyContent: 'center' },
  promoSub: { color: THEME.white, fontSize: 14, fontWeight: '600', marginBottom: 6, lineHeight: 18 },
  promoTitle: { color: THEME.white, fontSize: 28, fontWeight: '900' },
  promoImg: { width: 170, height: '130%', position: 'absolute', right: -30, top: -10 },

  // Professional Promotions
  offerContainer: { paddingHorizontal: 20, marginTop: 25 },
  offerBanner: { borderRadius: 30, height: 160, flexDirection: 'row', overflow: 'hidden', elevation: 15, shadowColor: THEME.primary, shadowOpacity: 0.4, shadowRadius: 20 },
  offerTextCol: { flex: 1.2, paddingLeft: 25, justifyContent: 'center' },
  offerTitle: { color: THEME.white, fontSize: 18, fontWeight: '900', lineHeight: 28, marginBottom: 15, textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 5 },
  offerBtn: { backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, alignSelf: 'flex-start', borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' },
  offerBtnText: { color: THEME.white, fontWeight: '900', fontSize: 13 },
  offerImgWrap: { flex: 0.8, backgroundColor: 'rgba(255,255,255,0.1)', borderTopLeftRadius: 100, borderBottomLeftRadius: 100, overflow: 'hidden' },
  offerImg: { width: '100%', height: '100%' },

  // Premium Grid / Scroll Cards
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, paddingRight: 20 },
  viewAllText: { color: THEME.primary, fontWeight: '800', fontSize: 13 },
  
  premiumCard: { width: 170, backgroundColor: THEME.white, borderRadius: 25, padding: 10, marginRight: 15, elevation: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 15 },
  pcImgWrap: { height: 130, borderRadius: 20, overflow: 'hidden', marginBottom: 10 },
  pcImg: { width: '100%', height: '100%' },
  pcHeart: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.3)', padding: 6, borderRadius: 12 },
  pcRating: { position: 'absolute', bottom: 10, left: 10, backgroundColor: 'rgba(255,255,255,0.95)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 8, gap: 3 },
  pcRateText: { fontSize: 10, fontWeight: '900', color: THEME.text },
  
  pcBody: { paddingHorizontal: 4 },
  pcTitle: { fontSize: 14, fontWeight: '800', color: THEME.text, marginBottom: 2 },
  pcCuisine: { fontSize: 10, fontWeight: '600', color: THEME.textSecondary, marginBottom: 8 },
  pcFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pcPrice: { fontSize: 13, fontWeight: '900', color: THEME.primary },
  pcAddBtn: { width: 32, height: 32, borderRadius: 10, backgroundColor: THEME.primary, justifyContent: 'center', alignItems: 'center' },

  // Vertical List Mode
  verticalSection: { paddingHorizontal: 20, marginTop: 30 },
  verticalCard: { flexDirection: 'row', backgroundColor: THEME.white, borderRadius: 24, padding: 12, marginBottom: 16, elevation: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  vcImg: { width: 100, height: 100, borderRadius: 16 },
  vcBody: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  vcHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  vcTitle: { fontSize: 16, fontWeight: '800', color: THEME.text, flex: 1, marginRight: 10 },
  vcCuisine: { fontSize: 13, color: THEME.textSecondary, fontWeight: '600', marginBottom: 10 },
  vcFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  vcMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  vcMetaText: { fontSize: 12, fontWeight: '700', color: THEME.textMuted },
  vcAddBtn: { backgroundColor: THEME.lightOrange, paddingHorizontal: 15, paddingVertical: 6, borderRadius: 12 },
  vcAddText: { color: THEME.primary, fontWeight: '800', fontSize: 12 },
  
  emptyState: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: THEME.textMuted, fontSize: 16, fontWeight: '600', marginTop: 10 },

  // Bottom Nav
  bottomNav: { 
    position: 'absolute', bottom: 0, width: '100%', 
    backgroundColor: THEME.primary, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', 
    paddingTop: 20, borderTopLeftRadius: 35, borderTopRightRadius: 35, 
    elevation: 20, shadowColor: THEME.primary, shadowOpacity: 0.4, shadowRadius: 20
  },
  navItem: { alignItems: 'center', padding: 10 },
  activeIndicator: { position: 'absolute', top: -10, width: 4, height: 4, borderRadius: 2, backgroundColor: THEME.white },

  // Cart Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: THEME.white, borderTopLeftRadius: 40, borderTopRightRadius: 40, height: '80%', padding: 25 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 24, fontWeight: '900', color: THEME.text },
  modalCloseBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: THEME.bg, justifyContent: 'center', alignItems: 'center' },
  
  cartList: { flex: 1 },
  emptyCart: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
  emptyCartText: { fontSize: 20, fontWeight: '800', color: THEME.text, marginTop: 20 },
  emptyCartSub: { fontSize: 14, color: THEME.textSecondary, marginTop: 8 },
  
  cartItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: THEME.white, marginBottom: 15, padding: 12, borderRadius: 20, borderSize: 1, borderColor: THEME.border, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  cartItemImg: { width: 70, height: 70, borderRadius: 15 },
  cartItemBody: { flex: 1, marginLeft: 15 },
  cartItemTitle: { fontSize: 16, fontWeight: '800', color: THEME.text },
  cartItemCuisine: { fontSize: 12, color: THEME.textSecondary, marginBottom: 4 },
  cartItemPrice: { fontSize: 15, fontWeight: '900', color: THEME.primary },
  cartRemoveBtn: { padding: 10 },
  
  cartFooter: { borderTopWidth: 1, borderTopColor: THEME.border, paddingTop: 20 },
  summaryBox: { marginBottom: 15, backgroundColor: '#F9FAFB', padding: 15, borderRadius: 20 },
  summaryRowMini: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  sumLabel: { color: THEME.textSecondary, fontSize: 13, fontWeight: '600' },
  sumVal: { color: THEME.text, fontSize: 13, fontWeight: '800' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  totalLabel: { fontSize: 16, fontWeight: '900', color: THEME.text },
  totalValue: { fontSize: 24, fontWeight: '900', color: THEME.text },
  checkoutBtn: { height: 65, borderRadius: 20, overflow: 'hidden' },
  checkoutGrad: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  checkoutText: { color: THEME.white, fontSize: 18, fontWeight: '900' },
  // Toast Style
  toastWrapper: {
    position: 'absolute',
    bottom: 110,
    alignSelf: 'center',
    width: '90%',
    zIndex: 9999,
  },
  toastContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 20,
    gap: 12,
    elevation: 20,
    shadowColor: THEME.primary,
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  toastText: {
    color: THEME.white,
    fontWeight: '900',
    fontSize: 14,
  },
  toastTextSmall: {
    color: THEME.white,
    fontWeight: '800',
    fontSize: 12,
    flex: 1,
  },
});
