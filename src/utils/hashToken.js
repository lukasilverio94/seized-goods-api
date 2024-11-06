import bcrypt from "bcrypt";

const hashToken = async (token) => {
  const saltRounds = 10;
  const hashedToken = await bcrypt.hash(token, saltRounds);
  return hashedToken;
};

export default hashToken;
