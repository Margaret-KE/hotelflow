import { Router } from "express";

import authenticate from "../../../middleware/authenticate";
import authorize from "../../../middleware/authorize";
import validate from "../../../middleware/validate";

import * as controller from "./category.controller";

import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdSchema,
} from "./category.validation";

const router = Router();

router.get(
  "/",
  authenticate,
  authorize("restaurant.read"),
  controller.getAllCategories
);

router.get(
  "/:id",
  authenticate,
  authorize("restaurant.read"),
  validate(categoryIdSchema),
  controller.getCategory
);

router.post(
  "/",
  authenticate,
  authorize("restaurant.create"),
  validate(createCategorySchema),
  controller.createNewCategory
);

router.put(
  "/:id",
  authenticate,
  authorize("restaurant.update"),
  validate({
    params: categoryIdSchema.params,
    body: updateCategorySchema.body,
  }),
  controller.updateExistingCategory
);

router.delete(
  "/:id",
  authenticate,
  authorize("restaurant.update"),
  validate(categoryIdSchema),
  controller.removeCategory
);

export default router;