import CompaniesRepositories from "../services/companies/repositories/companies-repositories.js";
import { NotFoundError } from "../exceptions/index.js";

export const checkCompanyExists = async (req, res, next) => {
  const { id } = req.params;
  const company = await CompaniesRepositories.getCompanyById(id);

  if (!company) {
    return next(new NotFoundError("Perusahaan tidak ditemukan"));
  }

  next();
};
