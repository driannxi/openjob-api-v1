import Joi from "joi";

export const jobPayloadSchema = Joi.object({
  company_id: Joi.string().required(),
  category_id: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  job_type: Joi.string().required(),
  experience_level: Joi.string().required(),
  location_type: Joi.string().required(),
  status: Joi.string().valid("open", "close").required(),
  location_city: Joi.string().optional().allow(null, ""),
  salary_min: Joi.number().min(0).optional().allow(null),
  salary_max: Joi.number().min(0).optional().allow(null),
  is_salary_visible: Joi.boolean().optional().default(true),
});

export const updateJobPayloadSchema = Joi.object({
  company_id: Joi.string().optional(),
  category_id: Joi.string().optional(),
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  job_type: Joi.string().optional(),
  experience_level: Joi.string().optional(),
  location_type: Joi.string().optional(),
  status: Joi.string().valid("open", "close").optional(),
  location_city: Joi.string().optional().allow(null, ""),
  salary_min: Joi.number().min(0).optional().allow(null),
  salary_max: Joi.number().min(0).optional().allow(null),
  is_salary_visible: Joi.boolean().optional(),
});
