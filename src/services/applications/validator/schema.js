import Joi from "joi";

export const applicationPayloadSchema = Joi.object({
  user_id: Joi.string().required(),
  job_id: Joi.string().required(),
  status: Joi.string().valid("pending").required(),
});

export const updateStatusPayloadSchema = Joi.object({
  status: Joi.string().valid("accepted").required(),
});
