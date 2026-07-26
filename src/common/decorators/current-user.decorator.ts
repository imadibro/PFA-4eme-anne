/* eslint-disable @typescript-eslint/no-unsafe-return */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JWTPayloadType } from '../type/type';


export const CurrentUser = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const type = ctx.getType();

    if (type === 'ws') {
      const client = ctx.switchToWs().getClient();
      return client.authUser || client.user;
    }

    const request = ctx.switchToHttp().getRequest();
    const payload: JWTPayloadType = request.user || request.authUser;
    return payload;
  },
);
