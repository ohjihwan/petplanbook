// data/db.mjs
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "my_database",
  waitForConnections: true,
  connectionLimit: 10,
});

export default pool;
