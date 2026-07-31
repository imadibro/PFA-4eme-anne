import { IsOptional, IsString } from 'class-validator';

export class UpdateAgenceVoyagePayload {
  @IsString({ message: 'Le numéro de licence doit être une chaîne de caractères.' })
  @IsOptional()
  numLicence?: string;
}
