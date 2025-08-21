/* Simple Auth API client using fetch */
import { apiFetch } from "./request.service";

export type LoginPayload = { email: string; password: string };
export type RegisterPayload = {
  email: string;
  name: string;
  firstName: string;
  middleName: string;
  lastName: string;
  phone: string;
  postalCode: string;
  deliveryCity: string;
  deliveryAddress: string;
};

export type ProfileUpdatePayload = Partial<RegisterPayload>;

export async function apiLogin(payload: LoginPayload): Promise<{ token: string; user?: any }> {
  const res = await apiFetch<any>("/auth/signin", {
    method: "POST",
    body: JSON.stringify(payload)
  });
  const token = res?.access_token || res?.accessToken || res?.token;
  return { token, user: res?.user };
}

export async function apiRegister(payload: RegisterPayload): Promise<{ token?: string; user?: any }> {
  // Используем существующий эндпоинт регистрации как основной
  try {
    const res = await apiFetch<any>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    const token = res?.access_token || res?.accessToken || res?.token;
    return { token, user: res?.user };
  } catch (e: any) {
    // Фоллбэк на альтернативное именование
    if (/404/.test(e?.message || "")) {
      const res = await apiFetch<any>("/auth/signup", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      const token = res?.access_token || res?.accessToken || res?.token;
      return { token, user: res?.user };
    }
    throw e;
  }
}

export async function apiMe(): Promise<any> {
  // Основной — профиль из модуля авторизации; фоллбэки на распространённые альтернативы
  try {
    return await apiFetch<any>("/user/profile", { method: "GET" });
  } catch (e: any) {
    if (/404/.test(e?.message || "")) {
      try {
        return await apiFetch<any>("/user", { method: "GET" });
      } catch (e2: any) {
        if (/404/.test(e2?.message || "")) {
          return await apiFetch<any>("/user", { method: "GET" });
        }
        throw e2;
      }
    }
    throw e;
  }
}

export async function apiLogout(): Promise<void> {
  try {
    await apiFetch("/auth/logout", { method: "POST" });
  } catch {
    // ignore if endpoint is not available
  }
}

export async function apiUpdateProfile(payload: ProfileUpdatePayload): Promise<any> {
  // Предпочитаем PATCH /auth/profile; с фоллбэками на PUT и /users/me
  try {
    return await apiFetch<any>("/user/profile", { method: "PATCH", body: JSON.stringify(payload) });
  } catch (e: any) {
    if (/404/.test(e?.message || "")) {
      try {
        return await apiFetch<any>("/auth/profile", { method: "PUT", body: JSON.stringify(payload) });
      } catch (e2: any) {
        if (/404/.test(e2?.message || "")) {
          try {
            return await apiFetch<any>("/users/me", { method: "PATCH", body: JSON.stringify(payload) });
          } catch (e3: any) {
            if (/404/.test(e3?.message || "")) {
              return await apiFetch<any>("/users/me", { method: "PUT", body: JSON.stringify(payload) });
            }
            throw e3;
          }
        }
        throw e2;
      }
    }
    throw e;
  }
}
