import { resendOtpCode, verifyOtpUser } from "../services/otpService.js";

export const handleVerifyOtpUser = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    await verifyOtpUser(email, otp);
    res.status(200).json({ message: "Verification successful!" });
  } catch (error) {
    next(error);
  }
};

export const handleResendOtpCode = async (req, res, next) => {
  try {
    const { email } = req.body;
    const message = await resendOtpCode(email);
    res.status(200).json({ message });
  } catch (error) {
    next(error);
  }
};
