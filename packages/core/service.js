// ====================== 模块级别工具函数 (只初始化一次) ======================
const errCode = {
  "ECONNREFUSED": "数据库连接被拒绝，请检查数据库服务是否正常运行。",
  "ER_ACCESS_DENIED_ERROR": "无权限访问，账号或密码错误。",
  "ER_ROW_IS_REFERENCED_2": "无法删除或更新记录，存在关联数据。",
  "ER_BAD_FIELD_ERROR": "SQL语句中包含无效字段，请检查查询条件或列名。",
  "ER_DUP_ENTRY": "插入失败：数据重复，违反唯一性约束。",
  "ER_NO_SUCH_TABLE": "操作失败：目标表不存在。",
  "ETIMEOUT": "数据库操作超时，请稍后再试。"
};

const getDefaultErrorMessage = (error) => {
  if (error.message.includes('syntax') || error.message.includes('SQL')) {
    return '数据库语法错误，请检查您的查询语句。';
  } else if (error.message.includes('Connection closed')) {
    return '数据库连接已关闭，请重试。';
  } else if (error.message.includes('permission')) {
    return '数据库权限不足，请检查配置。';
  }
  return '数据库发生未知错误，请稍后重试。';
};

const errorResponse = (err) => {
  console.error('DB Error:', err);
  const message = errCode[err.code] || getDefaultErrorMessage(err);
  return {
    success: false,
    msg: message,
    code: 500,
    data: {
      sql: err.sql,
      sqlMessage: err.sqlMessage
    }
  };
};

const failResponse = (msg = "操作失败", data = {}) => {
  console.warn('Operation failed:', msg);
  return {
    success: false,
    msg,
    code: 201,
    data
  };
};

const successResponse = (data = {}, msg = "操作成功") => ({
  success: true,
  msg,
  code: 200,
  data
});

