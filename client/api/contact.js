// Vercel serverless function — replaces the Express /api/contact endpoint

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

        <tr><td style="background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 60%,#1d4ed8 100%);border-radius:16px 16px 0 0;padding:40px 40px 32px;text-align:center;">
          <div style="display:inline-block;width:56px;height:56px;background:rgba(255,255,255,0.12);border-radius:14px;line-height:56px;font-size:26px;margin-bottom:16px;">🎓</div>
          <h1 style="margin:0 0 6px;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.3px;">Kutaisi English Academy</h1>
          <p style="margin:0;color:#93c5fd;font-size:13px;letter-spacing:0.5px;text-transform:uppercase;font-weight:500;">New Contact Form Submission</p>
        </td></tr>

        <tr><td style="background:#1d4ed8;padding:12px 40px;text-align:center;">
          <p style="margin:0;color:#bfdbfe;font-size:12.5px;">📬 &nbsp;You have received a new inquiry — please respond within 24 hours.</p>
        </td></tr>

        <tr><td style="background:#ffffff;padding:36px 40px 28px;">
          <p style="margin:0 0 24px;color:#475569;font-size:14px;line-height:1.6;">
            Hello, a visitor has just submitted the contact form on your website. Here are their details:
          </p>

          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
            <tr><td style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px 20px;">
              <p style="margin:0 0 4px;color:#94a3b8;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.6px;">Full Name</p>
              <p style="margin:0;color:#0f172a;font-size:15px;font-weight:600;">${from_name}</p>
            </td></tr>
          </table>

          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
            <tr><td style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px 20px;">
              <p style="margin:0 0 4px;color:#94a3b8;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.6px;">Phone Number</p>
              <p style="margin:0;color:#0f172a;font-size:15px;font-weight:600;">📞 &nbsp;${from_phone}</p>
            </td></tr>
          </table>

          ${from_email ? `
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
            <tr><td style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px 20px;">
              <p style="margin:0 0 4px;color:#94a3b8;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.6px;">Email Address</p>
              <p style="margin:0;color:#1d4ed8;font-size:15px;font-weight:600;">✉️ &nbsp;${from_email}</p>
            </td></tr>
          </table>` : ''}

          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
            <tr><td style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:16px 20px;">
              <p style="margin:0 0 4px;color:#60a5fa;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.6px;">Interested Course</p>
              <p style="margin:0;color:#1e3a5f;font-size:15px;font-weight:700;">🎯 &nbsp;${course}</p>
            </td></tr>
          </table>

          ${message && message !== 'No message' ? `
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
            <tr><td style="background:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid #1d4ed8;border-radius:0 12px 12px 0;padding:16px 20px;">
              <p style="margin:0 0 8px;color:#94a3b8;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.6px;">Message</p>
              <p style="margin:0;color:#334155;font-size:14px;line-height:1.7;">${message}</p>
            </td></tr>
          </table>` : '<div style="height:14px;"></div>'}

          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
            <tr><td align="center">
              <a href="tel:${from_phone}"
                style="display:inline-block;background:linear-gradient(135deg,#1e3a5f,#1d4ed8);color:#ffffff;font-size:14px;font-weight:600;padding:14px 36px;border-radius:10px;text-decoration:none;letter-spacing:0.2px;">
                📞 &nbsp;Call Back Now
              </a>
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="background:#ffffff;padding:0 40px;">
          <div style="border-top:1px solid #e2e8f0;"></div>
        </td></tr>

        <tr><td style="background:#ffffff;padding:20px 40px 28px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td><p style="margin:0;color:#94a3b8;font-size:11.5px;">🕐 &nbsp;Submitted on: <strong style="color:#64748b;">${date}</strong></p></td>
              <td align="right"><p style="margin:0;color:#94a3b8;font-size:11.5px;">🌐 &nbsp;Source: <strong style="color:#64748b;">Website Contact Form</strong></p></td>
            </tr>
          </table>
        </td></tr>

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

      <tr><td style="background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 55%,#1d4ed8 100%);border-radius:20px 20px 0 0;padding:36px 40px 28px;text-align:center;">
        <div style="display:inline-block;width:72px;height:72px;background:rgba(255,255,255,0.15);border-radius:50%;line-height:72px;font-size:36px;margin-bottom:16px;">🎓</div>
        <h1 style="margin:0 0 5px;color:#fff;font-size:19px;font-weight:700;">Kutaisi English Academy</h1>
        <p style="margin:0;color:#93c5fd;font-size:11.5px;text-transform:uppercase;letter-spacing:1px;font-weight:500;">Excellence in English Education</p>
      </td></tr>

      <tr><td style="background:#1d4ed8;padding:14px 40px;text-align:center;">
        <p style="margin:0;color:#fff;font-size:13.5px;font-weight:600;">✅ &nbsp;Your inquiry has been successfully received!</p>
      </td></tr>

      <tr><td style="background:#fff;padding:36px 40px 28px;">
        <h2 style="margin:0 0 10px;color:#0f172a;font-size:19px;font-weight:700;">Hello, ${from_name}! 👋</h2>
        <p style="margin:0 0 22px;color:#475569;font-size:14px;line-height:1.75;">
          Thank you for reaching out. We've received your inquiry and our team will contact you
          <strong style="color:#1d4ed8;">within 24 hours</strong> to discuss your learning journey.
        </p>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:26px;">
          <tr><td style="background:linear-gradient(135deg,#eff6ff,#dbeafe);border:1px solid #bfdbfe;border-radius:14px;padding:18px 22px;">
            <p style="margin:0 0 5px;color:#1e40af;font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;">Your selected course</p>
            <p style="margin:0;color:#1e3a5f;font-size:16px;font-weight:700;">🎯 &nbsp;${course}</p>
          </td></tr>
        </table>

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

        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:26px;">
          <tr><td align="center">
            <a href="https://kutaisi-english.ge"
              style="display:inline-block;background:linear-gradient(135deg,#1e3a5f,#2563eb);color:#fff;font-size:13.5px;font-weight:600;padding:13px 38px;border-radius:12px;text-decoration:none;">
              🌐 &nbsp;Visit Our Website
            </a>
          </td></tr>
        </table>

        <div style="border-top:1px solid #e2e8f0;margin-bottom:22px;"></div>

        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding:0 6px;" width="33%">
              <p style="margin:0 0 3px;font-size:17px;">📞</p>
              <p style="margin:0;color:#64748b;font-size:11px;">Phone</p>
              <p style="margin:2px 0 0;color:#0f172a;font-size:11.5px;font-weight:600;">+995 599 123 456</p>
            </td>
            <td align="center" style="padding:0 6px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;" width="33%">
              <p style="margin:0 0 3px;font-size:17px;">✉️</p>
              <p style="margin:0;color:#64748b;font-size:11px;">Email</p>
              <p style="margin:2px 0 0;color:#2563eb;font-size:11.5px;font-weight:600;">info@kutaisi-english.ge</p>
            </td>
            <td align="center" style="padding:0 6px;" width="33%">
              <p style="margin:0 0 3px;font-size:17px;">📍</p>
              <p style="margin:0;color:#64748b;font-size:11px;">Address</p>
              <p style="margin:2px 0 0;color:#0f172a;font-size:11.5px;font-weight:600;">Kutaisi, Georgia</p>
            </td>
          </tr>
        </table>
      </td></tr>

      <tr><td style="background:#0f172a;border-radius:0 0 20px 20px;padding:22px 40px;text-align:center;">
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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { from_name, from_phone, from_email, course, message } = req.body || {};

  if (!from_name || !from_phone || !course) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const CONTACT_EMAIL  = process.env.CONTACT_EMAIL;
  const SENDER_EMAIL   = process.env.SENDER_EMAIL;

  if (!RESEND_API_KEY || !CONTACT_EMAIL || !SENDER_EMAIL) {
    console.error('[contact] Missing env vars:', { RESEND_API_KEY: !!RESEND_API_KEY, CONTACT_EMAIL: !!CONTACT_EMAIL, SENDER_EMAIL: !!SENDER_EMAIL });
    return res.status(500).json({ error: 'Server configuration error.' });
  }

  const date = new Date().toLocaleString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  const validEmail = from_email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(from_email.trim());
  const FROM = `Kutaisi English Academy <${SENDER_EMAIL}>`;

  // Admin notification
  const adminRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM,
      to: [CONTACT_EMAIL],
      subject: `📩 New inquiry from ${from_name} — ${course}`,
      html: buildAdminEmail({
        from_name,
        from_phone,
        from_email: validEmail ? from_email.trim() : null,
        course,
        message: message || 'No message',
        date,
      }),
    }),
  });

  if (!adminRes.ok) {
    const err = await adminRes.json().catch(() => ({}));
    console.error('[contact] Admin email error:', err);
    return res.status(500).json({ error: err.message || 'Failed to send notification email.' });
  }

  // Auto-reply to user
  if (validEmail) {
    const replyRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: [from_email.trim()],
        subject: `✅ We received your inquiry, ${from_name}!`,
        html: buildAutoReplyEmail({ from_name, course }),
      }),
    });
    if (!replyRes.ok) {
      console.error('[contact] Auto-reply error:', await replyRes.json().catch(() => ({})));
    }
  }

  return res.status(200).json({ success: true });
}
