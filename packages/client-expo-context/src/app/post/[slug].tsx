import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { usePosts } from "../../../src/context/PostsContext";
import { Post } from "../../../src/types";

export default function PostDetailScreen() {
  const { slug } = useLocalSearchParams();
  const { fetchPostBySlug, loading, error } = usePosts();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    if (slug && typeof slug === "string") {
      fetchPostBySlug(slug).then(setPost).catch(console.error); // Handle error locally if needed, context also sets error state
    }
  }, [slug, fetchPostBySlug]);

  if (loading || !post) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Check if post and its properties exist before accessing
  const authorUsername = post.author?.username || "Unknown Author";
  const postDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString()
    : "Unknown Date";

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{post.title}</Text>
      <View style={styles.metaContainer}>
        <Text style={styles.author}>By {authorUsername}</Text>
        <Text style={styles.date}>{postDate}</Text>
      </View>
      <Text style={styles.body}>{post.body}</Text>
      {/* Optional: Display tags */}
      {post.tagList && post.tagList.length > 0 && (
        <View style={styles.tagsContainer}>
          {post.tagList.map((tag) => (
            <Text key={tag} style={styles.tag}>
              {tag}
            </Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#fff",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  author: {
    fontSize: 14,
    color: "#5cb85c",
  },
  date: {
    fontSize: 14,
    color: "#999",
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 15,
  },
  tag: {
    fontSize: 12,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 5,
    marginBottom: 5,
  },
});
