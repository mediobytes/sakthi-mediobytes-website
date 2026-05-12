require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "mediobytes@gmail.com";

// ⚠️ FIX: Use environment variables instead of hardcoding credentials
const SMTP_USER = process.env.SMTP_USER || "mediobytes@gmail.com";
const SMTP_PASS = process.env.SMTP_PASS || "awibolyeunouzbuv";

// ════════════════════════════════════════════════════════════════════════════
// CONFIGURATION CHECK
// ════════════════════════════════════════════════════════════════════════════

console.log("\n╔════════════════════════════════════════════════════════════╗");
console.log("║        MedioBytes Contact API - Configuration Check        ║");
console.log("╚════════════════════════════════════════════════════════════╝\n");

const issues = [];

if (!SMTP_USER) {
  issues.push("❌ SMTP_USER is not set");
} else {
  console.log(`✅ SMTP_USER: ${SMTP_USER}`);
}

if (!SMTP_PASS) {
  issues.push("❌ SMTP_PASS is not set");
} else if (SMTP_PASS.includes(" ")) {
  issues.push("❌ SMTP_PASS contains SPACES — remove them!");
} else if (SMTP_PASS.length !== 16) {
  issues.push(
    `⚠️  SMTP_PASS is ${SMTP_PASS.length} chars (should be 16 for Gmail App Password)`,
  );
} else {
  console.log(`✅ SMTP_PASS: ${SMTP_PASS.substring(0, 4)}••••••••••••`);
}

console.log(`✅ SMTP_HOST: ${process.env.SMTP_HOST || "smtp.gmail.com"}`);
console.log(`✅ SMTP_PORT: ${process.env.SMTP_PORT || 587}`);
console.log(`✅ CONTACT_EMAIL: ${CONTACT_EMAIL}\n`);

if (issues.length > 0) {
  console.log("⚠️  Issues found:\n");
  issues.forEach((issue) => console.log(`   ${issue}`));
  console.log("\n🔧 Fix your .env file and restart the server.\n");
}

// ════════════════════════════════════════════════════════════════════════════
// NODEMAILER SETUP
// ════════════════════════════════════════════════════════════════════════════

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
  connectionTimeout: 5000,
  socketTimeout: 5000,
});

// Test connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ SMTP Connection FAILED:");
    console.log(`   Code: ${error.code}`);
    console.log(`   Message: ${error.message}`);
    console.log("\n   🔧 TROUBLESHOOTING:");

    if (error.code === "EAUTH" || error.message.includes("Invalid login")) {
      console.log("   → Your Gmail App Password is WRONG or EXPIRED");
      console.log("   → Steps to fix:");
      console.log("      1. Go to: https://myaccount.google.com");
      console.log("      2. Enable 2-Step Verification (Security tab)");
      console.log("      3. Generate a NEW App Password");
      console.log("      4. Update SMTP_PASS in your .env file");
      console.log("      5. Restart the server\n");
    } else if (error.message.includes("ECONNREFUSED")) {
      console.log("   → Cannot connect to SMTP server");
      console.log("   → Check your SMTP_HOST and SMTP_PORT\n");
    } else {
      console.log("   → Full error:", error);
    }
  } else {
    console.log("✅ SMTP Connection successful! Ready to send emails.\n");
  }
});

// ════════════════════════════════════════════════════════════════════════════
// EXPRESS SETUP
// ════════════════════════════════════════════════════════════════════════════

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

function getServiceLabel(service) {
  return (
    {
      web: "Web Designing",
      logo: "Logo Designing",
      marketing: "Digital Marketing",
      multiple: "Multiple Services",
      other: "Other / Not Sure",
    }[service] ||
    service ||
    "Not specified"
  );
}

// Serve static files
app.use(express.static(path.join(__dirname, ".")));

// ════════════════════════════════════════════════════════════════════════════
// CONTACT FORM ENDPOINT
// ════════════════════════════════════════════════════════════════════════════

