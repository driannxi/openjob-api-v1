import { Pool } from "pg";
import { nanoid } from "nanoid";

class CategoriesRepositories {
  constructor() {
    this.pool = new Pool();
  }

  async createCategory({ name }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: "INSERT INTO categories VALUES($1, $2, $3, $4) RETURNING id, name",
      values: [id, name, createdAt, updatedAt],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async verifyNewCategory(name) {
    const query = {
      text: "SELECT name FROM categories WHERE name = $1",
      values: [name],
    };

    const result = await this.pool.query(query);
    return result.rows.length > 0;
  }

  async getAllCategories() {
    const query = {
      text: "SELECT id, name, created_at, updated_at FROM categories ORDER BY name ASC",
    };

    const result = await this.pool.query(query);
    return result.rows;
  }

  async getCategoryById(id) {
    const query = {
      text: "SELECT id, name, created_at, updated_at FROM categories WHERE id = $1",
      values: [id],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async updateCategoryById(id, { name }) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: "UPDATE categories SET name = $1, updated_at = $2 WHERE id = $3 RETURNING id, name",
      values: [name, updatedAt, id],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async deleteCategoryById(id) {
    const query = {
      text: "DELETE FROM categories WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }
}

export default new CategoriesRepositories();
