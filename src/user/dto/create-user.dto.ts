import { OmitType } from '@nestjs/mapped-types';
import { CreateUserPayload } from '../payload/create-user.payload';

export class CreateUserDto extends OmitType(CreateUserPayload, ['password'] as const) {}
