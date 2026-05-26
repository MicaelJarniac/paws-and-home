import 'multer';

declare global {
  namespace Express {
    interface Locals {
      flash: { type: string; message: string } | null;
      currentAdmin: { id: string; username: string } | null;
    }
  }
}

export {};
