import { Request, Response, NextFunction } from "express";
import { AnySchema } from "yup";
import logger from "../logger";

const validateRequest =
  (schema: AnySchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(req.body);

      return next();
    } catch (err: any) {
      logger.error(err.message);
      return res.status(400).json({ message: err.message });
    }
  };

export default validateRequest;
