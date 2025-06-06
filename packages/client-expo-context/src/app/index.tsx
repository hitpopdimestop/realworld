import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { usePosts } from "../context/PostsContext";
import { router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { apiClient } from "../api/client";
import { Post } from "../types";

const HomeScreen = () => {
  const { user } = useAuth();
  const {
    posts,
    tags,
    selectedTags,
    loading,
    error,
    fetchPosts,
    fetchTags,
    toggleTag,
    clearTags,
    updatePostFavoriteStatus,
  } = usePosts();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchPosts(), fetchTags()]);
    setRefreshing(false);
  }, [fetchPosts, fetchTags]);

  React.useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchPosts(), fetchTags()]);
    };
    loadData();
  }, [fetchPosts, fetchTags]);

  const handleTagPress = useCallback(
    (tag: string) => {
      toggleTag(tag);
    },
    [toggleTag]
  );

  const handleFavorite = useCallback(
    async (slug: string, favorited: boolean) => {
      if (!user) {
        router.push("/(auth)/login");
        return;
      }

      try {
        let updatedPost;
        if (favorited) {
          const response = await apiClient.unfavoriteArticle(slug);
          updatedPost = response.article;
        } else {
          const response = await apiClient.favoriteArticle(slug);
          updatedPost = response.article;
        }
        // Update the posts context
        updatePostFavoriteStatus(
          updatedPost.slug,
          updatedPost.favorited,
          updatedPost.favoritesCount
        );
      } catch (err) {
        console.error("Failed to update favorite status:", err);
      }
    },
    [user, updatePostFavoriteStatus]
  );

  const renderPostItem = useCallback(
    ({ item }: { item: Post }) => (
      <TouchableOpacity
        style={styles.postCard}
        onPress={() => router.push(`/post/${item.slug}`)}
      >
        <View style={styles.postHeader}>
          <View style={styles.authorInfo}>
            <Text style={styles.author}>{item.author.username}</Text>
            <Text style={styles.date}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => handleFavorite(item.slug, item.favorited)}
          >
            <FontAwesome
              name={item.favorited ? "heart" : "heart-o"}
              size={16}
              color={item.favorited ? "#5CB85C" : "#999"}
            />
            <Text style={styles.favoriteCount}>{item.favoritesCount}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.readMore}>Read more...</Text>
          <View style={styles.postTags}>
            {item.tagList.map((tag: string) => (
              <TouchableOpacity
                key={tag}
                style={[
                  styles.postTag,
                  selectedTags.includes(tag) && styles.postTagSelected,
                ]}
                onPress={(e) => {
                  e.stopPropagation();
                  handleTagPress(tag);
                }}
              >
                <Text
                  style={[
                    styles.postTagText,
                    selectedTags.includes(tag) && styles.postTagTextSelected,
                  ]}
                >
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    ),
    [selectedTags, handleTagPress, handleFavorite]
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#5CB85C" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity style={styles.button} onPress={() => fetchPosts()}>
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Tags Section */}
      <View style={styles.tagsSection}>
        <Text style={styles.tagsTitle}>Popular Tags</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tagsScroll}
        >
          <TouchableOpacity
            style={[
              styles.tagChip,
              selectedTags.length === 0 && styles.tagChipSelected,
            ]}
            onPress={() => clearTags()}
          >
            <Text
              style={[
                styles.tagChipText,
                selectedTags.length === 0 && styles.tagChipTextSelected,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          {tags.map((tag) => (
            <TouchableOpacity
              key={tag.name}
              style={[
                styles.tagChip,
                selectedTags.includes(tag.name) && styles.tagChipSelected,
              ]}
              onPress={() => handleTagPress(tag.name)}
            >
              <Text
                style={[
                  styles.tagChipText,
                  selectedTags.includes(tag.name) && styles.tagChipTextSelected,
                ]}
              >
                {tag.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Posts Section */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.slug}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={8}
        updateCellsBatchingPeriod={50}
        keyboardShouldPersistTaps="handled"
        getItemLayout={(data, index) => ({
          length: 200,
          offset: 200 * index,
          index,
        })}
        renderItem={renderPostItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  tagsSection: {
    backgroundColor: "white",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tagsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 15,
    marginBottom: 10,
    color: "#333",
  },
  tagsScroll: {
    paddingLeft: 15,
  },
  tagChip: {
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  tagChipSelected: {
    backgroundColor: "#5CB85C",
    borderColor: "#5CB85C",
  },
  tagChipText: {
    fontSize: 14,
    color: "#666",
  },
  tagChipTextSelected: {
    color: "white",
    fontWeight: "bold",
  },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  postCard: {
    backgroundColor: "white",
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 15,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  authorInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  author: {
    fontSize: 14,
    color: "#5CB85C",
    marginRight: 5,
  },
  date: {
    fontSize: 12,
    color: "#999",
  },
  favoriteButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
  },
  favoriteCount: {
    fontSize: 12,
    color: "#999",
    marginLeft: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  readMore: {
    fontSize: 12,
    color: "#999",
  },
  postTags: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  postTag: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 5,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  postTagSelected: {
    backgroundColor: "#5CB85C",
    borderColor: "#5CB85C",
  },
  postTagText: {
    fontSize: 12,
    color: "#999",
  },
  postTagTextSelected: {
    color: "white",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#5CB85C",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
});

export default HomeScreen;
