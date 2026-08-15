import { OmitType } from '@nestjs/mapped-types';
import { RegisterPayload } from '../../auth/payload/register-payload';

export class CreateUserDto extends OmitType(RegisterPayload, ['password'] as const) {}
