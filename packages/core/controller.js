export default class Controller {
  constructor() {}
  success(data) {
    return {
      success: true,
      msg: "操作成功",
      code: 200,
      data,
    };
  }

  fail(data, code = 201) {
    return {
      success: false,
      msg: "操作失败",
      code,
      data,
    };
  }

  err(data = {}, code = 500) {
    return {
      success: false,
      msg: "系统异常",
      code,
      data,
    };
  }
}
