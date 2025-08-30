import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BannerItemDto } from '@/dto';

@Entity()
export class Banner {
  @PrimaryGeneratedColumn()
  banner_id: number;

  @Column({ length: 512 })
  image: string; // относительный или абсолютный путь к изображению

  @Column({ length: 255, nullable: true })
  title?: string;

  @Column({ type: 'text', nullable: true })
  message?: string;

  @Column({ length: 255, nullable: true })
  alt?: string;

  @Column({ length: 512, nullable: true })
  link?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  get dto(): BannerItemDto {
    return {
      id: this.banner_id,
      image: this.image,
      title: this.title,
      message: this.message,
      alt: this.alt,
      link: this.link,
    };
  }

  static fromDto(dto: Partial<BannerItemDto>, existing?: Banner): Banner {
    const b = existing ?? new Banner();
    if (dto.id !== undefined) {
      b.banner_id = dto.id;
    }
    if (dto.image !== undefined) {
      b.image = dto.image;
    }
    if (dto.title !== undefined) {
      b.title = dto.title;
    }
    if (dto.message !== undefined) {
      b.message = dto.message;
    }
    if (dto.alt !== undefined) {
      b.alt = dto.alt;
    }
    if (dto.link !== undefined) {
      b.link = dto.link;
    }
    return b;
  }
}
