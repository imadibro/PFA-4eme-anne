import { OmitType } from '@nestjs/mapped-types';
import { UpdateUserPayload } from '../payload/update-user.payload';

export class UpdateUserDto extends OmitType(UpdateUserPayload, ['password', 'id'] as const) {}
