import { useAuthStore } from "@/stores/auth";

export async function initUser() {
  const auth = useAuthStore();
  await auth.init();
}
