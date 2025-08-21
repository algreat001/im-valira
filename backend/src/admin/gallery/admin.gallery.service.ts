import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as fssync from 'fs';
import * as path from 'path';

@Injectable()
export class AdminGalleryService {
  private readonly dir = path.join(process.cwd(), 'public', 'images', 'gallery');
  private readonly urlPrefix = '/images/gallery';

  private async ensureDir(): Promise<void> {
    await fs.mkdir(this.dir, { recursive: true });
  }

  private toFileName(input: string): string {
    // Приходит либо полный URL/путь, либо имя файла — берем basename
    try {
      const asUrl = new URL(input, 'http://localhost');
      return path.basename(asUrl.pathname);
    } catch {
      return path.basename(input);
    }
  }

  async list(): Promise<string[]> {
    await this.ensureDir();
    const entries = await fs.readdir(this.dir, { withFileTypes: true });
    return entries
      .filter((e) => e.isFile())
      .map((e) => path.posix.join(this.urlPrefix, e.name))
      .sort((a, b) => a.localeCompare(b, 'ru'));
  }

  // Файл сохраняется через Multer в контроллере, тут может быть расширенная логика аудита/БД.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async upload(_filename: string): Promise<void> {
    await this.ensureDir();
  }

  async remove(image: string): Promise<void> {
    await this.ensureDir();
    const name = this.toFileName(image);
    const filePath = path.join(this.dir, name);
    if (fssync.existsSync(filePath)) {
      await fs.unlink(filePath);
    }
  }

  async rename(oldName: string, newName: string): Promise<void> {
    await this.ensureDir();
    const oldBase = this.toFileName(oldName);
    const newBase = this.toFileName(newName);
    const from = path.join(this.dir, oldBase);
    const to = path.join(this.dir, newBase);
    if (!fssync.existsSync(from)) {
      // если нет исходного файла — просто выходим
      return;
    }
    await fs.rename(from, to);
  }
}
