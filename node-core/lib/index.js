const unihelper = require('../build/Release/unihelper-core.node');
console.log(unihelper.execShell(
  'node -v'
) === 'v22.3.0');

module.exports = unihelper;
exports = unihelper;
