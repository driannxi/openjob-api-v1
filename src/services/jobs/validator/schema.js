import Joi from "joi";

export const jobPayloadSchema = Joi.object({
  company_id: Joi.string().required(),
  category_id: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  job_type: Joi.string().required(),
  experience_level: Joi.string().required(),
  location_type: Joi.string().required(),
  location_city: Joi.string().required(),
  salary_min: Joi.number().min(0).required(),
  salary_max: Joi.number().min(Joi.ref("salary_min")).required(),
  is_salary_visible: Joi.boolean().required(),
  status: Joi.string().valid("open", "close").required(),
});
