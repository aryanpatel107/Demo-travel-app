import React from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Navbar from '@/components/Navbar';
import { useBrandConfig } from '@/contexts/BrandConfigContext';
import { useWishlist } from '@/contexts/WishlistContext';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { branding } = useBrandConfig();
  const { wishlistCount } = useWishlist();
  const primaryColor = branding.primaryColor || '#2882c5';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: primaryColor,
        tabBarInactiveTintColor: '#64748B',
        header: () => <Navbar />,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E2E8F0',
          height: 52 + Math.max(insets.bottom, 8),
          paddingBottom: Math.max(insets.bottom, 8),
          paddingTop: 6,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="home" size={size ? size - 4 : 18} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="destinations"
        options={{
          title: 'Destinations',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="map-marked-alt" size={size ? size - 4 : 18} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: 'Wishlist',
          tabBarBadge: wishlistCount > 0 ? wishlistCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: primaryColor,
            color: '#FFFFFF',
            fontSize: 10,
            lineHeight: 14,
          },
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="heart" size={size ? size - 4 : 18} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          title: 'My Trips',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="suitcase" size={size ? size - 4 : 18} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
