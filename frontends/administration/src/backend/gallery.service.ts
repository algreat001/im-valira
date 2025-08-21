import { apiFetch, apiFetchFile } from "@/backend/request.service";

/**
 * Возвращает список изображений общей галереи.
 * Значения — это строки с URL/путем до изображений.
 */
export async function listGallery(): Promise<string[]> {
  return apiFetch<string[]>("/admin/gallery/list", { method: "GET" });
}

/**
 * Загружает изображение в галерею.
 */
export async function uploadGalleryImage(file: File): Promise<void> {
  const form = new FormData();
  form.append("file", file);
  await apiFetchFile(`/admin/gallery/images`, form);
}

/**
 * Удаляет изображение из галереи.
 */
export async function deleteGalleryImage(image: string): Promise<void> {
  await apiFetch(`/admin/gallery/images`, {
    method: "DELETE",
    body: JSON.stringify({ image })
  });
}

/**
 * Переименовывает изображение в галерее.
 * oldName — текущее имя/путь, newName — новое имя (без изменения директории) или полный путь.
 */
export async function renameGalleryImage(oldName: string, newName: string): Promise<void> {
  await apiFetch(`/admin/gallery/images`, {
    method: "PATCH",
    body: JSON.stringify({ oldName, newName })
  });
}
