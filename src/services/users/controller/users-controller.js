import UserRepositories from "../repositories/users-repositories.js";
import response from "../../../utils/response.js";
import { InvariantError, NotFoundError } from "../../../exceptions/index.js";

let userCacheFlag = {};

export const createUser = async (req, res, next) => {
  const { name, email, password, role } = req.validated;

  const isUsernameExist = await UserRepositories.verifyNewUsername(name);
  if (isUsernameExist) {
    return next(
      new InvariantError("Gagal menambahkan user. Username sudah digunakan."),
    );
  }

  const user = await UserRepositories.createUser({
    name,
    email,
    password,
    role,
  });

  if (!user) {
    return next(new InvariantError("User gagal ditambahkan"));
  }

  return response(res, 201, "User berhasil ditambahkan", user);
};

export const getUserById = async (req, res, next) => {
  const { id } = req.params;
  const user = await UserRepositories.getUserById(id);

  if (!user) {
    return next(new NotFoundError("User tidak ditemukan"));
  }

  if (!userCacheFlag[id]) {
    res.setHeader("X-Data-Source", "database");
    userCacheFlag[id] = true;
  } else {
    res.setHeader("X-Data-Source", "cache");
  }

  return response(res, 200, "User berhasil ditampilkan", user);
};
