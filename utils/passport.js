/*
 * @Author: wangshi 
 * @Email: coderwangshi@126.com 
 * @Date: 2019-10-12 16:03:32 
 * @Description: password bcrypt & validate
 */

// https://www.npmjs.com/package/bcrypt md5加密解密
const bcrypt = require('bcrypt');

const encrypt = async (password, saltTimes) => {
  const hash = await bcrypt.hash(password, saltTimes);
  return hash; 
};

// 验证用户加密的密码正确性（非明文）
const validate = async (password, hash) => {
  const match = await bcrypt.compare(password, hash);
  return match;
};

module.exports = {
  encrypt,
  validate
}
