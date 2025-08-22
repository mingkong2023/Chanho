//mysql配置
let debug = process.env.DB_DEBUG === "false" ? false : true;
export const db = [
  {
    key: "", //多数据库索名称
    client: "mysql2",
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "123456",
    database: process.env.DB_DATABASE || "huida",
    debug: debug,
  },
];
