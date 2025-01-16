import { transporter } from "../config/nodemailer.js";

export const contactUsByEmail = async (name, email, subject, message) => {
  const mailOptions = {
    from: `"${name}" <${process.env.GMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    replyTo: email,
    subject,
    html: `
      <h2>New Contact Message</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong><br>${message}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(error);
    throw new Error("Error sending contact message. Try again later");
  }
};

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
    console.error(error);
    throw new Error("Error sending reset password email");
  }
};
