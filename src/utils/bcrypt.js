const bcrypt = require("bcrypt");

exports.hashPassword = async text => {
  const salt = await bcrypt.genSalt(12);
  var password = await bcrypt.hash(text, salt);
  return password;
};
exports.verifyPass = async (plainText, hashText) => {
  const isEquals = await bcrypt.compare(plainText, hashText);
  return isEquals;
};
