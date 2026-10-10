import { Resend } from "resend";
export const resend = new Resend(process.env.RESEND_API_KEY!);

const SHOP_URL = "https://brama.com";

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
      subject: "Welcome to BRAMA — you're glowing already",
      html: `
        <div style="margin:0;padding:40px 16px;background-color:#F9FAFB;font-family:Helvetica,Arial,sans-serif;line-height:1.6;color:#111827;">
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:560px;margin:0 auto;width:100%;">
            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(135deg,#DB2777 0%,#BE185D 100%);border-radius:18px 18px 0 0;padding:36px 40px 30px;text-align:center;">
                <div style="display:inline-block;width:56px;height:56px;border-radius:50%;background:#fff;color:#DB2777;font-size:28px;font-weight:800;line-height:56px;text-align:center;">B</div>
                <h1 style="color:#fff;font-size:26px;margin:16px 0 4px;letter-spacing:-0.5px;">Welcome to <span style="font-style:italic;color:#FBCFE8;">BRAMA</span></h1>
                <p style="color:#FCE7F3;font-size:14px;margin:0;">Beauty, made for every story.</p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="background:#ffffff;border-radius:0 0 18px 18px;padding:34px 40px;">
                <p style="margin:0 0 14px;font-size:15px;">Hi ${escapeHtml(name)},</p>
                <p style="margin:0 0 18px;font-size:15px;color:#4B5563;">
                  Thank you for joining <strong style="color:#111827;">BRAMA</strong>. We create skincare,
                  makeup and body care for every skin tone and every day — real, honest, glow-from-within beauty.
                </p>

                <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 24px;">
                  <tr>
                    <td style="background:#FFF1F5;border-radius:12px;padding:12px 16px;font-size:14px;color:#4B5563;">
                      <strong style="color:#DB2777;">Shop skincare</strong> — cleansers, serums &amp; moisturizers for everyday rituals
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:0 0 8px;">&nbsp;</td>
                  </tr>
                  <tr>
                    <td style="background:#FFF1F5;border-radius:12px;padding:12px 16px;font-size:14px;color:#4B5563;">
                      <strong style="color:#DB2777;">Unlock makeup</strong> — inclusive shades, from natural every day to full glam
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:0 0 8px;">&nbsp;</td>
                  </tr>
                  <tr>
                    <td style="background:#FFF1F5;border-radius:12px;padding:12px 16px;font-size:14px;color:#4B5563;">
                      <strong style="color:#DB2777;">Learn on our blog</strong> — free tutorials and tips at brama.com/learn
                    </td>
                  </tr>
                </table>

                <p style="margin:0 0 24px;font-size:15px;color:#4B5563;">
                  Explore the collection, and don&rsquo;t forget — your first order ships fast, tracked, right here under the sun.
                </p>

                <table align="center" cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 28px;">
                  <tr>
                    <td style="border-radius:999px;background:#DB2777;padding:0;">
                      <a href="${SHOP_URL}" style="display:inline-block;padding:14px 36px;border-radius:999px;background:#DB2777;color:#fff;font-size:15px;font-weight:700;text-decoration:none;box-shadow:0 6px 16px rgba(219,39,119,0.35);">
                        Start Shopping
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="margin:0;font-size:13px;color:#9CA3AF;text-align:center;">
                  Questions? Just reply to this email — a real human is here to help.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:26px 16px 10px;text-align:center;color:#9CA3AF;font-size:12px;">
                <p style="margin:0 0 4px;">
                  <strong style="color:#DB2777;">BRAMA</strong> &bull; ${SHOP_URL} &bull; no-reply@brama.com
                </p>
                <p style="margin:0;">You&rsquo;re receiving this because you created a BRAMA account.</p>
              </td>
            </tr>
          </table>
        </div>
      `,
    });
  } catch {
    // Silently fail - email is non-critical
  }
}