import { z } from "zod";

import {
  createCategorySchema,
  updateCategorySchema,
} from "./category.validation";

export type CreateCategoryInput = {
  name: string;
  description?: string;
};

export type UpdateCategoryInput =
  Partial<CreateCategoryInput>;

export type CategoryIdParams = {
  id: string;
};

export type CreateCategoryRequest =
  z.infer<typeof createCategorySchema.body>;

export type UpdateCategoryRequest =
  z.infer<typeof updateCategorySchema.body>;