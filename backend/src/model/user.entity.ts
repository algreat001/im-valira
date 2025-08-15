import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Role } from './role.entity';
import { UserDto } from '../dto';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true, default: '' })
  middleName: string;

  @Column({ nullable: false, default: '' })
  email: string;

  @Column({ nullable: true, default: '' })
  phone: string;

  @Column({ nullable: true, default: '' })
  postalCode: string;

  @Column({ nullable: true, default: '' })
  deliveryCity: string;

  @Column({ nullable: true, default: '' })
  deliveryAddress: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(() => Role, (role) => role.users, { eager: true })
  @JoinTable()
  roles: Role[];

  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdDate: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updatedDate: Date;

  get dto(): UserDto {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      middleName: this.middleName,
      email: this.email,
      phone: this.phone ?? '',
      postalCode: this.postalCode ?? '',
      deliveryCity: this.deliveryCity ?? '',
      deliveryAddress: this.deliveryAddress ?? '',
      roles: this.roles?.map((role) => role.dto),
    } as UserDto;
  }

  hasRole(roleName: string): boolean {
    return this.roles.some(r => r.role === roleName);
  }

  isAdmin(): boolean {
    return this.hasRole('Admin');
  }

  isEditor(): boolean {
    return this.isAdmin() || this.hasRole('Editor');
  }

  isModerator(): boolean {
    return this.isAdmin() || this.hasRole('Moderator');
  }

  isSeller(): boolean {
    return this.isAdmin() || this.hasRole('Seller');
  }

  isBlogger(): boolean {
    return this.isAdmin() || this.hasRole('Post');
  }

  isUser(): boolean {
    return this.isAdmin() || this.hasRole('User');
  }
}
