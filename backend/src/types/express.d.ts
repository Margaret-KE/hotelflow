import "express";

declare global {
  namespace Express {
    interface User {
      id: string;
      tenantId: string;
      roleId: string;
      email: string;
      firstName: string;
      lastName: string;

      permissions: string[];
    }

    interface Request {
      user?: User;
    }
  }
}

export {};