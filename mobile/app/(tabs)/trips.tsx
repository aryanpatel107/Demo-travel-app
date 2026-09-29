import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useBrandConfig } from '@/contexts/BrandConfigContext';
import { useAuth } from '@/contexts/AuthContext';
import { getTripsApi, type TripItem } from '@/lib/apiClient';

export default function TripsScreen() {
  const router = useRouter();
  const { branding, brandKey } = useBrandConfig();
  const { isAuthenticated } = useAuth();

  const primaryColor = branding.primaryColor || '#2882c5';

  const [trips, setTrips] = useState<TripItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrips = useCallback(async (isRefresh = false) => {
    if (!isAuthenticated) {
      setTrips([]);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const data = await getTripsApi(brandKey);
      setTrips(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (/failed to fetch|network request failed|networkerror|econnrefused/i.test(err.message)) {
          setError(
            'Unable to connect to the server to load trips. Please ensure the API is running.'
          );
        } else {
          setError(err.message);
        }
      } else {
        setError('Unable to load your trips. Please try again.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isAuthenticated, brandKey]);

  useFocusEffect(
    useCallback(() => {
      void fetchTrips();
    }, [fetchTrips])
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        isAuthenticated ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void fetchTrips(true)}
            colors={[primaryColor]}
            tintColor={primaryColor}
          />
        ) : undefined
      }
    >
      {/* Screen Title & Create Trip Button */}
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.brandEyebrow, { color: primaryColor }]}>
            {branding.name.toUpperCase()}
          </Text>
          <Text style={styles.screenTitle}>My Trips</Text>
        </View>

        {isAuthenticated ? (
          <Pressable
            onPress={() => router.push('/trips/create' as never)}
            style={[styles.createHeaderBtn, { backgroundColor: primaryColor }]}
          >
            <Text style={styles.createHeaderBtnText}>+ Create trip</Text>
          </Pressable>
        ) : null}
      </View>

      {/* When NOT Authenticated: Prompt Login */}
      {!isAuthenticated ? (
        <View style={styles.loginPromptCard}>
          <Text style={styles.promptIcon}>🔒</Text>
          <Text style={styles.promptTitle}>Please login to view your trips</Text>
          <Text style={styles.promptSubtitle}>
            Sign in to access your saved itineraries and travel bookings.
          </Text>

          <Pressable
            onPress={() => router.push('/login' as never)}
            style={[styles.loginBtn, { backgroundColor: primaryColor }]}
          >
            <Text style={styles.loginBtnText}>Login</Text>
          </Pressable>
        </View>
      ) : loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={primaryColor} />
          <Text style={styles.loadingText}>Loading your trips...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Error Loading Trips</Text>
          <Text style={styles.errorMsg}>{error}</Text>
          <Pressable
            onPress={() => void fetchTrips()}
            style={[styles.retryBtn, { borderColor: primaryColor }]}
          >
            <Text style={[styles.retryBtnText, { color: primaryColor }]}>Try Again</Text>
          </Pressable>
        </View>
      ) : trips.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>✈️</Text>
          <Text style={styles.emptyTitle}>No trips yet</Text>
          <Text style={styles.emptySubtitle}>
            You have no active trips booked on {branding.name}. Explore destinations or check back after making a reservation.
          </Text>
          <Pressable
            onPress={() => router.push('/trips/create' as never)}
            style={[styles.exploreBtn, { backgroundColor: primaryColor, marginBottom: 8 }]}
          >
            <Text style={styles.exploreBtnText}>Create trip</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push('/(tabs)' as never)}
            style={styles.homeLinkBtn}
          >
            <Text style={styles.homeLinkText}>Go to Home</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.tripsList}>
          {trips.map((trip) => {
            const isPaid = trip.paymentStatus === 'paid';
            return (
              <View key={trip.id} style={styles.tripCard}>
                <View style={styles.tripHeader}>
                  <Text style={styles.tripDestName} numberOfLines={1}>
                    {trip.destinationName || 'Destination Trip'}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      isPaid ? styles.statusPaid : styles.statusPending,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        isPaid ? styles.statusTextPaid : styles.statusTextPending,
                      ]}
                    >
                      {isPaid ? 'Paid' : 'Pending'}
                    </Text>
                  </View>
                </View>

                <View style={styles.tripDetails}>
                  <Text style={styles.detailText}>
                    📅 {trip.startDate ? trip.startDate.slice(0, 10) : 'TBD'} →{' '}
                    {trip.endDate ? trip.endDate.slice(0, 10) : 'TBD'}
                  </Text>
                  <Text style={styles.detailText}>
                    👥 {trip.travelers} traveler{trip.travelers === 1 ? '' : 's'}
                  </Text>
                </View>

                {trip.notes ? (
                  <Text style={styles.tripNotes} numberOfLines={2}>
                    📝 {trip.notes}
                  </Text>
                ) : null}
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  brandEyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 2,
  },
  loginPromptCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginTop: 24,
    gap: 10,
  },
  promptIcon: {
    fontSize: 34,
    marginBottom: 4,
  },
  promptTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  promptSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 280,
  },
  loginBtn: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#991B1B',
  },
  errorMsg: {
    fontSize: 12,
    color: '#B91C1C',
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
  },
  retryBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 24,
    gap: 8,
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 280,
  },
  exploreBtn: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  exploreBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  tripsList: {
    gap: 12,
  },
  tripCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    gap: 8,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tripDestName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusPaid: {
    backgroundColor: '#DCFCE7',
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusTextPaid: {
    color: '#15803D',
  },
  statusTextPending: {
    color: '#B45309',
  },
  tripDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  tripNotes: {
    fontSize: 12,
    color: '#64748B',
    fontStyle: 'italic',
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 6,
  },
  createHeaderBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  createHeaderBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  homeLinkBtn: {
    paddingVertical: 4,
  },
  homeLinkText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
});