app.post("/api/contact", async (req, res) => {
  console.log(`\n📨 CONTACT FORM REQUEST from ${req.ip}`);
  console.log(`   Body:`, req.body);
  const { name, email, phone, requirement, service } = req.body || {};

  // Honeypot check (spam prevention)
  if (req.body.website) {
    console.log("⚠️  Spam form detected (honeypot)");
    return res
      .status(400)
      .json({ success: false, error: "Invalid submission" });
  }

  // Validation
  if (!name || !email || !requirement) {
    return res.status(400).json({
      success: false,
      error: "Name, email, and requirement are required.",
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({
      success: false,
      error: "Please provide a valid email address.",
    });
  }

  const serviceLabel =
    {
      web: "Web Designing",
      logo: "Logo Designing",
      marketing: "Digital Marketing",
      multiple: "Multiple Services",
      other: "Other / Not Sure",
    }[service] ||
    service ||
    "Not specified";

  const firstName = name.split(" ")[0] || name;

  // ── EMAIL 1: To Admin ──
  const adminMailOptions = {
    from: `"MedioBytes Contact" <${SMTP_USER}>`,
    to: CONTACT_EMAIL,
    replyTo: email,
    subject: `📬 New inquiry from ${name}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 650px; margin: 0 auto; background: #f8fafc;">
        <div style="background: linear-gradient(135deg, #1d4ed8, #06b6d4); padding: 30px; color: #fff; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 700;">New Contact Form Submission</h1>
          <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.9;">MedioBytes Business Portal</p>
        </div>
        <div style="background: #fff; padding: 32px; border: 1px solid #e2e8f0; border-top: none;">
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td style="padding: 12px 0; font-size: 12px; font-weight: 700; color: #475569; width: 150px; text-transform: uppercase; letter-spacing: 0.5px;">👤 Name</td>
              <td style="padding: 12px 0; font-size: 14px; color: #0f172a; font-weight: 500;">${name}</td>
            </tr>
            <tr style="border-top: 1px solid #e2e8f0;">
              <td style="padding: 12px 0; font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px;">✉️ Email</td>
              <td style="padding: 12px 0; font-size: 14px;">
                <a href="mailto:${email}" style="color: #1d4ed8; text-decoration: none; font-weight: 500;">${email}</a>
              </td>
            </tr>
            <tr style="border-top: 1px solid #e2e8f0;">
              <td style="padding: 12px 0; font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px;">📱 Phone</td>
              <td style="padding: 12px 0; font-size: 14px; color: #0f172a; font-weight: 500;">${phone || "Not provided"}</td>
            </tr>
            <tr style="border-top: 1px solid #e2e8f0;">
              <td style="padding: 12px 0; font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px;">🎯 Service</td>
              <td style="padding: 12px 0; font-size: 14px; color: #0f172a; font-weight: 500;">${serviceLabel}</td>
            </tr>
          </table>
          <div style="background: #f8fafc; border-left: 4px solid #1d4ed8; padding: 16px 20px; border-radius: 6px; margin-bottom: 24px;">
            <p style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 12px;">💬 Message</p>
            <p style="font-size: 14px; color: #0f172a; line-height: 1.7; margin: 0; white-space: pre-wrap; word-wrap: break-word;">${requirement}</p>
          </div>
        </div>
        <div style="background: #0f172a; color: #94a3b8; padding: 20px; text-align: center; border-radius: 0 0 12px 12px; font-size: 12px;">
          <p style="margin: 0;">MedioBytes — Digital Agency | Coimbatore, Tamil Nadu</p>
        </div>
      </div>
    `,
  };

  // ── EMAIL 2: Auto-reply to User ──
  const userMailOptions = {
    from: `"MedioBytes" <${SMTP_USER}>`,
    to: email,
    subject: "✅ Your message has been received — MedioBytes",
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 650px; margin: 0 auto; background: #f8fafc;">
        <div style="background: linear-gradient(135deg, #1d4ed8, #06b6d4); padding: 30px; color: #fff; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 700;">Thanks for reaching out, ${firstName}!</h1>
          <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.9;">We received your message.</p>
        </div>
        <div style="background: #fff; padding: 32px; border: 1px solid #e2e8f0; border-top: none;">
          <p style="font-size: 14px; line-height: 1.8; color: #475569; margin: 0 0 20px;">
            Thank you for contacting MedioBytes about <strong style="color: #1d4ed8;">${serviceLabel}</strong>. Our team will review your inquiry and get back to you as soon as possible.
          </p>
          <p style="font-size: 14px; line-height: 1.8; color: #475569; margin: 0;">
            If you need to reach us sooner, write to <a href="mailto:mediobytes@gmail.com" style="color: #1d4ed8; text-decoration: none;">mediobytes@gmail.com</a>.
          </p>
        </div>
        <div style="background: #0f172a; color: #94a3b8; padding: 20px; text-align: center; border-radius: 0 0 12px 12px; font-size: 11px;">
          <p style="margin: 0;">© 2025 MedioBytes. All Rights Reserved.</p>
        </div>
      </div>
    `,
  };

  try {
    console.log(`\n📨 Processing contact request from ${name} (${email})`);

    await transporter.sendMail(adminMailOptions);
    console.log(`   ✅ Admin email sent to ${CONTACT_EMAIL}`);

    await transporter.sendMail(userMailOptions);
    console.log(`   ✅ Auto-reply sent to ${email}\n`);

    return res.json({
      success: true,
      message: `Thank you! Your message has been received. A confirmation email has been sent to ${email}.`,
    });
  } catch (error) {
    console.error(`\n❌ EMAIL SEND FAILED:\n`);
    console.error(`   Error Code: ${error.code}`);
    console.error(`   Error Message: ${error.message}\n`);

    if (
      error.code === "EAUTH" ||
      error.message.includes("Invalid login") ||
      error.message.includes("Username and Password")
    ) {
      console.error(
        "   🔑 FIX: Your SMTP_PASS is wrong or expired. Check your .env file.\n",
      );
    }

    return res.status(500).json({
      success: false,
      error:
        "Unable to send your message. Please try emailing us directly at mediobytes@gmail.com",
      errorCode: error.code,
    });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// CAREER APPLICATION ENDPOINT
// ════════════════════════════════════════════════════════════════════════════

app.post("/api/apply", upload.single("resume"), async (req, res) => {
  const { fullName, email, phone, coverLetter, applyRole } = req.body || {};
  const name = (fullName || "").trim();
  const requirement = (coverLetter || "").trim();
  const service = applyRole;
  const resumeFile = req.file;

  if (!name || !email || !phone || !service || !requirement || !resumeFile) {
    return res.status(400).json({
      success: false,
      error: "All fields are required, including a resume upload.",
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({
      success: false,
      error: "Please provide a valid email address.",
    });
  }

  const serviceLabel = getServiceLabel(service);
  const firstName = name.split(" ")[0] || name;

  const adminMailOptions = {
    from: `"MedioBytes Careers" <${SMTP_USER}>`,
    to: CONTACT_EMAIL,
    replyTo: email,
    subject: `📬 New application from ${name}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 650px; margin: 0 auto; background: #f8fafc;">
        <div style="background: linear-gradient(135deg, #1d4ed8, #06b6d4); padding: 30px; color: #fff; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 700;">New Career Application</h1>
          <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.9;">MedioBytes Careers Portal</p>
        </div>
        <div style="background: #fff; padding: 32px; border: 1px solid #e2e8f0; border-top: none;">
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td style="padding: 12px 0; font-size: 12px; font-weight: 700; color: #475569; width: 150px; text-transform: uppercase; letter-spacing: 0.5px;">👤 Name</td>
              <td style="padding: 12px 0; font-size: 14px; color: #0f172a; font-weight: 500;">${name}</td>
            </tr>
            <tr style="border-top: 1px solid #e2e8f0;">
              <td style="padding: 12px 0; font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px;">✉️ Email</td>
              <td style="padding: 12px 0; font-size: 14px;"><a href="mailto:${email}" style="color: #1d4ed8; text-decoration: none; font-weight: 500;">${email}</a></td>
            </tr>
            <tr style="border-top: 1px solid #e2e8f0;">
              <td style="padding: 12px 0; font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px;">📱 Phone</td>
              <td style="padding: 12px 0; font-size: 14px; color: #0f172a; font-weight: 500;">${phone}</td>
            </tr>
            <tr style="border-top: 1px solid #e2e8f0;">
              <td style="padding: 12px 0; font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px;">💼 Role</td>
              <td style="padding: 12px 0; font-size: 14px; color: #0f172a; font-weight: 500;">${serviceLabel}</td>
            </tr>
          </table>
          <div style="background: #f8fafc; border-left: 4px solid #1d4ed8; padding: 16px 20px; border-radius: 6px; margin-bottom: 24px;">
            <p style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 12px;">📝 Cover Letter</p>
            <p style="font-size: 14px; color: #0f172a; line-height: 1.7; margin: 0; white-space: pre-wrap; word-wrap: break-word;">${requirement}</p>
          </div>
          <div style="background: #eff6ff; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
            <p style="margin: 0; font-size: 13px; color: #475569;">Resume attached with this application.</p>
          </div>
        </div>
        <div style="background: #0f172a; color: #94a3b8; padding: 20px; text-align: center; border-radius: 0 0 12px 12px; font-size: 12px;">
          <p style="margin: 0;">MedioBytes — Digital Agency | Coimbatore, Tamil Nadu</p>
        </div>
      </div>
    `,
    attachments: [
      {
        filename: resumeFile.originalname,
        content: resumeFile.buffer,
        contentType: resumeFile.mimetype,
      },
    ],
  };

  const userMailOptions = {
    from: `"MedioBytes" <${SMTP_USER}>`,
    to: email,
    subject: "✅ Your application has been received — MedioBytes",
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 650px; margin: 0 auto; background: #f8fafc;">
        <div style="background: linear-gradient(135deg, #1d4ed8, #06b6d4); padding: 30px; color: #fff; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 700;">Thanks for applying, ${firstName}!</h1>
          <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.9;">We received your application.</p>
        </div>
        <div style="background: #fff; padding: 32px; border: 1px solid #e2e8f0; border-top: none;">
          <p style="font-size: 14px; line-height: 1.8; color: #475569; margin: 0 0 20px;">
            Your application for <strong style="color: #1d4ed8;">${serviceLabel}</strong> has been received. Our team will review it and contact you soon.
          </p>
          <p style="font-size: 14px; line-height: 1.8; color: #475569; margin: 0;">
            If you need to reach us sooner, reply to this email or write to <a href="mailto:mediobytes@gmail.com" style="color: #1d4ed8; text-decoration: none;">mediobytes@gmail.com</a>.
          </p>
        </div>
        <div style="background: #0f172a; color: #94a3b8; padding: 20px; text-align: center; border-radius: 0 0 12px 12px; font-size: 11px;">
          <p style="margin: 0;">© 2025 MedioBytes. All Rights Reserved.</p>
        </div>
      </div>
    `,
  };

  try {
    console.log(`\n📨 Processing career application from ${name} (${email})`);

    await transporter.sendMail(adminMailOptions);
    console.log(`   ✅ Admin application email sent to ${CONTACT_EMAIL}`);

    await transporter.sendMail(userMailOptions);
    console.log(`   ✅ Auto-reply sent to ${email}\n`);

    return res.json({
      success: true,
      message: `Thank you! Your application has been received. We will contact you soon.`,
    });
  } catch (error) {
    console.error(`\n❌ APPLICATION EMAIL SEND FAILED:\n`);
    console.error(`   Error Code: ${error.code}`);
    console.error(`   Error Message: ${error.message}\n`);

    if (
      error.code === "EAUTH" ||
      error.message.includes("Invalid login") ||
      error.message.includes("Username and Password")
    ) {
      console.error(
        "   🔑 FIX: Your SMTP_PASS is wrong or expired. Check your .env file.\n",
      );
    }

    return res.status(500).json({
      success: false,
      error:
        "Unable to send your application. Please try emailing us directly at mediobytes@gmail.com",
      errorCode: error.code,
    });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// START SERVER
// ════════════════════════════════════════════════════════════════════════════

app.listen(PORT, () => {
  console.log(
    `\n╔═══════════════════════════════════════════════════════════╗`,
  );
  console.log(
    `║  ✅ MedioBytes Contact API listening on port ${PORT}              ║`,
  );
  console.log(
    `║  Local: http://localhost:${PORT}                                 ║`,
  );
  console.log(
    `╚═══════════════════════════════════════════════════════════╝\n`,
  );
});

module.exports = app;
