// utils/emailTemplate.js
export const resetPasswordTemplate = (resetLink) => {
  return {
    subject: "Password Reset Request",
    html: `
      <div style="font-family: Arial, sans-serif; line-height:1.6">
        <h2>Password Reset</h2>
        <p>You requested to reset your password. Click the link below to reset:</p>
        <a href="${resetLink}" 
           style="display:inline-block;padding:10px 20px;background:#007bff;color:#fff;text-decoration:none;border-radius:5px;">
          Reset Password
        </a>
        <p>If you did not request this, please ignore this email.</p>
        <br/>
        <small>This link will expire in 15 minutes.</small>
      </div>
    `,
  };
};

export const otpTemplate = (otpCode) => {
  return {
    subject: "Your OTP Code",
    html: `
      <div style="font-family: Arial, sans-serif; line-height:1.6">
        <h2>OTP Verification</h2>
        <p>Your OTP code is:</p>
        <h3 style="letter-spacing: 3px;">${otpCode}</h3>
        <p>This code will expire in 5 minutes.</p>
      </div>
    `,
  };
};

export const accountCreatedTemplate = (email, password) => {
  return {
    subject: "Your New Account Details",
    html: `
      <div style="font-family: Arial, sans-serif; line-height:1.6">
        <h2>Welcome to Our Shop!</h2>
        <p>We have created an account for you during checkout.</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Password:</strong> ${password}</p>
        <p>Please log in and change your password after your first login.</p>
        <br/>
        <a href="${process.env.FRONTEND_URL || "http://localhost:3000/login"}" 
           style="display:inline-block;padding:10px 20px;background:#28a745;color:#fff;text-decoration:none;border-radius:5px;">
          Login Now
        </a>
        <br/><br/>
        <small>For your security, we recommend updating your password immediately.</small>
      </div>
    `,
  };
};
