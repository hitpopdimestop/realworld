import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { usePosts } from "../../context/PostsContext";
import { useAuth } from "../../context/AuthContext";
import { apiClient } from "../../api/client";
import { Post } from "../../types";

const PostDetailScreen = () => {
  const { slug } = useLocalSearchParams();
  const {
    posts,
    fetchPostBySlug,
    loading,
    error,
    updatePostFavoriteStatus,
    clearTags,
    toggleTag,
  } = usePosts();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    if (slug && typeof slug === "string") {
      // First check if the post exists in the context
      const existingPost = posts.find((p) => p.slug === slug);
      if (existingPost) {
        setPost(existingPost);
      } else {
        // If not in context, fetch from API
        fetchPostBySlug(slug).then(setPost).catch(console.error);
      }
    }
  }, [slug, posts, fetchPostBySlug]);

  // Keep post updated when context changes (e.g., favorite status changes)
  useEffect(() => {
    if (slug && typeof slug === "string" && post) {
      const updatedPost = posts.find((p) => p.slug === slug);
      if (
        updatedPost &&
        (updatedPost.favorited !== post.favorited ||
          updatedPost.favoritesCount !== post.favoritesCount)
      ) {
        setPost(updatedPost);
      }
    }
  }, [posts, slug, post]);

  const handleFavorite = async () => {
    if (!post) return;

    if (!user) {
      router.push("/(auth)/login");
      return;
    }

    try {
      let updatedPost: Post;
      if (post.favorited) {
        const response = await apiClient.unfavoriteArticle(post.slug);
        updatedPost = response.article;
      } else {
        const response = await apiClient.favoriteArticle(post.slug);
        updatedPost = response.article;
      }
      setPost(updatedPost);
      // Update the posts context so home page reflects the change
      updatePostFavoriteStatus(
        updatedPost.slug,
        updatedPost.favorited,
        updatedPost.favoritesCount
      );
    } catch (err) {
      console.error("Failed to update favorite status:", err);
    }
  };

  const handleTagPress = (tag: string) => {
    // Clear all tags and select only this tag, then navigate to home page
    clearTags();
    toggleTag(tag);
    router.push("/");
  };

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

  const authorUsername = post.author?.username || "Unknown Author";
  const postDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString()
    : "Unknown Date";

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <FontAwesome name="arrow-left" size={20} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleFavorite}
        >
          <FontAwesome
            name={post.favorited ? "heart" : "heart-o"}
            size={20}
            color={post.favorited ? "#5CB85C" : "#999"}
          />
          <Text style={styles.favoriteCount}>{post.favoritesCount}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>{post.title}</Text>
      </View>

      <View style={styles.metaContainer}>
        <Text style={styles.author}>By {authorUsername}</Text>
        <Text style={styles.date}>{postDate}</Text>
      </View>

      <Text style={styles.body}>{post.body}</Text>

      {/* Optional: Display tags */}
      {post.tagList && post.tagList.length > 0 && (
        <View style={styles.tagsContainer}>
          {post.tagList.map((tag) => (
            <TouchableOpacity
              key={tag}
              style={styles.tag}
              onPress={() => handleTagPress(tag)}
            >
              <Text style={styles.tagText}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

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
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    padding: 8,
    backgroundColor: "#f8f9fa",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  header: {
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  favoriteButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#f8f9fa",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  favoriteCount: {
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
    fontWeight: "500",
  },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  author: {
    fontSize: 14,
    color: "#5cb85c",
    fontWeight: "500",
  },
  date: {
    fontSize: 14,
    color: "#999",
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 15,
  },
  tag: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 5,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  tagText: {
    fontSize: 12,
    color: "#666",
  },
});

export default PostDetailScreen;
