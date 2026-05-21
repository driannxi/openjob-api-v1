export const up = (pgm) => {
  pgm.createTable("jobs", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    company_id: {
      type: "VARCHAR(50)",
      notNull: true,
      references: '"companies"',
      onDelete: "CASCADE",
    },
    category_id: {
      type: "VARCHAR(50)",
      notNull: true,
      references: '"categories"',
      onDelete: "CASCADE",
    },
    title: {
      type: "VARCHAR(255)",
      notNull: true,
    },
    description: {
      type: "TEXT",
      notNull: true,
    },
    job_type: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    experience_level: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    location_type: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    location_city: {
      type: "VARCHAR(100)",
      notNull: true,
    },
    salary_min: {
      type: "NUMERIC",
      notNull: true,
    },
    salary_max: {
      type: "NUMERIC",
      notNull: true,
    },
    is_salary_visible: {
      type: "BOOLEAN",
      notNull: true,
      default: true,
    },
    status: {
      type: "VARCHAR(20)",
      notNull: true,
      default: "open",
    },
    created_at: {
      type: "TIMESTAMP",
      notNull: true,
    },
    updated_at: {
      type: "TIMESTAMP",
      notNull: true,
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable("jobs");
};
