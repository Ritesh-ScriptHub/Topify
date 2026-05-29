const { Resend } = require("resend")

const resend = new Resend(process.env.RESEND_API_KEY)

function getFrontendUrl() {
  const url = process.env.FRONTEND_URL ||
    (process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",")[0].trim()
      : null)
  return url ? url.trim().replace(/\/+$/, "") : "http://localhost:5173"
}

async function sendVerificationEmail(to, token) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not set.")
  }

  const verifyUrl = `${getFrontendUrl()}/verify-email?token=${token}`

  const { error } = await resend.emails.send({
    from: "Topify <noreply@mail.riteshxtech.me>",
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
                        <img 
                            style="width:36px;height:36px"
                            src="https://lh3.googleusercontent.com/d/1JKx24SHoTGXeSdZsjpWbeoNk8Y6yk4mb" alt="logo" 
                        />
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
  })

  if (error) {
    throw new Error(`Resend error: ${error.message}`)
  }
}

module.exports = { sendVerificationEmail }