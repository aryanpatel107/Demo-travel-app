import React from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import Navbar from '@/components/Navbar';
import { useBrandConfig } from '@/contexts/BrandConfigContext';

export default function TabLayout() {
  const { branding } = useBrandConfig();
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
