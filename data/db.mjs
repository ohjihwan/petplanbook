// data/db.mjs
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "liberty",
  database: "database",
  waitForConnections: true,
  connectionLimit: 10,
});

export default pool;
