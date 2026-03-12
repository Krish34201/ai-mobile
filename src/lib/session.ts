
import { IronSessionOptions } from 'iron-session';

export interface SessionData {
  username?: string;
  isLoggedIn: boolean;
  allowedChains?: string[];
}

export const sessionOptions: IronSessionOptions = {
  // Iron-session requires at least 32 characters for the password
  password: 'ai-crypto-v4-master-secret-32chars',
  cookieName: 'ai-crypto-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  },
};
