export const validator = (schemas) => (req, res, next) => {
  // 分别验证 headers/params/query/body
  const sections = {
    headers: schemas.headers,
    params: schemas.params,
    query: schemas.query,
    body: schemas.body
  };

  for (const [key, schema] of Object.entries(sections)) {
    if (!schema) continue;
    
    const result = schema.safeParse(req[key]);
    if (!result.success) {
      // 返回首个错误信息
      const firstError = result.error.errors[0];
      return res.status(400).json({ error: firstError.message });
    }
    // 将验证后的数据挂载到 req 对象
    req[key] = result.data;
  }
  next();
};
