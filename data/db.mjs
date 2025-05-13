import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "1234", // 실제 비밀번호로 변경 필요
  database: "database",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
