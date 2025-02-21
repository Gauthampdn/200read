import { Slot } from 'expo-router';
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo';
import { tokenCache } from '../cache';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

// Get the publishable key from Expo's environment system
const publishableKey = "pk_test_bmF0dXJhbC1zdGFybGluZy04Mi5jbGVyay5hY2NvdW50cy5kZXYk";

if (!publishableKey) {
  throw new Error("Missing Publishable Key");
}

export default function RootLayout() {
  return (
    <ClerkProvider 
      publishableKey={publishableKey}
      tokenCache={tokenCache}
    >
      <ClerkLoaded>
        <QueryClientProvider client={queryClient}>
          <Slot />
        </QueryClientProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
} 