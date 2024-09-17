const unihelper = require('../build/Release/unihelper-core.node');
console.log(unihelper);

// 获取系统级别的 PATH 环境变量
console.log(unihelper.setPathEnvVar("C:\\new\\path", true, "system"));

// 获取用户级别的 PATH 环境变量
// console.log(unihelper.getPathEnvVar("user"));

// module.exports = core;
// export default core;
