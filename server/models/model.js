const Joi = require('joi');

const modelSchema = Joi.object({
    id: Joi.string()
        .required(),

    urn: Joi.string()
        .required(),
    
    name: Joi.string()
        .required(),

    creator: Joi.string()
        .required(),

    format: Joi.string()
        .regex(/^.*\.(rvt)$/)
        .required(),

    createdAt: Joi.date().timestamp()
        .required(),

    schedule: Joi.string()
})

module.exports = modelSchema;