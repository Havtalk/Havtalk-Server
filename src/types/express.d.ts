// src/types/express.d.ts
import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        username: string;
        firstName: string;
        lastName: string;
        avatar: string | null;  // Updated to allow null values
        isVerified: boolean;
      };
    }
  }
}

export {};
