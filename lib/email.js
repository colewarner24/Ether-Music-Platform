import nodemailer from "nodemailer";

let transporter;

function initTransporter() {
  if (transporter) return transporter;

  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: process.env.SMTP_PORT || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    console.warn("No email service configured. Using console fallback.");
    transporter = {
      sendMail: async (options) => {
        console.log("EMAIL WOULD BE SENT:", options);
        return Promise.resolve();
      },
    };
  }

  return transporter;
}

export async function sendVerificationEmail(email, token, baseUrl) {
  const transporter = initTransporter();
  const verificationUrl = `${baseUrl}/auth/verify-email?token=${token}`;

  return transporter.sendMail({
    from: process.env.EMAIL_FROM || "noreply@ethermusic.app",
    to: email,
    subject: "Verify your email address",
    html: `
      <h2>Welcome to Ether Music!</h2>
      <p>Please verify your email address to complete your registration.</p>
      <p>
        <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background: #111827; color: white; text-decoration: none; border-radius: 4px;">
          Verify Email
        </a>
      </p>
      <p>Or copy this link: ${verificationUrl}</p>
      <p>This link expires in 24 hours.</p>
    `,
  });
}

export async function sendPasswordResetEmail(email, token, baseUrl) {
  const transporter = initTransporter();
  const resetUrl = `${baseUrl}/auth/reset-password-form?token=${token}`;

  return transporter.sendMail({
    from: process.env.EMAIL_FROM || "noreply@ethermusic.app",
    to: email,
    subject: "Reset your password",
    html: `
      <h2>Password Reset Request</h2>
      <p>You requested to reset your password. Click the link below to set a new password.</p>
      <p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background: #111827; color: white; text-decoration: none; border-radius: 4px;">
          Reset Password
        </a>
      </p>
      <p>Or copy this link: ${resetUrl}</p>
      <p>This link expires in 1 hour. If you didn't request this, please ignore this email.</p>
    `,
  });
}
