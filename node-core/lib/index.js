const unihelper = require('../build/Release/unihelper-core.node');
console.log(unihelper.execShell(
  'echo "Hello, World!"'
));

module.exports = unihelper;
exports = unihelper;
