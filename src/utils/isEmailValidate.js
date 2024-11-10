const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;

const isEmailValidate = (email) => {
  return emailRegex.test(email);
};

export { isEmailValidate };
