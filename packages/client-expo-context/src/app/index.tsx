import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { usePosts } from "../../src/context/PostsContext";
import { Link } from "expo-router";

export default function HomeScreen() {
  const {
    posts,
    tags,
    selectedTag,
    loading,
    error,
    fetchPosts,
    fetchTags,
    selectTag,
  } = usePosts();

  useEffect(() => {
    fetchPosts();
    fetchTags();
  }, [fetchPosts, fetchTags]);

  useEffect(() => {
    if (selectedTag) {
      fetchPosts(); // Refetch posts when tag changes
    }
  }, [selectedTag, fetchPosts]);

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const renderPost = ({ item }) => (
    <Link href={`/post/${item.slug}`} asChild>
      <TouchableOpacity style={styles.postCard}>
        <Text style={styles.postTitle}>{item.title}</Text>
        <Text style={styles.postDescription}>{item.description}</Text>
        <View style={styles.postFooter}>
          <Text style={styles.postAuthor}>{item.author.username}</Text>
          <Text style={styles.postDate}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );

  const renderTag = ({ item }) => (
    <TouchableOpacity
      style={[styles.tag, selectedTag === item.name && styles.selectedTag]}
      onPress={() => selectTag(selectedTag === item.name ? null : item.name)}
    >
      <Text
        style={[
          styles.tagText,
          selectedTag === item.name && styles.selectedTagText,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tagsContainer}>
        <FlatList
          data={tags}
          renderItem={renderTag}
          keyExtractor={(item) => item.name}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tagsList}
        />
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item.slug}
          contentContainerStyle={styles.postsList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  tagsContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tagsList: {
    paddingHorizontal: 10,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    marginRight: 8,
  },
  selectedTag: {
    backgroundColor: "#5cb85c",
  },
  tagText: {
    color: "#666",
    fontSize: 14,
  },
  selectedTagText: {
    color: "#fff",
  },
  postsList: {
    padding: 10,
  },
  postCard: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  postDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  postFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  postAuthor: {
    fontSize: 12,
    color: "#5cb85c",
  },
  postDate: {
    fontSize: 12,
    color: "#999",
  },
});
