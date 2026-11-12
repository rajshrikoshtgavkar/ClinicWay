import nodemailer from "nodemailer";
import ejs from "ejs";
import fs from "fs";
import path from "path";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
    user: process.env.SMTP_EMAIL || "clinicway.auth@gmail.com",
    pass: process.env.SMTP_PASSWORD || "kiyxqfyllebbppuf",
  },
});

export default async function POST(
  email: string,
  token: string,
  name: string
): Promise<boolean> {
  const templatePath = path.join(process.cwd(), "src/helper/mailTemplate.ejs");
  const template = fs.readFileSync(templatePath, "utf-8");
  const mailOptions = {
    from: "Raksha Vision | No Reply <",
    to: email,
    subject: "Verify Email",
    html: ejs.render(template, { token, name }),
  };
  try {
    await new Promise<void>((resolve, reject) => {
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          console.log("Email sent:", info.response);
          resolve();
        }
      });
    });
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}
