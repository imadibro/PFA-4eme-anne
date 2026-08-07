import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterPayload {
  @IsNotEmpty({ message: 'Le prénom est requis.' })
  @IsString({ message: 'Le prénom doit être une chaîne de caractères.' })
  firstName: string;

  @IsNotEmpty({ message: 'Le nom de famille est requis.' })
  @IsString({
    message: 'Le nom de famille doit être une chaîne de caractères.'
  })
  lastName: string;

  @IsNotEmpty({ message: "L'email est requis." })
  @IsEmail({}, { message: "L'adresse e-mail n'est pas valide." })
  email: string;

  @IsNotEmpty({ message: "Le nom d'utilisateur est requis." })
  @IsString({
    message: "Le nom d'utilisateur doit être une chaîne de caractères."
  })
  username: string;

  @IsNotEmpty({ message: 'Le mot de passe est requis.' })
  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères.' })
  @MinLength(6, {
    message: 'Le mot de passe doit contenir au moins 6 caractères.'
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10, {
    message: 'Le numéro de téléphone doit contenir au moins 10 caractères.'
  })
  phone: string;

  @IsNotEmpty({ message: 'Le genre est requis.' })
  @IsString({ message: 'Le genre doit être une chaîne de caractères.' })
  gender: string;

  @IsString({ message: "L'image de profil doit être une chaîne de caractères." })
  @IsOptional()
  profileImage?: string;

  @IsString({ message: "Le rôle de l'utilisateur doit être une chaîne de caractères." })
  @IsOptional()
  userRole?: string;
}

export class LoginPayload {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
