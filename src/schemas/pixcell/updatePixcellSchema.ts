import Joi from "joi";

export const updatePixcellSchema = Joi.object({
    data: Joi.array().items(
        Joi.array().items(
            Joi.object({
                r: Joi.number().integer().min(0).max(255).required(),
                g: Joi.number().integer().min(0).max(255).required(),
                b: Joi.number().integer().min(0).max(255).required()
            })
        )
    ).required()
});
