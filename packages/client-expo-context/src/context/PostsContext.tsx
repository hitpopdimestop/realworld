import React, { createContext, useContext, useState, useCallback } from "react";
import { Post, Tag } from "../types";
import { apiClient } from "../api/client";

interface PostsContextType {
  posts: Post[];
  tags: Tag[];
  selectedTag: string | null;
  loading: boolean;
  error: string | null;
  fetchPosts: () => Promise<void>;
  fetchTags: () => Promise<void>;
  selectTag: (tag: string | null) => void;
  fetchPostBySlug: (slug: string) => Promise<Post>;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export function PostsProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getArticles(selectedTag || undefined);
      setPosts(response.articles);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch posts");
      setLoading(false);
    }
  }, [selectedTag]);

  const fetchTags = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getTags();
      setTags(response.tags.map((name) => ({ name })));
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch tags");
      setLoading(false);
    }
  }, []);

  const fetchPostBySlug = useCallback(async (slug: string): Promise<Post> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getArticle(slug);
      setLoading(false);
      return response.article;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : `Failed to fetch post ${slug}`
      );
      setLoading(false);
      throw err;
    }
  }, []);

  const selectTag = useCallback((tag: string | null) => {
    setSelectedTag(tag);
  }, []);

  return (
    <PostsContext.Provider
      value={{
        posts,
        tags,
        selectedTag,
        loading,
        error,
        fetchPosts,
        fetchTags,
        selectTag,
        fetchPostBySlug,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  const context = useContext(PostsContext);
  if (context === undefined) {
    throw new Error("usePosts must be used within a PostsProvider");
  }
  return context;
}
