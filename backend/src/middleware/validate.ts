import { Request, Response, NextFunction } from "express";
import { ZodError, ZodSchema } from "zod";

export default function validate(schema: ZodSchema) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
      }) as {
        body?: Request["body"];
        params?: Request["params"];
        query?: Request["query"];
      };

      if (parsed.body) {
        req.body = parsed.body;
      }

      if (parsed.params) {
        req.params = parsed.params;
      }

      if (parsed.query) {
        req.query = parsed.query;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.flatten().fieldErrors,
        });
      }

      next(error);
    }
  };
}