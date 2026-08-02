import { UserDto } from '../../user/dto/userDto';
import { Touriste } from '../entities/touriste.entity';

export class TouristeDto {
  constructor(touriste: Touriste) {
    this.id = touriste.id;
    this.user = touriste.user ? new UserDto(touriste.user) : null;
    this.nationality = touriste.nationality;
    this.dateNaissance = touriste.dateNaissance;
  }

  id: string;
  user: UserDto | null;
  nationality: string;
  dateNaissance: Date;
}
