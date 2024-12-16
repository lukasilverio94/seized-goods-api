import redisClient from "../config/redisClient.js";

const OTP_EXPIRATION = 600; //10min in seconds

export const storeOtp = async (email, otp) => {
  const otpData = JSON.stringify({
    otp,
    expiresAt: Date.now() + OTP_EXPIRATION * 1000,
  });

  await redisClient.set(`otp:${email}`, otpData, { EX: OTP_EXPIRATION });
};

// Retrieve OTP from Redis
export const getOtp = async (email) => {
  const otpData = await redisClient.get(`otp:${email}`);
  return otpData ? JSON.parse(otpData) : null;
};

// Delete OTP from Redis
export const deleteOtp = async (email) => {
  await redisClient.del(`otp:${email}`);
};
