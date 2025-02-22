import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useAuth, useUser } from '@clerk/clerk-expo';

export default function ArticlesScreen() {
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  
  // Check if user is pro (you'll need to set this metadata in Clerk)
  const isPro = user?.publicMetadata?.isPro === true;

  const { data: articles, isLoading } = useQuery({
    queryKey: ['pastWeekArticles'],
    queryFn: async () => {
      const token = await getToken();
      const response = await fetch('http://localhost:4000/api/articles/past-week', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch articles');
      const data = await response.json();
      
      // If not pro, limit to 7 articles
      if (!isPro && data.length > 7) {
        return data.slice(0, 7);
      }
      return data;
    },
    enabled: isSignedIn,
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
      {/* {!isPro && (
        <View style={styles.proPrompt}>
          <Text style={styles.proText}>
            Upgrade to Pro to access all archived articles
          </Text>
        </View>
      )} */}
      
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
    backgroundColor: '#1A1A1A',
  },
  message: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 20,
  },
  articleCard: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: '#2C2C2E',
    marginBottom: 10,
    marginHorizontal: 10,
    borderRadius: 12,
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
    color: '#FFFFFF',
    marginBottom: 5,
  },
  date: {
    color: '#999',
    marginBottom: 5,
  },
  description: {
    color: '#CCCCCC',
    fontSize: 14,
    lineHeight: 20,
  },
  proPrompt: {
    backgroundColor: '#2C2C2E',
    padding: 15,
    margin: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0A84FF',
  },
  proText: {
    textAlign: 'center',
    color: '#0A84FF',
    fontSize: 14,
  },
}); 