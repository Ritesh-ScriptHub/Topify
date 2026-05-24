const nodemailer = require("nodemailer");

function normalizeUrl(url) {
  return url ? url.trim().replace(/\/+$/, "") : "";
}

function getFrontendUrl() {
  const configuredUrl = process.env.FRONTEND_URL;

  if (configuredUrl) {
    return normalizeUrl(configuredUrl);
  }

  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map(normalizeUrl).filter(Boolean)
    : [];

  return allowedOrigins[0] || "http://localhost:5173";
}


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

async function sendVerificationEmail(to, token) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Email credentials are missing. Set EMAIL_USER and EMAIL_PASS.");
  }

  const verifyUrl = `${getFrontendUrl()}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"Topify" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Verify your Topify account",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body style="margin:0;padding:0;background:#0d0905;font-family:'Helvetica Neue',Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
          <tr>
            <td align="center">
              <table width="100%" style="max-width:520px;background:#fff;border-radius:20px;overflow:hidden;">
                <tr>
                  <td style="background:linear-gradient(135deg,#EF9F27,#BA7517);padding:36px 40px;text-align:center;">
                    <div style="display:inline-flex;align-items:center;gap:10px;">
                      <div style="width:36px;height:36px;background:rgba(255,255,255,0.25);border-radius:9px;display:inline-flex;align-items:center;justify-content:center;">
                        <span style="font-size:18px;font-weight:800;color:#fff;font-family:Georgia,serif;"> 
                          <img src="https://lh3.googleusercontent.com/d/1JKx24SHoTGXeSdZsjpWbeoNk8Y6yk4mb" alt="logo" />
                        </span>
                      </div>
                      <span style="font-size:22px;font-weight:700;color:#fff;letter-spacing:-0.5px;">Topify</span>
                    </div>
                    <p style="color:rgba(255,255,255,0.85);margin:12px 0 0;font-size:14px;">
                      Your music, your world
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:36px 40px;">
                    <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#1a1005;">
                      Verify your email address
                    </h2>
                    <p style="margin:0 0 24px;font-size:14px;color:#8a7860;line-height:1.6;">
                      Thanks for signing up! Click the button below to verify your email address and activate your account. This link expires in <strong>24 hours</strong>.
                    </p>
                    <a href="${verifyUrl}"
                       style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#EF9F27,#BA7517);color:#fff;text-decoration:none;border-radius:10px;font-weight:600;font-size:15px;letter-spacing:0.3px;">
                      Verify My Account
                    </a>
                    <p style="margin:24px 0 0;font-size:12px;color:#b8a48a;line-height:1.6;">
                      If the button doesn't work, copy and paste this link into your browser:
                    </p>
                    <p style="margin:6px 0 0;font-size:11px;color:#b8a48a;word-break:break-all;">
                      ${verifyUrl}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px 40px;border-top:1px solid #f0e8d8;text-align:center;">
                    <p style="margin:0;font-size:11px;color:#c4b49a;">
                      If you didn't create a Topify account, you can safely ignore this email.
                    </p>
                    <p style="margin:8px 0 0;font-size:11px;color:#c4b49a;">
                      &copy; ${new Date().getFullYear()} Topify
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  });
}

module.exports = { sendVerificationEmail }