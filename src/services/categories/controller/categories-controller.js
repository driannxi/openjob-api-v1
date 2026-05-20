import CategoriesRepositories from "../repositories/categories-repositories.js";
import response from "../../../utils/response.js";
import { InvariantError, NotFoundError } from "../../../exceptions/index.js";

export const createCategory = async (req, res, next) => {
  const { name } = req.validated;

  const isCategoryExist = await CategoriesRepositories.verifyNewCategory(name);
  if (isCategoryExist) {
    return next(
      new InvariantError(
        "Gagal menambahkan kategori. Nama kategori sudah digunakan.",
      ),
    );
  }

  const category = await CategoriesRepositories.createCategory({ name });
  if (!category) {
    return next(new InvariantError("Kategori gagal ditambahkan"));
  }
  return response(res, 201, "Kategori berhasil ditambahkan", category);
};

export const getAllCategories = async (req, res, next) => {
  const categories = await CategoriesRepositories.getAllCategories();

  return response(res, 200, "Daftar kategori berhasil ditampilkan", {
    categories,
  });
};

export const getCategoryById = async (req, res, next) => {
  const { id } = req.params;
  const category = await CategoriesRepositories.getCategoryById(id);

  if (!category) {
    return next(new NotFoundError("Kategori tidak ditemukan"));
  }

  return response(res, 200, "Detail kategori berhasil ditampilkan", category);
};

export const updateCategory = async (req, res, next) => {
  const { id } = req.params;

  const categoryCheck = await CategoriesRepositories.getCategoryById(id);
  if (!categoryCheck) {
    return next(new NotFoundError("Kategori tidak ditemukan"));
  }

  const { name } = req.validated;

  if (name !== categoryCheck.name) {
    const isNameExist = await CategoriesRepositories.verifyNewCategory(name);
    if (isNameExist) {
      return next(
        new InvariantError(
          "Gagal memperbarui kategori. Nama kategori sudah digunakan.",
        ),
      );
    }
  }

  const updatedCategory = await CategoriesRepositories.updateCategoryById(id, {
    name,
  });
  if (!updatedCategory) {
    return next(new InvariantError("Kategori gagal diperbarui"));
  }

  return response(res, 200, "Kategori berhasil diperbarui", updatedCategory);
};

export const deleteCategory = async (req, res, next) => {
  const { id } = req.params;

  const categoryCheck = await CategoriesRepositories.getCategoryById(id);
  if (!categoryCheck) {
    return next(new NotFoundError("Kategori tidak ditemukan"));
  }

  const deletedCategory = await CategoriesRepositories.deleteCategoryById(id);
  if (!deletedCategory) {
    return next(new InvariantError("Kategori gagal dihapus"));
  }

  return response(res, 200, "Kategori berhasil dihapus");
};
