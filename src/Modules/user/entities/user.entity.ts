import * as bcrypt from 'bcrypt';
import { CURRENT_TIMESTAMP } from 'src/common/constants/constant';
import { GENDERS, UserRole } from 'src/common/enums';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

@Entity('users')
@Unique(['email', 'username', 'phone'])
export abstract class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'first_name', length: 100, nullable: false })
  firstName: string;

  @Column({ name: 'last_name', length: 100, nullable: false })
  lastName: string;

  @Column({ name: 'email', unique: true, length: 100, nullable: false })
  email: string;

  @Column({ name: 'username', length: 100, unique: true, nullable: false })
  username: string;

  @Column({ name: 'password', length: 255, nullable: false })
  password: string;

  @Column({ name: 'phone', length: 20, nullable: false })
  phone: string;

  @Column({ name: 'user_role', type: 'enum', enum: UserRole, default: UserRole.TOURISTE })
  userRole: UserRole;

  @Column({ name: 'refresh_token', type: 'varchar', nullable: true, select: false })
  refreshToken: string | null;

  @Column({ name: 'gender', type: 'enum', enum: GENDERS, default: GENDERS.FEMALE })
  gender: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'profile_image', nullable: true, default: null })
  profileImage: string;

  @Column({ name: 'is_account_verified', default: false })
  isAccountVerified: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => CURRENT_TIMESTAMP,
    onUpdate: CURRENT_TIMESTAMP
  })
  updatedAt: Date;

  async validatePassword(plainPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, this.password);
  }
}
