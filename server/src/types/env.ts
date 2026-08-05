export type AppEnv = {
  port: number;
  mongoUri: string;
  nodeEnv: string;
  jwtAccessSecret: string;
  jwtRefreshSecret: string;
  accessTokenTtl: string;
  refreshTokenTtl: string;
  refreshCookieName: string;
  mistralApiKey: string;
  tavilyApiKey: string;
  langSmithApiKey: string;
  langSmithTracing: string;
  langSmithProject: string;
};
