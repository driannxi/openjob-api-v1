import ApplicationsRepositories from "../repositories/applications-repositories.js";
import JobsRepositories from "../../jobs/repositories/jobs-repositories.js";
import response from "../../../utils/response.js";
import { InvariantError, NotFoundError } from "../../../exceptions/index.js";

export const applyJob = async (req, res, next) => {
  const { user_id, job_id, status } = req.validated;

  const jobCheck = await JobsRepositories.getJobById(job_id);
  if (!jobCheck) {
    return next(
      new NotFoundError("Gagal melamar. Lowongan pekerjaan tidak ditemukan."),
    );
  }

  const application = await ApplicationsRepositories.applyJob({
    user_id,
    job_id,
    status,
  });

  if (!application) {
    return next(new InvariantError("Gagal membuat lamaran pekerjaan"));
  }

  return response(res, 201, "Lamaran pekerjaan berhasil dikirim", application);
};

export const getAllApplications = async (req, res, next) => {
  const applications = await ApplicationsRepositories.getAllApplications();

  return response(res, 200, "Daftar lamaran pekerjaan berhasil ditampilkan", {
    applications,
  });
};

export const getApplicationById = async (req, res, next) => {
  const { id } = req.params;
  const application = await ApplicationsRepositories.getApplicationById(id);

  if (!application) {
    return next(new NotFoundError("Lamaran pekerjaan tidak ditemukan"));
  }

  return response(
    res,
    200,
    "Detail lamaran pekerjaan berhasil ditampilkan",
    application,
  );
};

export const getApplicationsByUserId = async (req, res, next) => {
  const { userId } = req.params;

  const applications =
    await ApplicationsRepositories.getApplicationsByUserId(userId);

  return response(
    res,
    200,
    "Daftar lamaran pekerjaan berdasarkan user berhasil ditampilkan",
    {
      applications,
    },
  );
};

export const getApplicationsByJobId = async (req, res, next) => {
  const { jobId } = req.params;

  const applications =
    await ApplicationsRepositories.getApplicationsByJobId(jobId);

  return response(
    res,
    200,
    "Daftar lamaran pekerjaan berdasarkan lowongan berhasil ditampilkan",
    {
      applications,
    },
  );
};

export const updateApplicationStatus = async (req, res, next) => {
  const { id } = req.params;

  const applicationCheck =
    await ApplicationsRepositories.getApplicationById(id);
  if (!applicationCheck) {
    return next(new NotFoundError("Lamaran pekerjaan tidak ditemukan"));
  }

  const { status } = req.validated;

  const updatedApplication =
    await ApplicationsRepositories.updateApplicationStatus(id, status);
  if (!updatedApplication) {
    return next(
      new InvariantError("Status lamaran pekerjaan gagal diperbarui"),
    );
  }

  return response(
    res,
    200,
    "Status lamaran pekerjaan berhasil diperbarui",
    updatedApplication,
  );
};

export const deleteApplication = async (req, res, next) => {
  const { id } = req.params;

  const applicationCheck =
    await ApplicationsRepositories.getApplicationById(id);
  if (!applicationCheck) {
    return next(new NotFoundError("Lamaran pekerjaan tidak ditemukan"));
  }

  const deletedApplication =
    await ApplicationsRepositories.deleteApplicationById(id);
  if (!deletedApplication) {
    return next(new InvariantError("Lamaran pekerjaan gagal dihapus"));
  }

  return response(res, 200, "Lamaran pekerjaan berhasil dihapus");
};
