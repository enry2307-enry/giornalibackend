import { ValidationError } from "../errors/AppError";

export const requireFields = (fields: Record<string, any>) => {
  for (const [name, value] of Object.entries(fields)) {
    if (!value) throw new ValidationError(`${name} required`);
  }
};