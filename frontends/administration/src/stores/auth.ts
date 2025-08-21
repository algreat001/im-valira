import { defineStore } from "pinia";
import router from "@/router";
import type { RouteLocationRaw } from "vue-router";

import {
  apiLogin,
  apiRegister,
  apiMe,
  apiLogout,
  apiUpdateProfile,
  type LoginPayload,
  type RegisterPayload,
  type ProfileUpdatePayload
} from "@/backend/auth";

export interface User {
  user_id?: number | string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  phone?: string;
  roles?: string[];

  [key: string]: any;
}

type State = {
  token: string | null;
  user: User | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
};

export const useAuthStore = defineStore("auth", {
  state: (): State => ({
    token: null,
    user: null,
    loading: false,
    initialized: false,
    error: null
  }),
  getters: {
    isAuthenticated: (s) => !!s.token,
    userName: (s) =>
      s.user?.name ||
      [ s.user?.firstName, s.user?.lastName ].filter(Boolean).join(" ") ||
      s.user?.email ||
      ""
  },
  actions: {
    async testAuthenticated(redirect: string = location.pathname + location.search) {
      if (!this.isAuthenticated) {
        void router.push({
          name: "Login",
          query: { redirect }
        } as unknown as RouteLocationRaw);
        return false;
      }
      if (!this.user) {
        await this.fetchMe();
      }
      return true;
    },
    loadFromStorage() {
      try {
        const saved = localStorage.getItem("auth_token");
        if (saved) {
          this.token = saved;
        }
      } catch {
      }
    },
    saveToken(token: string | null) {
      this.token = token;
      try {
        if (token) {
          localStorage.setItem("auth_token", token);
        } else {
          localStorage.removeItem("auth_token");
        }
      } catch {
      }
    },
    async init() {
      if (this.initialized) {
        return;
      }
      this.loadFromStorage();
      if (this.token) {
        try {
          this.user = await apiMe();
        } catch {
          this.saveToken(null);
          this.user = null;
        }
      }
      this.initialized = true;
    },
    async login(payload: LoginPayload) {
      this.loading = true;
      this.error = null;
      try {
        const { token, user } = await apiLogin(payload);
        if (!token) {
          throw new Error("Не удалось получить токен");
        }
        this.saveToken(token);
        this.user = user ?? (await apiMe().catch(() => null));
      } catch (e: any) {
        this.error = e?.message || "Ошибка входа";
        throw e;
      } finally {
        this.loading = false;
      }
    },
    async register(payload: RegisterPayload) {
      this.loading = true;
      this.error = null;
      try {
        const { token, user } = await apiRegister(payload);
        if (token) {
          this.saveToken(token);
        }
        this.user = user ?? (token ? await apiMe().catch(() => null) : null);
      } catch (e: any) {
        this.error = e?.message || "Ошибка регистрации";
        throw e;
      } finally {
        this.loading = false;
      }
    },
    async fetchMe() {
      if (!this.token) {
        return null;
      }
      try {
        this.user = await apiMe();
      } catch {
        this.saveToken(null);
        this.user = null;
      }
      return this.user;
    },
    async updateProfile(payload: ProfileUpdatePayload) {
      this.loading = true;
      this.error = null;
      try {
        const updated = await apiUpdateProfile(payload);
        this.user = { ...(this.user || {}), ...(updated as any) } as User;
      } catch (e: any) {
        this.error = e?.message || "Не удалось сохранить профиль";
        throw e;
      } finally {
        this.loading = false;
      }
    },
    async logout() {
      try {
        await apiLogout();
      } finally {
        this.saveToken(null);
        this.user = null;
      }
    }
  }
});
