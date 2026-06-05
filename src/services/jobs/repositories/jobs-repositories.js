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

  async getAllJobs(queryOptions = {}) {
    let sqlText = `
      SELECT 
        j.id, j.company_id, j.category_id, j.title, j.description, 
        j.job_type, j.experience_level, j.location_type, j.status, 
        j.created_at, j.updated_at, 
        c.name AS company_name, cat.name AS category_name 
      FROM jobs j 
      LEFT JOIN companies c ON j.company_id = c.id 
      LEFT JOIN categories cat ON j.category_id = cat.id 
      WHERE 1=1
    `;

    const values = [];
    let valueCounter = 1;

    if (queryOptions.title) {
      sqlText += ` AND j.title ILIKE $${valueCounter}`;
      values.push(`%${queryOptions.title}%`);
      valueCounter++;
    }

    if (queryOptions["company-name"]) {
      sqlText += ` AND c.name ILIKE $${valueCounter}`;
      values.push(`%${queryOptions["company-name"]}%`);
      valueCounter++;
    }

    sqlText += " ORDER BY j.created_at DESC";

    const query = {
      text: sqlText,
      values: values,
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

  async updateJobById(id, dataUpdate) {
    const updatedAt = new Date().toISOString();
    const data = { ...dataUpdate, updated_at: updatedAt };

    const keys = Object.keys(data);
    if (keys.length === 0) return null;

    const setClause = keys
      .map((key, index) => `"${key}" = $${index + 1}`)
      .join(", ");

    const values = Object.values(data);

    values.push(id);
    const idPosition = values.length;

    const query = {
      text: `UPDATE jobs SET ${setClause} WHERE id = $${idPosition} RETURNING id, title, status`,
      values: values,
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
