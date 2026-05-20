import CompaniesRepositories from "../repositories/companies-repositories.js";
import response from "../../../utils/response.js";
import { InvariantError, NotFoundError } from "../../../exceptions/index.js";

export const createCompany = async (req, res, next) => {
  const { name, location, description } = req.validated;

  const isCompanyExist = await CompaniesRepositories.verifyNewCompany(name);
  if (isCompanyExist) {
    return next(
      new InvariantError(
        "Gagal menambahkan perusahaan. Nama perusahaan sudah terdaftar.",
      ),
    );
  }

  const company = await CompaniesRepositories.createCompany({
    name,
    location,
    description,
  });

  if (!company) {
    return next(new InvariantError("Perusahaan gagal ditambahkan"));
  }

  return response(res, 201, "Perusahaan berhasil ditambahkan", company);
};

export const getAllCompanies = async (req, res, next) => {
  const companies = await CompaniesRepositories.getAllCompanies();
  return response(res, 200, "Daftar perusahaan berhasil ditampilkan", {
    companies,
  });
};

export const getCompanyById = async (req, res, next) => {
  const { id } = req.params;
  const company = await CompaniesRepositories.getCompanyById(id);

  if (!company) {
    return next(new NotFoundError("Perusahaan tidak ditemukan"));
  }

  return response(res, 200, "Detail perusahaan berhasil ditampilkan", company);
};

export const updateCompanyById = async (req, res, next) => {
  const { id } = req.params;
  const { name, location, description } = req.validated;

  const companyCheck = await CompaniesRepositories.getCompanyById(id);
  if (!companyCheck) {
    return next(new NotFoundError("Perusahaan tidak ditemukan"));
  }

  const updatedCompany = await CompaniesRepositories.updateCompanyById(id, {
    name,
    location,
    description,
  });

  if (!updatedCompany) {
    return next(new InvariantError("Perusahaan gagal diperbarui"));
  }

  return response(res, 200, "Perusahaan berhasil diperbarui", updatedCompany);
};

export const deleteCompany = async (req, res, next) => {
  const { id } = req.params;

  const companyCheck = await CompaniesRepositories.getCompanyById(id);
  if (!companyCheck) {
    return next(new NotFoundError("Perusahaan tidak ditemukan"));
  }

  const deletedCompany = await CompaniesRepositories.deleteCompanyById(id);
  if (!deletedCompany) {
    return next(new InvariantError("Perusahaan gagal dihapus"));
  }

  return response(res, 200, "Perusahaan berhasil dihapus");
};
