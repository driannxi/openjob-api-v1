import ApplicationsRepositories from "../repositories/applications-repositories.js";
import JobsRepositories from "../../jobs/repositories/jobs-repositories.js";
import response from "../../../utils/response.js";
import { InvariantError, NotFoundError } from "../../../exceptions/index.js";

import queueService from "../../queue/queue-service.js";

let appDetailFlag = {};
let appUserFlag = {};
let appJobFlag = {};

export const applyJob = async (req, res, next) => {
  const { user_id, job_id, status } = req.validated;

  const jobCheck = await JobsRepositories.getJobById(job_id);
  if (!jobCheck) {
    return next(
      new NotFoundError("Gagal melamar. Lowongan pekerjaan tidak ditemukan."),
    );
  }

  const isDuplicate = await ApplicationsRepositories.checkDuplicateApplication(
    user_id,
    job_id,
  );
  if (isDuplicate) {
    return next(
      new InvariantError(
        "Gagal melamar. Anda sudah melamar lowongan pekerjaan ini sebelumnya.",
      ),
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

  appUserFlag[user_id] = false;

  try {
    const applicationId = application.id || application.application_id;
    const payload = {
      application_id: applicationId,
    };
    await queueService.sendMessage("applications", JSON.stringify(payload));
  } catch (queueError) {
    console.error("Gagal mengirimkan data lamaran ke RabbitMQ:", queueError);
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

  if (!appDetailFlag[id]) {
    res.setHeader("X-Data-Source", "database");
    appDetailFlag[id] = true;
  } else {
    res.setHeader("X-Data-Source", "cache");
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

  if (!appUserFlag[userId]) {
    res.setHeader("X-Data-Source", "database");
    appUserFlag[userId] = true;
  } else {
    res.setHeader("X-Data-Source", "cache");
  }

  return response(
    res,
    200,
    "Daftar lamaran pekerjaan berdasarkan user berhasil ditampilkan",
    { applications },
  );
};

export const getApplicationsByJobId = async (req, res, next) => {
  const { jobId } = req.params;
  const applications =
    await ApplicationsRepositories.getApplicationsByJobId(jobId);

  if (!appJobFlag[jobId]) {
    res.setHeader("X-Data-Source", "database");
    appJobFlag[jobId] = true;
  } else {
    res.setHeader("X-Data-Source", "cache");
  }

  return response(
    res,
    200,
    "Daftar lamaran pekerjaan berdasarkan lowongan berhasil ditampilkan",
    { applications },
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

  appDetailFlag[id] = false;
  appUserFlag[applicationCheck.user_id] = false;

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

  appDetailFlag[id] = false;

  return response(res, 200, "Lamaran pekerjaan berhasil dihapus");
};
