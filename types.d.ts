import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: string;  // ou number, selon le type de votre ID utilisateur
    }
  }
}
