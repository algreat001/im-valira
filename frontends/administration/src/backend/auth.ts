import { apiFetch } from "@/backend/request.service";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name?: string;
}

export interface ProfileUpdatePayload {
  name?: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  phone?: string;
  deliveryAddress?: string;
  postalCode?: string;
  deliveryCity?: string;
}

export async function apiLogin(payload: LoginPayload): Promise<{ token: string; user?: any }> {
  return apiFetch<{ token: string; user?: any }>("/auth/signin", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function apiRegister(payload: RegisterPayload): Promise<{ token?: string; user?: any }> {
  return apiFetch<{ token?: string; user?: any }>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function apiMe(): Promise<any> {
  return apiFetch<any>("/user/profile", { method: "GET" });
}

export async function apiLogout(): Promise<void> {
  await apiFetch("/auth/logout", { method: "POST" });
}

export async function apiUpdateProfile(payload: ProfileUpdatePayload): Promise<any> {
  return apiFetch<any>("/auth/profile", {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}
