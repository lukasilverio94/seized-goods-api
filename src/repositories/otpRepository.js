import { storeOtp, getOtp, deleteOtp } from "../utils/otpStore.js";

export const storeOtpCode = async (email, otp) => {
  await storeOtp(email, otp);
};

export const getStoredOtp = async (email) => {
  return getOtp(email);
};

export const deleteStoredOtp = async (email) => {
  await deleteOtp(email);
};
