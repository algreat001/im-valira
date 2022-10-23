import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable
} from "typeorm";
import { Role } from "./role.entity";
import { UserDto } from "../dto";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(() => Role, (role) => role.users, { eager: true })
  @JoinTable()
  roles: Role[];

  @CreateDateColumn({
    type: "timestamptz"
  })
  createdDate: Date;

  @UpdateDateColumn({
    type: "timestamptz"
  })
  updatedDate: Date;

  get dto(): UserDto {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      roles: this.roles?.map((role) => role.dto)
    } as UserDto;
  }

  hasRole(roleName: string): boolean {
    return this.roles.some(r => r.role === roleName);
  }

  isAdmin(): boolean {
    return this.hasRole("Admin");
  }

  isEditor(): boolean {
    return this.isAdmin() || this.hasRole("Editor");
  }

  isModerator(): boolean {
    return this.isAdmin() || this.hasRole("Moderator");
  }

  isSeller(): boolean {
    return this.isAdmin() || this.hasRole("Seller");
  }

  isBlogger(): boolean {
    return this.isAdmin() || this.hasRole("Post");
  }

  isUser(): boolean {
    return this.isAdmin() || this.hasRole("User");
  }
}
