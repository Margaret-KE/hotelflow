import { Request, Response, NextFunction } from "express";
import { ZodError, ZodTypeAny } from "zod";

type ValidationSchema = {
  body?: ZodTypeAny;
  params?: ZodTypeAny;
  query?: ZodTypeAny;
};

export default function validate(
  schema: ValidationSchema
) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (schema.body) {
        req.body = (await schema.body.parseAsync(
          req.body
        )) as Request["body"];
      }

      if (schema.params) {
        req.params = (await schema.params.parseAsync(
          req.params
        )) as Request["params"];
      }

      if (schema.query) {
        req.query = (await schema.query.parseAsync(
          req.query
        )) as Request["query"];
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