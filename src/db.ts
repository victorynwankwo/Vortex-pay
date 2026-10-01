import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: true,
  },
});

// console.log(process.env.DATABASE_URL);
export default pool;
