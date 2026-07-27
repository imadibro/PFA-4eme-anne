import { SetMetadata } from '@nestjs/common';

export const ALLOW_INCOMPLETE_SIGNUP_KEY = 'allowIncompleteSignup';
export const AllowIncompleteSignup = () => SetMetadata(ALLOW_INCOMPLETE_SIGNUP_KEY, true);
