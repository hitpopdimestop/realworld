import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { Post, Tag } from "../types";
import { apiClient } from "../api/client";
import { useAuth } from "./AuthContext";

interface PostsContextType {
  posts: Post[];
  tags: Tag[];
  selectedTags: string[];
  loading: boolean;
  error: string | null;
  fetchPosts: () => Promise<void>;
  fetchTags: () => Promise<void>;
  toggleTag: (tag: string) => void;
  clearTags: () => void;
  fetchPostBySlug: (slug: string) => Promise<Post>;
  updatePostFavoriteStatus: (
    slug: string,
    favorited: boolean,
    favoritesCount: number
  ) => void;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export function PostsProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoized filtered posts for better performance
  const posts = useMemo(() => {
    if (selectedTags.length === 0) {
      return allPosts;
    }
    return allPosts.filter((post) =>
      selectedTags.some((tag) => post.tagList.includes(tag))
    );
  }, [allPosts, selectedTags]);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getArticles();
      setAllPosts(response.articles);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch posts");
      setLoading(false);
    }
  }, []);

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

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags((current) => {
      if (current.includes(tag)) {
        return current.filter((t) => t !== tag);
      } else {
        return [...current, tag];
      }
    });
  }, []);

  const clearTags = useCallback(() => {
    setSelectedTags([]);
  }, []);

  const updatePostFavoriteStatus = useCallback(
    (slug: string, favorited: boolean, favoritesCount: number) => {
      setAllPosts((currentPosts) =>
        currentPosts.map((post) =>
          post.slug === slug ? { ...post, favorited, favoritesCount } : post
        )
      );
    },
    []
  );

  // Auto-fetch posts when auth state is determined
  useEffect(() => {
    if (!authLoading) {
      fetchPosts();
    }
  }, [authLoading, fetchPosts]);

  // Refetch posts when user authentication changes
  useEffect(() => {
    if (!authLoading && allPosts.length > 0) {
      fetchPosts();
    }
  }, [user, authLoading, fetchPosts]);

  const contextValue = useMemo(
    () => ({
      posts,
      tags,
      selectedTags,
      loading: loading || authLoading,
      error,
      fetchPosts,
      fetchTags,
      toggleTag,
      clearTags,
      fetchPostBySlug,
      updatePostFavoriteStatus,
    }),
    [
      posts,
      tags,
      selectedTags,
      loading,
      authLoading,
      error,
      fetchPosts,
      fetchTags,
      toggleTag,
      clearTags,
      fetchPostBySlug,
      updatePostFavoriteStatus,
    ]
  );

  return (
    <PostsContext.Provider value={contextValue}>
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
