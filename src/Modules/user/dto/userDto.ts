import { User } from '../entities/user.entity';

export class UserDto {
  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.username = user.username;
    this.phone = user.phone;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.userRole = user.userRole;
    this.isActive = user.isActive;
    this.profileImage = user.profileImage;
    this.gender = user.gender;
    this.isAccountVerified = user.isAccountVerified;
    this.preferredCurrency = user.preferredCurrency;
    this.notificationsEnabled = user.notificationsEnabled;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }

  id: string;
  email: string;
  username: string;
  phone: string;
  firstName: string;
  lastName: string;
  userRole: string;
  isActive: boolean;
  profileImage: string;
  gender: string;
  isAccountVerified: boolean;
  preferredCurrency: string;
  notificationsEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}
