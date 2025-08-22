import knex from 'knex';


export const db = function({
  client='mysql2',
  host='127.0.0.1',
  user='root',
  password='123456',
  database='test',
  debug=true,
  charset='utf8mb4',
  min=0,
  max=2,
} ) {

  let config = {
    client ,
    connection: {
        host ,
        user ,
        password,
        database,
        charset,
    } ,
    debug,
    pool: { //默认为{min: 2, max: 10},连接池配置
        min,
        max,
      },
    log: {
        warn(message) {
          console.error("[knex warn]", message);
        },
        error(message) {
          console.error("[knex error]", message);
        },
        debug(message) {
          console.log("[knex debug]", message);
        },
        deprecate(message) {
          console.warn("[knex deprecate]", message);
        },
        trace(message) {
          console.log("[knex trace]", message);
        },
        log(message) {
          console.log("[knex log]", message);
        },
        info(message) {
          console.log("[knex info]", message);
        },

      },
}
    return knex(config);
}

const errCode = {
  "ECONNREFUSED": "数据库连接被拒绝，请检查数据库服务是否正常运行。",
  "ER_ACCESS_DENIED_ERROR": "无权限访问，账号或密码错误。",
  "ER_ROW_IS_REFERENCED_2": "无法删除或更新记录，存在关联数据。",
  "ER_BAD_FIELD_ERROR": "SQL语句中包含无效字段，请检查查询条件或列名。",
  "ER_DUP_ENTRY": "插入失败：数据重复，违反唯一性约束。",
  "ER_NO_SUCH_TABLE": "操作失败：目标表不存在。",
  "ETIMEOUT": "数据库操作超时，请稍后再试。"
}
const getDefaultErrorMessage = (error) => {
  if (error.message.includes('syntax') ||
    error.message.includes('SQL')) {
    return '数据库语法错误，请检查您的查询语句。';
  } else if (error.message.includes('Connection closed')) {
    return '数据库连接已关闭，请重试。';
  } else if (error.message.includes('permission')) {
    return '数据库权限不足，请检查配置。';
  }
  return '数据库发生未知错误，请稍后重试。';
}