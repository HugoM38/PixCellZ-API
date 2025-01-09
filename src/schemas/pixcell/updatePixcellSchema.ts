import Joi from "joi";

export const updatePixcellSchema = Joi.object({
    pixcell: Joi.array().items(Joi.number().required()).required(),
});
