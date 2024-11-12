import { isEmailValidate } from "./isEmailValidate.js";
import AppError from "./AppError.js";

function validateUserInputs({ username, email, password }) {
  if (!username || username.length < 3)
    throw new AppError("Username is too short.");
  if (!isEmailValidate(email))
    throw new AppError("This is not a valid email. Try again!");
  if (!password || password.length < 8)
    throw new AppError("Password must be at least 8 characters long.");
}

export { validateUserInputs };
