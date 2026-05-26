import 'express-session';

declare module 'express-session' {
  interface SessionData {
    adminId?: string;
    adminUsername?: string;
    flash?: { type: 'success' | 'danger' | 'warning' | 'info'; message: string };
  }
}

export {};
