import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export const sendOTPEmail = async (to, otp) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject: "Your verification code",
    text: `Your OTP code is: ${otp}. It is valid for 10 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP email sent successfully");
  } catch (error) {
    console.error("Error sending OTP email");
    throw new error("Error sending OTP Email");
  }
};

export const sendResetPasswordEmail = async (to, resetLink) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject: "Reset Your Password",
    text: `You requested to reset your password. Click the link below to reset it:
${resetLink}

If you did not request this, please ignore this email.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Reset password link sent successfully");
  } catch (error) {
    console.error("Error sending reset password email");
    throw new Error("Error sending reset password email");
  }
};
