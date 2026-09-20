import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateRestaurantPayload {
  @IsNotEmpty({ message: "L'ID prestataire est requis." })
  @IsUUID(undefined, { message: "L'ID prestataire doit être un UUID valide." })
  prestataireId: string;

  @IsNotEmpty({ message: 'Le type de cuisine est requis.' })
  @IsString({ message: 'Le type de cuisine doit être une chaîne de caractères.' })
  typeCuisin: string;

  @IsNotEmpty({ message: "L'horaire est requis." })
  @IsString({ message: "L'horaire doit être une chaîne de caractères." })
  horaire: string;

  @IsOptional()
  @IsNumber({}, { message: 'La capacité de couverts doit être un nombre.' })
  capaciteCouverts: number;
}
