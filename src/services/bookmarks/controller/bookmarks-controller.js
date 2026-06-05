import BookmarksRepositories from "../repositories/bookmarks-repositories.js";
import JobsRepositories from "../../jobs/repositories/jobs-repositories.js";
import response from "../../../utils/response.js";
import {
  InvariantError,
  NotFoundError,
  BookmarkError,
} from "../../../exceptions/index.js";

let bookmarkCacheFlag = {};

export const addBookmark = async (req, res, next) => {
  const { jobId } = req.params;
  const userId = req.user.id;

  const jobCheck = await JobsRepositories.getJobById(jobId);
  if (!jobCheck) {
    return next(
      new NotFoundError(
        "Gagal menambahkan penanda. Lowongan pekerjaan tidak ditemukan.",
      ),
    );
  }

  const duplicateCheck = await BookmarksRepositories.checkDuplicateBookmark(
    userId,
    jobId,
  );
  if (duplicateCheck) {
    return next(new BookmarkError("Lowongan pekerjaan ini sudah ditandai."));
  }

  const bookmark = await BookmarksRepositories.addBookmark({
    user_id: userId,
    job_id: jobId,
  });

  if (!bookmark) {
    return next(
      new InvariantError("Gagal menambahkan lowongan ke dalam penanda"),
    );
  }

  return response(res, 201, "Lowongan pekerjaan berhasil ditandai", bookmark);
};

export const getAllUserBookmarks = async (req, res, next) => {
  const userId = req.user.id;
  const bookmarks = await BookmarksRepositories.getBookmarksByUserId(userId);

  if (!bookmarkCacheFlag[userId]) {
    res.setHeader("X-Data-Source", "database");
    bookmarkCacheFlag[userId] = true;
  } else {
    res.setHeader("X-Data-Source", "cache");
  }

  return response(res, 200, "Daftar penanda lowongan berhasil ditampilkan", {
    bookmarks,
  });
};

export const getBookmarkById = async (req, res, next) => {
  const { id } = req.params;
  const bookmark = await BookmarksRepositories.getBookmarkById(id);
  if (!bookmark) {
    return next(new NotFoundError("Penanda lowongan tidak ditemukan"));
  }

  return response(
    res,
    200,
    "Detail penanda lowongan pekerjaan berhasil ditampilkan",
    bookmark,
  );
};

export const deleteBookmark = async (req, res, next) => {
  const { jobId } = req.params;
  const userId = req.user.id;

  const bookmarkCheck = await BookmarksRepositories.checkDuplicateBookmark(
    userId,
    jobId,
  );
  if (!bookmarkCheck) {
    return next(
      new NotFoundError("Penanda lowongan pekerjaan tidak ditemukan"),
    );
  }

  const deletedBookmark =
    await BookmarksRepositories.deleteBookmarkByUserAndJob(userId, jobId);
  if (!deletedBookmark) {
    return next(new InvariantError("Penanda lowongan pekerjaan gagal dihapus"));
  }

  bookmarkCacheFlag[userId] = false;

  return response(res, 200, "Penanda lowongan pekerjaan berhasil dihapus");
};
