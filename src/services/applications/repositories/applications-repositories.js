import { Pool } from "pg";
import { nanoid } from "nanoid";

class ApplicationsRepositories {
  constructor() {
    this.pool = new Pool();
  }

  async applyJob({ user_id, job_id, status }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: "INSERT INTO applications (id, user_id, job_id, status, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6) RETURNING id, user_id, job_id, status",
      values: [id, user_id, job_id, status, createdAt, updatedAt],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async getAllApplications() {
    const query = {
      text: "SELECT a.*, j.title AS job_title, u.name AS user_name FROM applications a LEFT JOIN jobs j ON a.job_id = j.id LEFT JOIN users u ON a.user_id = u.id ORDER BY a.created_at DESC",
    };

    const result = await this.pool.query(query);
    return result.rows;
  }

  async getApplicationById(id) {
    const query = {
      text: "SELECT a.*, j.title AS job_title, u.name AS user_name FROM applications a LEFT JOIN jobs j ON a.job_id = j.id LEFT JOIN users u ON a.user_id = u.id WHERE a.id = $1",
      values: [id],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async getApplicationsByUserId(userId) {
    const query = {
      text: "SELECT a.*, j.title AS job_title, u.name AS user_name FROM applications a LEFT JOIN jobs j ON a.job_id = j.id LEFT JOIN users u ON a.user_id = u.id WHERE a.user_id = $1 ORDER BY a.created_at DESC",
      values: [userId],
    };

    const result = await this.pool.query(query);
    return result.rows;
  }

  async getApplicationsByJobId(jobId) {
    const query = {
      text: "SELECT a.*, j.title AS job_title, u.name AS user_name FROM applications a LEFT JOIN jobs j ON a.job_id = j.id LEFT JOIN users u ON a.user_id = u.id WHERE a.job_id = $1 ORDER BY a.created_at DESC",
      values: [jobId],
    };

    const result = await this.pool.query(query);
    return result.rows;
  }

  async updateApplicationStatus(id, status) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: "UPDATE applications SET status = $1, updated_at = $2 WHERE id = $3 RETURNING id, user_id, job_id, status",
      values: [status, updatedAt, id],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async deleteApplicationById(id) {
    const query = {
      text: "DELETE FROM applications WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }
}

export default new ApplicationsRepositories();
