
/**
 * @description 实例化一个类，并将该类的所有方法绑定到一个新的对象上。
 * @param {Function} className - 需要实例化的类。
 *@returns {Object} 包含绑定方法的对象。
 */
 export const bindClass = function(className) {
  let obj = {};
  const cls = new className();
  Object.getOwnPropertyNames(cls.constructor.prototype).forEach(
    (methodName) => {
      if (
        methodName !== "constructor" &&
        typeof cls[methodName] === "function"
      ) {
        obj[methodName] = cls[methodName].bind(cls);
      }
    }
  );
  return obj;
}