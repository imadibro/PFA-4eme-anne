// resolved-creator.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ResolvedCreator = createParamDecorator((data, ctx: ExecutionContext) => {
  if (ctx.getType() === 'ws') {
    const client = ctx.switchToWs().getClient();
    const data = ctx.switchToWs().getData();
    return {
      currentUser: client.user || client.authUser || client.args?.[0]?.user,
      creatorId: data?.creatorId
    };
  }
  const request = ctx.switchToHttp().getRequest();

  return {
    currentUser: request.user || request.authUser || request.args?.[0]?.user,
    creatorId: request?.query?.creatorId || request?.body?.creatorId || request.cookies?.selectedCreator
  };
});
