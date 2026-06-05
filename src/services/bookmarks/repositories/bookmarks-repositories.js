import { Pool } from "pg";
import { nanoid } from "nanoid";

const baseBookmarkSelectQuery = `
    SELECT 
      b.id, b.user_id, b.job_id, b.created_at AS bookmarked_at,
      j.title, j.description, j.job_type, j.experience_level, j.location_type, 
      j.status, j.created_at, j.updated_at, j.location_city, j.salary_min, 
      j.salary_max, j.is_salary_visible, j.category_id,
      c.name AS company_name
    FROM bookmarks b
    LEFT JOIN jobs j ON b.job_id = j.id
    LEFT JOIN companies c ON j.company_id = c.id
  `;

class BookmarksRepositories {
  constructor() {
    this.pool = new Pool();
  }

  async addBookmark({ user_id, job_id }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();

    const query = {
      text: "INSERT INTO bookmarks (id, user_id, job_id, created_at) VALUES($1, $2, $3, $4) RETURNING id, user_id, job_id, created_at",
      values: [id, user_id, job_id, createdAt],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async checkDuplicateBookmark(user_id, job_id) {
    const query = {
      text: "SELECT id FROM bookmarks WHERE user_id = $1 AND job_id = $2",
      values: [user_id, job_id],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async getBookmarksByUserId(userId) {
    const query = {
      text: `${baseBookmarkSelectQuery} WHERE b.user_id = $1 ORDER BY b.created_at DESC`,
      values: [userId],
    };
    const result = await this.pool.query(query);
    return result.rows;
  }

  async getBookmarkById(id) {
    const query = {
      text: `${baseBookmarkSelectQuery} WHERE b.id = $1`,
      values: [id],
    };
    const result = await this.pool.query(query);
    return result.rows[0];
  }
  async deleteBookmarkByUserAndJob(userId, jobId) {
    const query = {
      text: "DELETE FROM bookmarks WHERE user_id = $1 AND job_id = $2 RETURNING id",
      values: [userId, jobId],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }
}

export default new BookmarksRepositories();
