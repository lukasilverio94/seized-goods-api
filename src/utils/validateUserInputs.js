import { isEmailValidate } from "./isEmailValidate.js";
import AppError from "./AppError.js";

function validateUserInputs({ firstName, lastName, email, password }) {
  if (!firstName || firstName.length < 1)
    throw new AppError("First name is too short.");
  if (!lastName || lastName.length < 1)
    throw new AppError("Last name is too short");
  if (!isEmailValidate(email))
    throw new AppError("This is not a valid email. Try again!");
  if (!password || password.length < 8)
    throw new AppError("Password must be at least 8 characters long.");
}

export { validateUserInputs };
