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
    status: {
      type: "VARCHAR(20)",
      notNull: true,
      default: "open",
    },
    location_city: {
      type: "VARCHAR(100)",
      notNull: false,
    },
    salary_min: {
      type: "NUMERIC",
      notNull: false,
    },
    salary_max: {
      type: "NUMERIC",
      notNull: false,
    },
    is_salary_visible: {
      type: "BOOLEAN",
      notNull: false,
      default: true,
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
