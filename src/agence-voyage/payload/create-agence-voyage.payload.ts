import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateAgenceVoyagePayload {
  @IsNotEmpty({ message: "L'ID prestataire est requis." })
  @IsUUID(undefined, { message: "L'ID prestataire doit être un UUID valide." })
  prestataireId: string;

  @IsNotEmpty({ message: 'Le numéro de licence est requis.' })
  @IsString({ message: 'Le numéro de licence doit être une chaîne de caractères.' })
  numLicence: string;
}