// ====================== 共享数据库方法 (只创建一次) ======================
const databaseMethods = {
  /**
   * 查询表所有记录（慎用）
   * @param {Object} query - 查询条件
   * @returns {Promise} 查询结果
   */
  async all(query = {}) {
    try {
      let dbQuery = this.knex(this.model);
      if (Object.keys(query).length > 0) {
        dbQuery = dbQuery.where(query);
      }
      const res = await dbQuery.select();
      return successResponse(res);
    } catch (err) {
      return errorResponse(err);
    }
  },

  /**
   * 获取单个记录
   * @param {Object} query - 查询条件
   * @returns {Promise} 查询结果
   *  
   * */

  async one(query = {}) {
    try {
      let dbQuery = this.knex(this.model);
      if (Object.keys(query).length > 0) {
        dbQuery = dbQuery.where(query);
      }
      const res = await dbQuery.first();
      return successResponse(res);
    } catch (err) {
      return errorResponse(err);
    }
  },

  /**
   * 根据ID查询记录
   * @param {Object} options - 查询选项
   * @param {Object} options.query - 查询条件
   * @param {Array} options.field - 返回字段
   * @param {number} options.len - 返回数量
   */
  async findById({ query, field = [], len = 1 }) {
    try {
      let dataQuery = this.knex(this.model).where(query);
      if (field.length > 0) dataQuery = dataQuery.select(field);
      if (len === 1) dataQuery = dataQuery.first();
      else if (len > 1) dataQuery = dataQuery.limit(len);
      
      const res = await dataQuery;
      return successResponse(res || (len === 1 ? {} : []));
    } catch (err) {
      return errorResponse(err);
    }
  },

  /**
   * 创建新记录
   * @param {Object} data - 包含要插入的数据对象
   * @returns {Promise} 操作结果
   */
  async insert(data = {}) {
    try {
      if (Object.keys(data).length === 0) {
        return failResponse('插入数据不能为空');
      }
      const result = await this.knex(this.model).insert(data);
      return successResponse(result?.length > 0 || !!result);
    } catch (err) {
      return errorResponse(err);
    }
  },

  /**
   * 插入多条记录
   * @param {Array} records - 包含要插入的数据对象数组
   * @returns {Promise} 操作结果
   */
  async insertMany(records = []) {
    try {
      if (records.length === 0) {
        return failResponse('插入数据不能为空');
      }
      const result = await this.knex(this.model).insert(records);
      return successResponse(result);
    } catch (err) {
      return errorResponse(err);
    }
  },

  /**
   * 根据指定条件删除记录
   * @param {Object} query - 包含查询条件的对象
   * @returns {Promise} 操作结果
   */
  async delete(query = {}) {
    try {
      if (Object.keys(query).length === 0) {
        return failResponse("请指定删除条件");
      }
      const affectedRows = await this.knex(this.model).where(query).del();
      return successResponse(affectedRows > 0);
    } catch (err) {
      return errorResponse(err);
    }
  },

  /**
   * 根据指定条件更新记录
   * @param {Object} options - 更新选项
   * @param {Object} options.query - 查询条件
   * @param {Object} options.params - 更新数据
   * @returns {Promise} 操作结果
   */
  async update({ query, params } = {}) {
    try {
      if (!query || !params || Object.keys(query).length === 0) {
        return failResponse("参数错误");
      }
      const result = await this.knex(this.model).where(query).update(params);
      return successResponse(!!result);
    } catch (err) {
      return errorResponse(err);
    }
  },

  /**
   * 批量更新多条记录
   * @param {Array} updates - 更新操作数组
   * @returns {Promise} 操作结果
   */
  async updateMany(updates = []) {
    if (!Array.isArray(updates) || updates.length === 0) {
      return failResponse('更新数据不能为空');
    }
    
    const trx = await this.knex.transaction();
    try {
      for (const { query, params } of updates) {
        const result = await trx(this.model).where(query).update(params);
        if (result === 0) {
          await trx.rollback();
          return failResponse(`更新失败: ${JSON.stringify(query)}`);
        }
      }
      await trx.commit();
      return successResponse(true);
    } catch (err) {
      await trx.rollback();
      return errorResponse(err);
    }
  },

  /**
   * 分页查询
   * @param {Object} options - 查询选项
   * @param {number} options.current - 当前页码
   * @param {number} options.pageSize - 每页大小
   * @param {Object} options.query - 查询条件
   * @param {Array} options.field - 返回字段
   * @returns {Promise} 查询结果
   */
  async query({ current = 1, pageSize = 10, query = {}, field = [] }) {
    try {
      const offset = (current - 1) * pageSize;
      let countQuery = this.knex(this.model).count("* as total");
      let dataQuery = this.knex(this.model);
      
      if (Object.keys(query).length > 0) {
        Object.entries(query).forEach(([key, value]) => {
          countQuery = countQuery.where(key, value);
          dataQuery = dataQuery.where(key, value);
        });
      }

      if (field.length > 0) dataQuery = dataQuery.select(field);

      const [totalResult, list] = await Promise.all([
        countQuery.first(),
        dataQuery.offset(offset).limit(pageSize)
      ]);

      const total = totalResult?.total || 0;
      return successResponse({ list, total, current, pageSize });
    } catch (err) {
      return errorResponse(err);
    }
  },

  /**
   * 计数查询
   * @param {Array} query - 查询条件数组
   * @returns {Promise} 查询结果
   */
  async count(query = []) {
    try {
      let dataQuery = this.knex(this.model);
      if (query.length > 0) {
        query.forEach(condition => dataQuery = dataQuery.where(condition));
      }
      const result = await dataQuery.count("* as total").first();
      return successResponse(Number(result?.total) || 0);
    } catch (err) {
      return errorResponse(err);
    }
  }
};

// ====================== 工厂函数 (轻量创建实例) ======================
/**
 * 创建数据库服务实例
 * @param {Object} knex - Knex实例
 * @param {string} model - 表名/模型名
 * @returns {Object} 数据库服务实例
 */
export default function Service(knex, model) {
  if (!knex || !model) {
    throw new Error('createDBService: knex instance and model name are required');
  }
  
  // 创建继承数据库方法的轻量对象
  const service = Object.create(databaseMethods);
  
  // 设置实例专属状态（不可写）
  Object.defineProperties(service, {
    knex: {
      value: knex,
      writable: false,
      enumerable: true
    },
    model: {
      value: model,
      writable: false,
      enumerable: true
    }
  });
  
  return service;
}