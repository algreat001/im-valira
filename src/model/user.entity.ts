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

  @ManyToMany(() => Role, (role) => role.users)
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
}
