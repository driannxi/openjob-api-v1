import { Pool } from "pg";
import { nanoid } from "nanoid";

class CompaniesRepositories {
  constructor() {
    this.pool = new Pool();
  }

  async createCompany({ name, location, description }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: "INSERT INTO companies VALUES($1, $2, $3, $4, $5, $6) RETURNING id, name, location, description",
      values: [id, name, location, description, createdAt, updatedAt],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async verifyNewCompany(name) {
    const query = {
      text: "SELECT name FROM companies WHERE name = $1",
      values: [name],
    };

    const result = await this.pool.query(query);

    return result.rows.length > 0;
  }

  async getCompanyById(id) {
    const query = {
      text: "SELECT id, name FROM companies WHERE id = $1",
      values: [id],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async getAllCompanies() {
    const query = {
      text: "SELECT id, name, location, description, created_at, updated_at FROM companies ORDER BY created_at DESC",
    };

    const result = await this.pool.query(query);
    return result.rows;
  }

  async updateCompanyById(id, { name, location, description }) {
    const updatedAt = new Date().toISOString();

    // const query = {
    //   text: `UPDATE companies 
    //      SET name = $1, location = $2, description = $3, updated_at = $4 
    //      WHERE id = $5 
    //      RETURNING id, name, location, description`,
    //   values: [name, location, description, updatedAt, id],
    // };
    const query = {
      text: "UPDATE companies SET name = $1, location = $2, description = $3, updated_at = $4 WHERE id = $5 RETURNING id, name, location, description",
      values: [name, location, description, updatedAt, id],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async deleteCompanyById(id) {
    const query = {
      text: "DELETE FROM companies WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }
}

export default new CompaniesRepositories();
