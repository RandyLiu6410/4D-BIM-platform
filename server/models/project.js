const Joi = require('joi');

const projectSchema = Joi.object({
    id: Joi.string()
        .required(),

    manager: Joi.string()
        .required(),

    creator: Joi.string()
        .required(),
    
    name: Joi.string()
        .required(),

    location: Joi.object({
        city: Joi.string()
            .required(),

        country: Joi.string()
            .required(),

        street: Joi.string()
            .required(),
        })
        .required(),

    models: Joi.array().items(
            Joi.string()
        )
        .required(),

    createdAt: Joi.date().timestamp()
        .required(),
})

module.exports = projectSchema;