import "express-session";

declare module "express-session" {
  interface SessionData {
    isConnected?: boolean;
    email?: string;
    idUser?: number;
  }
}

