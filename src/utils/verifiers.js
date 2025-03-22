function checkEmpty(value) {
    return value.trim().length === 0;
  }
  
  function checkEmail(value) {
    return !value.includes('@') || !value.includes('.');
  }
  
  module.exports = {
    checkEmpty,
    checkEmail
  }