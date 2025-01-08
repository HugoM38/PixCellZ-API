// src/schemas/pixcell/createPixcellSchema.ts
import Joi from "joi";

export const createPixcellSchema = Joi.object({
    pixcell: Joi.array().items(Joi.number().required()).required(),
});
