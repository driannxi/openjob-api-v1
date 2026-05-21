import JobsRepositories from "../repositories/jobs-repositories.js";
import CompaniesRepositories from "../../companies/repositories/companies-repositories.js";
import CategoriesRepositories from "../../categories/repositories/categories-repositories.js";
import response from "../../../utils/response.js";
import { InvariantError, NotFoundError } from "../../../exceptions/index.js";

export const createJob = async (req, res, next) => {
  const {
    company_id,
    category_id,
    title,
    description,
    job_type,
    experience_level,
    location_type,
    status,
    location_city = null,
    salary_min = null,
    salary_max = null,
    is_salary_visible = true,
  } = req.validated;

  const companyCheck = await CompaniesRepositories.getCompanyById(company_id);
  if (!companyCheck) {
    return next(
      new NotFoundError(
        "Gagal menambahkan lowongan. Perusahaan tidak ditemukan.",
      ),
    );
  }

  const categoryCheck =
    await CategoriesRepositories.getCategoryById(category_id);
  if (!categoryCheck) {
    return next(
      new NotFoundError(
        "Gagal menambahkan lowongan. Kategori tidak ditemukan.",
      ),
    );
  }

  const job = await JobsRepositories.createJob({
    company_id,
    category_id,
    title,
    description,
    job_type,
    experience_level,
    location_type,
    status,
    location_city,
    salary_min,
    salary_max,
    is_salary_visible,
  });

  if (!job) {
    return next(new InvariantError("Lowongan pekerjaan gagal ditambahkan"));
  }

  return response(res, 201, "Lowongan pekerjaan berhasil ditambahkan", job);
};

export const getAllJobs = async (req, res, next) => {
  const jobs = await JobsRepositories.getAllJobs();

  return response(res, 200, "Daftar lowongan pekerjaan berhasil ditampilkan", {
    jobs,
  });
};

export const getJobById = async (req, res, next) => {
  const { id } = req.params;
  const job = await JobsRepositories.getJobById(id);

  if (!job) {
    return next(new NotFoundError("Lowongan pekerjaan tidak ditemukan"));
  }

  return response(
    res,
    200,
    "Detail lowongan pekerjaan berhasil ditampilkan",
    job,
  );
};

export const getJobsByCompanyId = async (req, res, next) => {
  const { companyId } = req.params;

  const jobs = await JobsRepositories.getJobsByCompanyId(companyId);
  return response(
    res,
    200,
    "Daftar lowongan pekerjaan berdasarkan perusahaan berhasil ditampilkan",
    { jobs },
  );
};

export const getJobsByCategoryId = async (req, res, next) => {
  const { categoryId } = req.params;

  const jobs = await JobsRepositories.getJobsByCategoryId(categoryId);
  return response(
    res,
    200,
    "Daftar lowongan pekerjaan berdasarkan kategori berhasil ditampilkan",
    { jobs },
  );
};

export const updateJobById = async (req, res, next) => {
  const { id } = req.params;

  const jobCheck = await JobsRepositories.getJobById(id);
  if (!jobCheck) {
    return next(new NotFoundError("Lowongan pekerjaan tidak ditemukan"));
  }

  const {
    company_id,
    category_id,
    title,
    description,
    job_type,
    experience_level,
    location_type,
    status,
    location_city = null,
    salary_min = null,
    salary_max = null,
    is_salary_visible = true,
  } = req.validated;

  const companyCheck = await CompaniesRepositories.getCompanyById(company_id);
  if (!companyCheck) {
    return next(
      new NotFoundError(
        "Gagal memperbarui lowongan. Perusahaan tidak ditemukan.",
      ),
    );
  }

  const categoryCheck =
    await CategoriesRepositories.getCategoryById(category_id);
  if (!categoryCheck) {
    return next(
      new NotFoundError(
        "Gagal memperbarui lowongan. Kategori tidak ditemukan.",
      ),
    );
  }

  const updatedJob = await JobsRepositories.updateJobById(id, {
    company_id,
    category_id,
    title,
    description,
    job_type,
    experience_level,
    location_type,
    status,
    location_city,
    salary_min,
    salary_max,
    is_salary_visible,
  });

  if (!updatedJob) {
    return next(new InvariantError("Lowongan pekerjaan gagal diperbarui"));
  }

  return response(
    res,
    200,
    "Lowongan pekerjaan berhasil diperbarui",
    updatedJob,
  );
};

export const deleteJobById = async (req, res, next) => {
  const { id } = req.params;

  const jobCheck = await JobsRepositories.getJobById(id);
  if (!jobCheck) {
    return next(new NotFoundError("Lowongan pekerjaan tidak ditemukan"));
  }

  const deletedJob = await JobsRepositories.deleteJobById(id);
  if (!deletedJob) {
    return next(new InvariantError("Lowongan pekerjaan gagal dihapus"));
  }

  return response(res, 200, "Lowongan pekerjaan berhasil dihapus");
};
