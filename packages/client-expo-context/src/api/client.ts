import superagent from "superagent";
import { Post, Tag } from "../types";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "https://api.realworld.io/api";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl;
  }

  private async get<T>(
    endpoint: string,
    params?: Record<string, any>
  ): Promise<T> {
    try {
      const response = await superagent
        .get(`${this.baseUrl}${endpoint}`)
        .query(params || {});
      return response.body;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.body.message || "API request failed");
      }
      throw error;
    }
  }

  async getArticles(tag?: string): Promise<{ articles: Post[] }> {
    return this.get<{ articles: Post[] }>(
      "/articles",
      tag ? { tag } : undefined
    );
  }

  async getArticle(slug: string): Promise<{ article: Post }> {
    return this.get<{ article: Post }>(`/articles/${slug}`);
  }

  async getTags(): Promise<{ tags: string[] }> {
    return this.get<{ tags: string[] }>("/tags");
  }
}

export const apiClient = new ApiClient();
