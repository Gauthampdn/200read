import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-expo';

export default function TodayScreen() {
  const { isSignedIn } = useAuth();

  const { data: article, isLoading } = useQuery({
    queryKey: ['todayArticle'],
    queryFn: async () => {
      console.log('Fetching today article...');
      const response = await fetch('http://localhost:4000/api/articles/today');
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      return data;
    },
  });

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading today's article...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image 
        source={{ uri: article?.image || 'https://via.placeholder.com/400x200' }}
        style={styles.image}
      />
      <View style={styles.content}>
        <Text style={styles.title}>{article?.name}</Text>
        <Text style={styles.date}>
          {new Date(article?.dateCreated).toLocaleDateString()}
        </Text>
        <Text style={styles.description}>{article?.description}</Text>
        <Text style={styles.text}>{article?.text}</Text>
        
        {!isSignedIn && (
          <View style={styles.signInPrompt}>
            <Text style={styles.promptText}>
              Sign in to access the past 7 days of articles
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  image: {
    width: '100%',
    height: 200,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  date: {
    color: '#666',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#444',
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  signInPrompt: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  promptText: {
    textAlign: 'center',
    color: '#666',
  },
}); 