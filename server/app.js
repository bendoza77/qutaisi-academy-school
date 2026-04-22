require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { Resend } = require("resend");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

const logoBase64 = fs.readFileSync(
  path.join(__dirname, "../client/public/logo.png")
).toString("base64");

// ─── Security ────────────────────────────────────────────────────────────────

// Sets secure HTTP headers (XSS protection, no-sniff, HSTS, etc.)
app.use(helmet());

// CORS — only allow the client origin
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));

app.use(express.json({ limit: "10kb" }));

// Strip $ and . from request body/query/params to block NoSQL injection
app.use(mongoSanitize());

// Contact form: max 5 requests per 15 minutes per IP
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again in 15 minutes." },
});

// Test-email route: max 3 requests per hour per IP (dev tool, low limit)
const testLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many test requests." },
});

// ─── EMAIL 1: Admin notification — original card design ───────────────────
function buildAdminEmail({ from_name, from_phone, from_email, course, message, date }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>New Contact Form Submission</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- HEADER -->
        <tr><td style="background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 60%,#1d4ed8 100%);border-radius:16px 16px 0 0;padding:40px 40px 32px;text-align:center;">
          <div style="display:inline-block;width:56px;height:56px;background:rgba(255,255,255,0.12);border-radius:14px;line-height:56px;font-size:26px;margin-bottom:16px;">🎓</div>
          <h1 style="margin:0 0 6px;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.3px;">Kutaisi English Academy</h1>
          <p style="margin:0;color:#93c5fd;font-size:13px;letter-spacing:0.5px;text-transform:uppercase;font-weight:500;">New Contact Form Submission</p>
        </td></tr>

        <!-- ALERT BANNER -->
        <tr><td style="background:#1d4ed8;padding:12px 40px;text-align:center;">
          <p style="margin:0;color:#bfdbfe;font-size:12.5px;">📬 &nbsp;You have received a new inquiry — please respond within 24 hours.</p>
        </td></tr>

        <!-- BODY -->
        <tr><td style="background:#ffffff;padding:36px 40px 28px;">
          <p style="margin:0 0 24px;color:#475569;font-size:14px;line-height:1.6;">
            Hello, a visitor has just submitted the contact form on your website. Here are their details:
          </p>

          <!-- Name -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
            <tr><td style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px 20px;">
              <p style="margin:0 0 4px;color:#94a3b8;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.6px;">Full Name</p>
              <p style="margin:0;color:#0f172a;font-size:15px;font-weight:600;">${from_name}</p>
            </td></tr>
          </table>

          <!-- Phone -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
            <tr><td style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px 20px;">
              <p style="margin:0 0 4px;color:#94a3b8;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.6px;">Phone Number</p>
              <p style="margin:0;color:#0f172a;font-size:15px;font-weight:600;">📞 &nbsp;${from_phone}</p>
            </td></tr>
          </table>

          <!-- Email -->
          ${from_email ? `
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
            <tr><td style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px 20px;">
              <p style="margin:0 0 4px;color:#94a3b8;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.6px;">Email Address</p>
              <p style="margin:0;color:#1d4ed8;font-size:15px;font-weight:600;">✉️ &nbsp;${from_email}</p>
            </td></tr>
          </table>` : ""}

          <!-- Course -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
            <tr><td style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:16px 20px;">
              <p style="margin:0 0 4px;color:#60a5fa;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.6px;">Interested Course</p>
              <p style="margin:0;color:#1e3a5f;font-size:15px;font-weight:700;">🎯 &nbsp;${course}</p>
            </td></tr>
          </table>

          <!-- Message -->
          ${message && message !== "No message" ? `
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
            <tr><td style="background:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid #1d4ed8;border-radius:0 12px 12px 0;padding:16px 20px;">
              <p style="margin:0 0 8px;color:#94a3b8;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.6px;">Message</p>
              <p style="margin:0;color:#334155;font-size:14px;line-height:1.7;">${message}</p>
            </td></tr>
          </table>` : `<div style="height:14px;"></div>`}

          <!-- CTA -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
            <tr><td align="center">
              <a href="tel:${from_phone}"
                style="display:inline-block;background:linear-gradient(135deg,#1e3a5f,#1d4ed8);color:#ffffff;font-size:14px;font-weight:600;padding:14px 36px;border-radius:10px;text-decoration:none;letter-spacing:0.2px;">
                📞 &nbsp;Call Back Now
              </a>
            </td></tr>
          </table>
        </td></tr>

        <!-- DIVIDER -->
        <tr><td style="background:#ffffff;padding:0 40px;">
          <div style="border-top:1px solid #e2e8f0;"></div>
        </td></tr>

        <!-- META -->
        <tr><td style="background:#ffffff;padding:20px 40px 28px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td><p style="margin:0;color:#94a3b8;font-size:11.5px;">🕐 &nbsp;Submitted on: <strong style="color:#64748b;">${date}</strong></p></td>
              <td align="right"><p style="margin:0;color:#94a3b8;font-size:11.5px;">🌐 &nbsp;Source: <strong style="color:#64748b;">Website Contact Form</strong></p></td>
            </tr>
          </table>
        </td></tr>

        <!-- FOOTER -->
        <tr><td style="background:#0f172a;border-radius:0 0 16px 16px;padding:28px 40px;text-align:center;">
          <p style="margin:0 0 8px;color:#e2e8f0;font-size:14px;font-weight:600;">Kutaisi English Academy</p>
          <p style="margin:0 0 12px;color:#64748b;font-size:12px;line-height:1.6;">Rustaveli Avenue, Kutaisi, Georgia</p>
          <p style="margin:0;color:#334155;font-size:11px;">© 2025 Kutaisi English Academy · All rights reserved</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── EMAIL 2: Auto-reply to user ──────────────────────────────────────────
function buildAutoReplyEmail({ from_name, course }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background:#f0f4ff;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4ff;padding:40px 16px;">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

      <!-- HEADER -->
      <tr><td style="background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 55%,#1d4ed8 100%);border-radius:20px 20px 0 0;padding:36px 40px 28px;text-align:center;">
        <img src="cid:logo" width="72" height="72"
          style="display:inline-block;border-radius:50%;border:3px solid rgba(255,255,255,0.2);object-fit:cover;background:#fff;margin-bottom:16px;"
          alt="Kutaisi English Academy"/>
        <h1 style="margin:0 0 5px;color:#fff;font-size:19px;font-weight:700;">Kutaisi English Academy</h1>
        <p style="margin:0;color:#93c5fd;font-size:11.5px;text-transform:uppercase;letter-spacing:1px;font-weight:500;">Excellence in English Education</p>
      </td></tr>

      <!-- Confirmation bar -->
      <tr><td style="background:#1d4ed8;padding:14px 40px;text-align:center;">
        <p style="margin:0;color:#fff;font-size:13.5px;font-weight:600;">✅ &nbsp;Your inquiry has been successfully received!</p>
      </td></tr>

      <!-- BODY -->
      <tr><td style="background:#fff;padding:36px 40px 28px;">
        <h2 style="margin:0 0 10px;color:#0f172a;font-size:19px;font-weight:700;">Hello, ${from_name}! 👋</h2>
        <p style="margin:0 0 22px;color:#475569;font-size:14px;line-height:1.75;">
          Thank you for reaching out. We've received your inquiry and our team will contact you
          <strong style="color:#1d4ed8;">within 24 hours</strong> to discuss your learning journey.
        </p>

        <!-- Course card -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:26px;">
          <tr><td style="background:linear-gradient(135deg,#eff6ff,#dbeafe);border:1px solid #bfdbfe;border-radius:14px;padding:18px 22px;">
            <p style="margin:0 0 5px;color:#1e40af;font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;">Your selected course</p>
            <p style="margin:0;color:#1e3a5f;font-size:16px;font-weight:700;">🎯 &nbsp;${course}</p>
          </td></tr>
        </table>

        <!-- Steps -->
        <p style="margin:0 0 14px;color:#0f172a;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;">What happens next?</p>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:11px;">
          <tr>
            <td width="36" style="vertical-align:top;">
              <div style="width:26px;height:26px;background:#2563eb;border-radius:50%;text-align:center;line-height:26px;color:#fff;font-size:11px;font-weight:700;">1</div>
            </td>
            <td style="vertical-align:top;padding-left:10px;">
              <p style="margin:0 0 2px;color:#0f172a;font-size:13px;font-weight:600;">Our team reviews your inquiry</p>
              <p style="margin:0;color:#64748b;font-size:12.5px;line-height:1.5;">We match you with the right program and schedule for your goals.</p>
            </td>
          </tr>
        </table>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:11px;">
          <tr>
            <td width="36" style="vertical-align:top;">
              <div style="width:26px;height:26px;background:#2563eb;border-radius:50%;text-align:center;line-height:26px;color:#fff;font-size:11px;font-weight:700;">2</div>
            </td>
            <td style="vertical-align:top;padding-left:10px;">
              <p style="margin:0 0 2px;color:#0f172a;font-size:13px;font-weight:600;">We contact you within 24 hours</p>
              <p style="margin:0;color:#64748b;font-size:12.5px;line-height:1.5;">A team member will call or email you to answer any questions.</p>
            </td>
          </tr>
        </table>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
          <tr>
            <td width="36" style="vertical-align:top;">
              <div style="width:26px;height:26px;background:#2563eb;border-radius:50%;text-align:center;line-height:26px;color:#fff;font-size:11px;font-weight:700;">3</div>
            </td>
            <td style="vertical-align:top;padding-left:10px;">
              <p style="margin:0 0 2px;color:#0f172a;font-size:13px;font-weight:600;">Begin your English journey</p>
              <p style="margin:0;color:#64748b;font-size:12.5px;line-height:1.5;">Once enrolled, you get your schedule, materials, and a dedicated teacher.</p>
            </td>
          </tr>
        </table>

        <!-- CTA -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:26px;">
          <tr><td align="center">
            <a href="https://kutaisi-english.ge"
              style="display:inline-block;background:linear-gradient(135deg,#1e3a5f,#2563eb);color:#fff;font-size:13.5px;font-weight:600;padding:13px 38px;border-radius:12px;text-decoration:none;">
              🌐 &nbsp;Visit Our Website
            </a>
          </td></tr>
        </table>

        <div style="border-top:1px solid #e2e8f0;margin-bottom:22px;"></div>

        <!-- Contact row -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding:0 6px;" width="33%">
              <p style="margin:0 0 3px;font-size:17px;">📞</p>
              <p style="margin:0;color:#64748b;font-size:11px;">Phone</p>
              <p style="margin:2px 0 0;color:#0f172a;font-size:11.5px;font-weight:600;">+995 XXX XXX</p>
            </td>
            <td align="center" style="padding:0 6px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;" width="33%">
              <p style="margin:0 0 3px;font-size:17px;">✉️</p>
              <p style="margin:0;color:#64748b;font-size:11px;">Email</p>
              <p style="margin:2px 0 0;color:#2563eb;font-size:11.5px;font-weight:600;">info@kea.ge</p>
            </td>
            <td align="center" style="padding:0 6px;" width="33%">
              <p style="margin:0 0 3px;font-size:17px;">📍</p>
              <p style="margin:0;color:#64748b;font-size:11px;">Address</p>
              <p style="margin:2px 0 0;color:#0f172a;font-size:11.5px;font-weight:600;">Kutaisi, Georgia</p>
            </td>
          </tr>
        </table>
      </td></tr>

      <!-- FOOTER -->
      <tr><td style="background:#0f172a;border-radius:0 0 20px 20px;padding:22px 40px;text-align:center;">
        <img src="cid:logo" width="34" height="34"
          style="display:inline-block;border-radius:50%;border:2px solid rgba(255,255,255,0.15);margin-bottom:10px;object-fit:cover;background:#fff;"
          alt="KEA"/>
        <p style="margin:0 0 5px;color:#e2e8f0;font-size:13px;font-weight:600;">Kutaisi English Academy</p>
        <p style="margin:0 0 10px;color:#475569;font-size:11px;">Rustaveli Avenue, Kutaisi, Georgia</p>
        <p style="margin:0;color:#1e293b;font-size:10.5px;line-height:1.6;">
          You received this because you submitted a contact form on our website.<br/>
          © 2025 Kutaisi English Academy · All rights reserved
        </p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

// ─── ROUTE ────────────────────────────────────────────────────────────────
app.post("/api/contact", contactLimiter, async (req, res) => {
  const { from_name, from_phone, from_email, course, message } = req.body;

  if (!from_name || !from_phone || !course) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const date = new Date().toLocaleString("en-GB", {
    day: "2-digit", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  const logoAttachment = {
    filename: "logo.png",
    content: logoBase64,
    content_id: "logo",
  };

  const FROM = `Kutaisi English Academy <${process.env.SENDER_EMAIL}>`;
  const validEmail = from_email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(from_email.trim());

  // Admin notification → CONTACT_EMAIL in .env
  const adminResult = await resend.emails.send({
    from: FROM,
    to: [process.env.CONTACT_EMAIL],
    subject: `📩 New inquiry from ${from_name} — ${course}`,
    html: buildAdminEmail({
      from_name,
      from_phone,
      from_email: validEmail ? from_email.trim() : null,
      course,
      message: message || "No message",
      date,
    }),
    attachments: [logoAttachment],
  });

  if (adminResult.error) {
    console.error("[Admin email error]", JSON.stringify(adminResult.error));
    return res.status(500).json({ error: adminResult.error.message });
  }
  console.log("[Admin email sent] id:", adminResult.data?.id);

  // Auto-reply → user's form email
  if (validEmail) {
    const replyResult = await resend.emails.send({
      from: FROM,
      to: [from_email.trim()],
      subject: `✅ We received your inquiry, ${from_name}!`,
      html: buildAutoReplyEmail({ from_name, course }),
      attachments: [logoAttachment],
    });
    if (replyResult.error) {
      console.error("[Auto-reply error]", JSON.stringify(replyResult.error));
    } else {
      console.log(`[Auto-reply sent] → ${from_email.trim()} id:`, replyResult.data?.id);
    }
  }

  res.json({ success: true });
});

// Quick test route — visit http://localhost:3000/test-email in browser
app.get("/test-email", testLimiter, async (req, res) => {
  const result = await resend.emails.send({
    from: `Kutaisi English Academy <${process.env.SENDER_EMAIL}>`,
    to: [process.env.CONTACT_EMAIL],
    subject: "✅ Test email from server",
    html: "<p>If you see this, your email setup is working correctly.</p>",
  });
  console.log("[Test email result]", JSON.stringify(result));
  res.json(result);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
