import { Pool } from "pg";
import { nanoid } from "nanoid";

class JobsRepositories {
  constructor() {
    this.pool = new Pool();
  }

  async createJob({
    company_id,
    category_id,
    title,
    description,
    job_type,
    experience_level,
    location_type,
    location_city,
    salary_min,
    salary_max,
    is_salary_visible,
    status,
  }) {
    const id = `job-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: "INSERT INTO jobs (id, company_id, category_id, title, description, job_type, experience_level, location_type, location_city, salary_min, salary_max, is_salary_visible, status, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING id, title, status",
      values: [
        id,
        company_id,
        category_id,
        title,
        description,
        job_type,
        experience_level,
        location_type,
        location_city,
        salary_min,
        salary_max,
        is_salary_visible,
        status,
        createdAt,
        updatedAt,
      ],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async getAllJobs() {
    const query = {
      text: "SELECT j.*, c.name AS company_name, cat.name AS category_name FROM jobs j LEFT JOIN companies c ON j.company_id = c.id LEFT JOIN categories cat ON j.category_id = cat.id ORDER BY j.created_at DESC",
    };

    const result = await this.pool.query(query);
    return result.rows;
  }

  async getJobById(id) {
    const query = {
      text: "SELECT j.*, c.name AS company_name, cat.name AS category_name FROM jobs j LEFT JOIN companies c ON j.company_id = c.id LEFT JOIN categories cat ON j.category_id = cat.id WHERE j.id = $1",
      values: [id],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async getJobsByCompanyId(companyId) {
    const query = {
      text: "SELECT j.*, c.name AS company_name, cat.name AS category_name FROM jobs j LEFT JOIN companies c ON j.company_id = c.id LEFT JOIN categories cat ON j.category_id = cat.id WHERE j.company_id = $1 ORDER BY j.created_at DESC",
      values: [companyId],
    };

    const result = await this.pool.query(query);
    return result.rows;
  }

  async getJobsByCategoryId(categoryId) {
    const query = {
      text: "SELECT j.*, c.name AS company_name, cat.name AS category_name FROM jobs j LEFT JOIN companies c ON j.company_id = c.id LEFT JOIN categories cat ON j.category_id = cat.id WHERE j.category_id = $1 ORDER BY j.created_at DESC",
      values: [categoryId],
    };

    const result = await this.pool.query(query);
    return result.rows;
  }

  async updateJobById(
    id,
    {
      company_id,
      category_id,
      title,
      description,
      job_type,
      experience_level,
      location_type,
      location_city,
      salary_min,
      salary_max,
      is_salary_visible,
      status,
    },
  ) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: "UPDATE jobs SET company_id = $1, category_id = $2, title = $3, description = $4, job_type = $5, experience_level = $6, location_type = $7, location_city = $8, salary_min = $9, salary_max = $10, is_salary_visible = $11, status = $12, updated_at = $13 WHERE id = $14 RETURNING id, title, status",
      values: [
        company_id,
        category_id,
        title,
        description,
        job_type,
        experience_level,
        location_type,
        location_city,
        salary_min,
        salary_max,
        is_salary_visible,
        status,
        updatedAt,
        id,
      ],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async deleteJobById(id) {
    const query = {
      text: "DELETE FROM jobs WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }
}

export default new JobsRepositories();
