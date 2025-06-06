import superagent from "superagent";
import { Post, Tag, User, LoginUser, NewUser } from "../types";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "https://api.realworld.io/api";

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  private getHeaders() {
    const headers: Record<string, string> = {};
    if (this.token) {
      headers["Authorization"] = `Token ${this.token}`;
    }
    return headers;
  }

  private handleError(error: any) {
    if (error.response) {
      const message =
        error.response.body?.message ||
        error.response.text ||
        `API request failed with status ${error.response.status}`;
      throw new Error(message);
    }
    throw error;
  }

  private async get<T>(
    endpoint: string,
    params?: Record<string, any>
  ): Promise<T> {
    try {
      const response = await superagent
        .get(`${this.baseUrl}${endpoint}`)
        .set(this.getHeaders())
        .query(params || {});
      return response.body;
    } catch (error: any) {
      this.handleError(error);
      return {} as T; // This won't be reached due to throw above
    }
  }

  private async post<T>(
    endpoint: string,
    data?: Record<string, any>
  ): Promise<T> {
    try {
      const response = await superagent
        .post(`${this.baseUrl}${endpoint}`)
        .set(this.getHeaders())
        .send(data || {});
      return response.body;
    } catch (error: any) {
      this.handleError(error);
      return {} as T; // This won't be reached due to throw above
    }
  }

  private async put<T>(
    endpoint: string,
    data?: Record<string, any>
  ): Promise<T> {
    try {
      const response = await superagent
        .put(`${this.baseUrl}${endpoint}`)
        .set(this.getHeaders())
        .send(data || {});
      return response.body;
    } catch (error: any) {
      this.handleError(error);
      return {} as T; // This won't be reached due to throw above
    }
  }

  private async delete<T>(endpoint: string): Promise<T> {
    try {
      const response = await superagent
        .delete(`${this.baseUrl}${endpoint}`)
        .set(this.getHeaders());
      return response.body;
    } catch (error: any) {
      this.handleError(error);
      return {} as T; // This won't be reached due to throw above
    }
  }

  async login(user: LoginUser): Promise<{ user: User }> {
    const response = await this.post<{ user: User }>("/users/login", { user });
    this.setToken(response.user.token);
    return response;
  }

  async register(user: NewUser): Promise<{ user: User }> {
    const response = await this.post<{ user: User }>("/users", { user });
    this.setToken(response.user.token);
    return response;
  }

  async updateProfile(user: Partial<User>): Promise<{ user: User }> {
    const response = await this.put<{ user: User }>("/user", { user });
    return response;
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

  async favoriteArticle(slug: string): Promise<{ article: Post }> {
    return this.post<{ article: Post }>(`/articles/${slug}/favorite`);
  }

  async unfavoriteArticle(slug: string): Promise<{ article: Post }> {
    return this.delete<{ article: Post }>(`/articles/${slug}/favorite`);
  }
}

export const apiClient = new ApiClient();
