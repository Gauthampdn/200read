import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useAuth, useUser } from '@clerk/clerk-expo';

export default function ArticlesScreen() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  
  // Check if user is pro (you'll need to set this metadata in Clerk)
  const isPro = user?.publicMetadata?.isPro === true;

  const { data: articles, isLoading } = useQuery({
    queryKey: ['pastWeekArticles'],
    queryFn: async () => {
      console.log('Fetching articles...');
      const response = await fetch('http://localhost:4000/api/articles/past-week');
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Articles fetched:', data.length);
      
      // If not pro, limit to 7 articles
      if (!isPro && data.length > 7) {
        return data.slice(0, 7);
      }
      return data;
    },
    enabled: isSignedIn, // Only fetch if user is signed in
  });

  if (!isSignedIn) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Sign in to view archived articles</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Loading articles...</Text>
      </View>
    );
  }

  if (!articles?.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>No articles found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!isPro && (
        <View style={styles.proPrompt}>
          <Text style={styles.proText}>
            Upgrade to Pro to access all archived articles
          </Text>
        </View>
      )}
      
      <FlatList
        data={articles}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.articleCard}>
            <Image 
              source={{ uri: item.image || 'https://via.placeholder.com/100' }} 
              style={styles.thumbnail} 
            />
            <View style={styles.articleInfo}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.date}>
                {new Date(item.dateCreated).toLocaleDateString()}
              </Text>
              <Text 
                numberOfLines={2} 
                style={styles.description}
              >
                {item.description}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  message: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  proPrompt: {
    backgroundColor: '#f0f8ff',
    padding: 15,
    margin: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  proText: {
    textAlign: 'center',
    color: '#007AFF',
    fontSize: 14,
  },
  articleCard: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  articleInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  date: {
    color: '#666',
    marginBottom: 5,
  },
  description: {
    color: '#444',
    fontSize: 14,
    lineHeight: 20,
  },
}); 