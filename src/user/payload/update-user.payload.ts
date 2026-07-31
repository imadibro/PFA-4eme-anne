import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateUserPayload {
  @IsNotEmpty({ message: "L'ID est requis." })
  @IsUUID(undefined, { message: "L'ID doit être un UUID valide." })
  @IsString({ message: "L'ID doit être une chaîne de caractères." })
  id: string;

  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  username: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  gender: string;

  @IsString()
  @IsOptional()
  isActive: string;

  @IsString()
  @IsOptional()
  profileImage: string;
}
