import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BrandTripCreate from '@/components/trips/BrandTripCreate';

export default function CreateTripScreen() {
  // BrandTripCreate internally uses useLocalSearchParams() to access route params (destinationId, etc.)
  // and useAppConfig() for active brand colors and theme.
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <BrandTripCreate />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f1ff',
  },
});
