export function parseJsonFields(obj) {
    const result = {};
    for (const key in obj) {
      if (!obj.hasOwnProperty(key)) continue;
      const value = obj[key];
      // 如果是字符串，并且看起来像 JSON（以 { 或 [ 开头）
      if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
        try {
          result[key] = JSON.parse(value);
        } catch (e) {
          console.warn(`JSON parse failed for field: ${key}`, e);
          result[key] = value; // 保留原始值
        }
      } else {
        result[key] = value;
      }
    }
  
    return result;
  }