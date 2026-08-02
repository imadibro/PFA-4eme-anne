import { User } from '../entities/user.entity';

export class UserDto {
  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.userRole = user.userRole;
    this.isActive = user.isActive;
    this.profileImage = user.profileImage;
    this.gender = user.gender;
    this.isAccountVerified = user.isAccountVerified;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }

  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userRole: string;
  isActive: boolean;
  profileImage: string;
  gender: string;
  isAccountVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
