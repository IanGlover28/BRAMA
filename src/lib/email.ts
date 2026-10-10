import { Resend } from "resend";
import { VENDOR_EMAILS } from "@/lib/vendor";

const SHOP_URL = "https://brama.com";
const BRAND_PINK = "#DB2777";

// Resend only sends from a domain verified in your Resend account. Once
// brama.com is purchased, add it at https://resend.com/domains, add the DNS
// records and verify — then the default no-reply@brama.com works. Override
// with RESEND_FROM_EMAIL if needed.
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Brama <no-reply@brama.com>";

const resend = new Resend(process.env.RESEND_API_KEY!);

function logEmailError(scope: string, err: unknown) {
  const msg = err instanceof Error ? err.message : "unknown error";
  console.warn(`[email] ${scope} failed to send: ${msg}`);
}

export interface EmailOrderItem {
  name: string;
  price: number;
  quantity: number;
}

export interface EmailOrder {
  reference: string | null;
  total: number;
  items: EmailOrderItem[];
  shippingAddress: string | null;
  note: string | null;
  customerName: string | null;
  customerEmail: string;
}

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
      from: FROM_EMAIL,
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

function orderItemsHtml(items: EmailOrderItem[]): string {
  return items
    .map(
      (item) => `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #F3F4F6;font-size:14px;color:#1F2937;">${escapeHtml(item.name)}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #F3F4F6;font-size:14px;color:#4B5563;text-align:center;">${item.quantity}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #F3F4F6;font-size:14px;color:#111827;text-align:right;font-weight:600;">₵${item.price.toFixed(2)}</td>
        </tr>`
    )
    .join("");
}

function emailShell(inner: string): string {
  return `
    <div style="margin:0;padding:40px 16px;background-color:#F9FAFB;font-family:Helvetica,Arial,sans-serif;line-height:1.6;color:#111827;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:560px;margin:0 auto;width:100%;">
        <tr>
          <td style="background:linear-gradient(135deg,#DB2777 0%,#BE185D 100%);border-radius:18px 18px 0 0;padding:30px 40px;text-align:center;">
            <div style="display:inline-block;width:48px;height:48px;border-radius:50%;background:#fff;color:#DB2777;font-size:24px;font-weight:800;line-height:48px;text-align:center;">B</div>
            <h1 style="color:#fff;font-size:22px;margin:12px 0 0;letter-spacing:-0.5px;">BRAMA</h1>
            <p style="color:#FCE7F3;font-size:13px;margin:4px 0 0;">Beauty, made for every story.</p>
          </td>
        </tr>
        <tr>
          <td style="background:#ffffff;border-radius:0 0 18px 18px;padding:32px 40px;">
            ${inner}
          </td>
        </tr>
        <tr>
          <td style="padding:24px 16px 8px;text-align:center;color:#9CA3AF;font-size:12px;">
            <p style="margin:0;"><strong style="color:#DB2777;">BRAMA</strong> &bull; ${SHOP_URL} &bull; no-reply@brama.com</p>
          </td>
        </tr>
      </table>
    </div>
  `;
}

