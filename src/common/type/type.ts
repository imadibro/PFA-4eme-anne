export type JWTPayloadType = {
  id: string;
  username: string;
  userRole: string;
  sessionToken: string;
};

export type AccessTokenType = {
  accessToken: string;
};
