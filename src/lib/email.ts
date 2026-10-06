import { Resend } from "resend";
export const resend = new Resend(process.env.RESEND_API_KEY!);

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendConfirmationEmail(to: string, name: string) {
  try {
    await resend.emails.send({
      from: "Brama <no-reply@brama.com>",
      to,
      subject: "Welcome to BRAMA!",
      html: `
        <div style="font-family: sans-serif; line-height: 1.5;">
          <h2>Hello ${escapeHtml(name)},</h2>
          <p>Thank you for signing up at <strong>BRAMA</strong>!</p>
          <p>We're excited to have you on board. Start shopping your favorite products today!</p>
          <p>— The BRAMA Team</p>
        </div>
      `,
    });
  } catch {
    // Silently fail - email is non-critical
  }
}