export async function sendOrderConfirmationEmail(
  to: string,
  name: string | null,
  order: EmailOrder
) {
  try {
    const itemsHtml = orderItemsHtml(order.items);
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Your BRAMA order is confirmed — Ref ${order.reference ?? "BRAMA"}`.trim(),
      html: emailShell(`
        <p style="margin:0 0 14px;font-size:15px;">Hi ${escapeHtml(name || "there")},</p>
        <p style="margin:0 0 20px;font-size:15px;color:#4B5563;">
          Thank you! Your order has been received and is being prepared for delivery. Here&rsquo;s what you ordered:
        </p>

        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 6px;border:1px solid #F3F4F6;border-radius:12px;overflow:hidden;">
          <tr style="background:#FFF1F5;">
            <td style="padding:10px 12px;font-size:11px;font-weight:700;color:#DB2777;text-transform:uppercase;">Item</td>
            <td style="padding:10px 12px;font-size:11px;font-weight:700;color:#DB2777;text-transform:uppercase;text-align:center;">Qty</td>
            <td style="padding:10px 12px;font-size:11px;font-weight:700;color:#DB2777;text-transform:uppercase;text-align:right;">Price</td>
          </tr>
          ${itemsHtml}
          <tr>
            <td colspan="2" style="padding:12px;border-top:1px solid #F3F4F6;font-size:15px;font-weight:700;color:#111827;">Total</td>
            <td style="padding:12px;border-top:1px solid #F3F4F6;font-size:15px;font-weight:800;color:#DB2777;text-align:right;">₵${order.total.toFixed(2)}</td>
          </tr>
        </table>

        ${order.shippingAddress ? `
          <p style="margin:14px 0 4px;font-size:13px;font-weight:700;color:#374151;">Deliver to</p>
          <p style="margin:0 0 20px;font-size:14px;color:#4B5563;">${escapeHtml(order.shippingAddress)}</p>` : ""}

        ${order.note ? `
          <p style="margin:0 0 20px;font-size:14px;color:#4B5563;"><strong style="color:#374151;">Your note:</strong> ${escapeHtml(order.note)}</p>` : ""}

        <p style="margin:0 0 24px;font-size:14px;color:#4B5563;">
          We&rsquo;ll keep you updated as your order moves through fulfillment. Questions? Just reply to this email.
        </p>

        <table align="center" cellpadding="0" cellspacing="0" role="presentation" style="margin:0;">
          <tr>
            <td style="border-radius:999px;background:${BRAND_PINK};padding:0;">
              <a href="${SHOP_URL}/orders" style="display:inline-block;padding:14px 36px;border-radius:999px;background:${BRAND_PINK};color:#fff;font-size:15px;font-weight:700;text-decoration:none;box-shadow:0 6px 16px rgba(219,39,119,0.35);">
                View Your Orders
              </a>
            </td>
          </tr>
        </table>
      `),
    });
  } catch (err) {
    logEmailError("Order confirmation email", err);
  }
}

export async function sendNewOrderVendorEmail(order: EmailOrder) {
  for (const vendorEmail of VENDOR_EMAILS) {
    try {
      const itemsHtml = orderItemsHtml(order.items);
      await resend.emails.send({
      from: FROM_EMAIL,
      to: vendorEmail,
      subject: `New order ${order.reference ? `#${order.reference} ` : ""}— ${order.customerName || order.customerEmail}`,
        html: emailShell(`
          <p style="margin:0 0 14px;font-size:15px;">A new order has been placed.</p>
          <p style="margin:0 0 20px;font-size:14px;color:#4B5563;">
            <strong style="color:#111827;">Customer:</strong> ${escapeHtml(order.customerName || order.customerEmail)}
            ${order.customerName ? `<br><span style="color:#6B7280;">${escapeHtml(order.customerEmail)}</span>` : ""}
          </p>

          <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 6px;border:1px solid #F3F4F6;border-radius:12px;overflow:hidden;">
            <tr style="background:#FFF1F5;">
              <td style="padding:10px 12px;font-size:11px;font-weight:700;color:#DB2777;text-transform:uppercase;">Item</td>
              <td style="padding:10px 12px;font-size:11px;font-weight:700;color:#DB2777;text-transform:uppercase;text-align:center;">Qty</td>
              <td style="padding:10px 12px;font-size:11px;font-weight:700;color:#DB2777;text-transform:uppercase;text-align:right;">Price</td>
            </tr>
            ${itemsHtml}
            <tr>
              <td colspan="2" style="padding:12px;border-top:1px solid #F3F4F6;font-size:15px;font-weight:700;color:#111827;">Total</td>
              <td style="padding:12px;border-top:1px solid #F3F4F6;font-size:15px;font-weight:800;color:#DB2777;text-align:right;">₵${order.total.toFixed(2)}</td>
            </tr>
          </table>

          ${order.shippingAddress ? `
            <p style="margin:14px 0 4px;font-size:13px;font-weight:700;color:#374151;">Ship to</p>
            <p style="margin:0 0 20px;font-size:14px;color:#4B5563;">${escapeHtml(order.shippingAddress)}</p>` : ""}

          ${order.note ? `
            <p style="margin:0 0 20px;font-size:14px;color:#4B5563;"><strong style="color:#374151;">Order note:</strong> ${escapeHtml(order.note)}</p>` : ""}

          ${order.reference ? `
            <p style="margin:0 0 20px;font-size:14px;color:#4B5563;"><strong style="color:#374151;">Reference:</strong> ${escapeHtml(order.reference)}</p>` : ""}

          <table align="center" cellpadding="0" cellspacing="0" role="presentation" style="margin:0;">
            <tr>
              <td style="border-radius:999px;background:${BRAND_PINK};padding:0;">
                <a href="${SHOP_URL}/vendor/orders" style="display:inline-block;padding:14px 36px;border-radius:999px;background:${BRAND_PINK};color:#fff;font-size:15px;font-weight:700;text-decoration:none;box-shadow:0 6px 16px rgba(219,39,119,0.35);">
                  Open Vendor Orders
                </a>
              </td>
            </tr>
          </table>
`),
    });
    } catch (err) {
      logEmailError("New order vendor email", err);
    }
  }
}