//This is a custom Data Type
export type AppEnv = {
  port: number;
  mongoUri: string;
  nodeEnv: string;
  jwtAccessSecret: string;
  jwtRefreshSecret: string;
  accessTokenTtl: string;
  refreshTokenTtl: string;
  refreshCookieName: string;
  mistralapi:string,

};
