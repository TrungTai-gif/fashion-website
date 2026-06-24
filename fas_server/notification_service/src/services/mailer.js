import nodemailer from "nodemailer";

function getBool(val) {
  if (typeof val === "boolean") return val;
  if (typeof val === "string") return val === "true" || val === "1";
  return false;
}

export function createTransport() {
  const host = process.env.EMAIL_HOST;
  const port = parseInt(process.env.EMAIL_PORT || "587", 10);
  const user = process.env.EMAIL_USER || process.env.MAIL_USERNAME; // fallback for older key
  const pass = process.env.EMAIL_PASSWORD;

  if (!host || !port || !user || !pass) {
    throw new Error(
      "Missing email SMTP configuration (EMAIL_HOST/EMAIL_PORT/EMAIL_USER/EMAIL_PASSWORD)"
    );
  }

  const secure = port === 465 || getBool(process.env.EMAIL_SECURE);

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure, // true for 465, false for other ports like 587
    auth: { user, pass },
  });

  return transporter;
}

// Create and export the email transporter instance
export const emailTransporter = createTransport();
