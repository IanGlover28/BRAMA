import { Resend } from "resend";
import { VENDOR_EMAILS } from "@/lib/vendor";
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, SITE_URL } from "@/lib/site";
import { calcSubtotal, DELIVERY_FEE } from "@/lib/pricing";

// Resend only sends from a verified domain - bramacosmetics.com is verified in Resend.
// Replies go to the shop inbox, since the sending address has no mailbox.
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "BRAMA Cosmetics <orders@bramacosmetics.com>";
const REPLY_TO = process.env.RESEND_REPLY_TO || "bramacosmetics@gmail.com";

const resend = new Resend(process.env.RESEND_API_KEY!);

// Brand palette - mirrors the site's terracotta rose on warm neutrals.
const C = {
  brand: "#A34A48",
  brandDark: "#8A3E3D",
  brandSoft: "#FDF6F5",
  brandTint: "#FAE0DF",
  ink: "#1F1A19",
  inkSoft: "#4A413E",
  muted: "#7D716C",
  line: "#E7E0DD",
  canvas: "#F6F1EF",
  white: "#FFFFFF",
};
const SERIF = "'Playfair Display',Georgia,'Times New Roman',serif";
const SANS = "Montserrat,'Helvetica Neue',Helvetica,Arial,sans-serif";
const LOGO_URL = `${SITE_URL}/brama-logo.png`;

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

const cedis = (n: number) => `GH₵${n.toFixed(2)}`;

/**
 * Sends through Resend and logs failures. The SDK reports API errors (bad
 * sender, unverified domain, rate limits) in `error` rather than throwing,
 * so both paths have to be checked or failed emails vanish silently.
 */
async function send(scope: string, message: { to: string; subject: string; html: string; text: string }) {
  try {
    const { error } = await resend.emails.send({ from: FROM_EMAIL, replyTo: REPLY_TO, ...message });
    if (error) console.error(`[email] ${scope} rejected by Resend: ${error.name} - ${error.message}`);
  } catch (err) {
    console.error(`[email] ${scope} failed to send:`, err instanceof Error ? err.message : err);
  }
}

// ---------------------------------------------------------------- layout ---

function button(href: string, label: string): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
      <tr>
        <td style="border-radius:999px;background:${C.brand};">
          <a href="${href}" style="display:inline-block;padding:14px 34px;border-radius:999px;background:${C.brand};color:${C.white};font-family:${SANS};font-size:14px;font-weight:700;letter-spacing:0.04em;text-decoration:none;">${label}</a>
        </td>
      </tr>
    </table>`;
}

function shell({ preheader, body, footnote }: { preheader: string; body: string; footnote: string }): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light only">
  <title>BRAMA Cosmetics</title>
</head>
<body style="margin:0;padding:0;background:${C.canvas};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.canvas};">${escapeHtml(preheader)}&#8203;</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.canvas};">
    <tr>
      <td align="center" style="padding:32px 12px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <!-- Brand header -->
          <tr>
            <td align="center" style="padding:0 0 22px;">
              <a href="${SITE_URL}" style="text-decoration:none;">
                <!-- The logo is pale pink on transparent, so it sits on a brand-colour disc. -->
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 10px;">
                  <tr>
                    <td style="width:64px;height:64px;border-radius:50%;background:${C.brand};text-align:center;vertical-align:middle;">
                      <img src="${LOGO_URL}" width="56" height="56" alt="BRAMA" style="display:block;margin:4px auto;">
                    </td>
                  </tr>
                </table>
                <span style="font-family:${SERIF};font-size:22px;letter-spacing:0.3em;color:${C.ink};">BRAMA</span>
              </a>
              <div style="font-family:${SANS};font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:${C.muted};margin-top:4px;">Cosmetics</div>
            </td>
          </tr>
          <!-- Card -->
          <tr>
            <td style="background:${C.white};border:1px solid ${C.line};border-radius:18px;overflow:hidden;">
              <div style="height:4px;background:${C.brand};line-height:4px;font-size:0;">&nbsp;</div>
              <div style="padding:36px 36px 32px;font-family:${SANS};color:${C.ink};font-size:15px;line-height:1.65;">
                ${body}
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="padding:24px 16px 8px;font-family:${SANS};font-size:12px;line-height:1.7;color:${C.muted};">
              <p style="margin:0 0 6px;">Questions? Reply to this email or reach us at
                <a href="mailto:${CONTACT_EMAIL}" style="color:${C.brand};text-decoration:none;">${CONTACT_EMAIL}</a>
                &middot; ${CONTACT_PHONE_DISPLAY}</p>
              <p style="margin:0 0 6px;"><a href="${SITE_URL}" style="color:${C.inkSoft};text-decoration:none;font-weight:600;">bramacosmetics.com</a> &middot; Accra, Ghana</p>
              <p style="margin:0;">${footnote}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function itemsTable(order: EmailOrder): string {
  const subtotal = calcSubtotal(order.items);
  const discount = Math.max(0, parseFloat((subtotal + DELIVERY_FEE - order.total).toFixed(2)));
  const rows = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding:14px 0;border-bottom:1px solid ${C.line};font-size:14px;color:${C.ink};">
            ${escapeHtml(item.name)}
            <div style="font-size:12px;color:${C.muted};margin-top:2px;">Qty ${item.quantity} &times; ${cedis(item.price)}</div>
          </td>
          <td align="right" style="padding:14px 0;border-bottom:1px solid ${C.line};font-size:14px;font-weight:600;color:${C.ink};white-space:nowrap;">
            ${cedis(item.price * item.quantity)}
          </td>
        </tr>`
    )
    .join("");
  const line = (label: string, value: string, color = C.inkSoft) => `
        <tr>
          <td style="padding:4px 0;font-size:13px;color:${C.muted};">${label}</td>
          <td align="right" style="padding:4px 0;font-size:13px;color:${color};">${value}</td>
        </tr>`;
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 8px;">
      ${rows}
      <tr><td colspan="2" style="height:10px;font-size:0;line-height:0;">&nbsp;</td></tr>
      ${line("Subtotal", cedis(subtotal))}
      ${line("Delivery", cedis(DELIVERY_FEE))}
      ${discount > 0 ? line("Discount", `&minus;${cedis(discount)}`, C.brand) : ""}
      <tr>
        <td style="padding:12px 0 0;border-top:1px solid ${C.line};font-size:15px;font-weight:700;color:${C.ink};">Total paid</td>
        <td align="right" style="padding:12px 0 0;border-top:1px solid ${C.line};font-family:${SERIF};font-size:22px;color:${C.brand};">${cedis(order.total)}</td>
      </tr>
    </table>`;
}

function detailBlock(label: string, value: string): string {
  return `
    <td valign="top" style="padding:16px 18px;background:${C.brandSoft};border-radius:12px;">
      <div style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${C.brand};font-weight:700;margin-bottom:6px;">${label}</div>
      <div style="font-size:14px;color:${C.inkSoft};line-height:1.55;">${value}</div>
    </td>`;
}

function itemsText(order: EmailOrder): string {
  return order.items.map((i) => `- ${i.name} x${i.quantity}: ${cedis(i.price * i.quantity)}`).join("\n");
}

// ---------------------------------------------------------------- emails ---

export async function sendConfirmationEmail(to: string, name: string) {
  const html = shell({
    preheader: "Your BRAMA account is ready - here's where to start.",
    footnote: "You're receiving this because you created an account at bramacosmetics.com.",
    body: `
      <h1 style="margin:0 0 6px;font-family:${SERIF};font-size:28px;font-weight:400;color:${C.ink};">Welcome, ${escapeHtml(name)}</h1>
      <p style="margin:0 0 22px;color:${C.inkSoft};">Thank you for joining BRAMA - skincare, makeup and body care for every skin tone and every day.</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 26px;">
        <tr>${detailBlock("Shop", "Cleansers, serums, moisturisers and inclusive makeup shades.")}</tr>
        <tr><td style="height:10px;font-size:0;">&nbsp;</td></tr>
        <tr>${detailBlock("Learn", `Free routines and tutorials at <a href="${SITE_URL}/learn" style="color:${C.brand};">bramacosmetics.com/learn</a>.`)}</tr>
      </table>
      ${button(`${SITE_URL}/products`, "Start shopping")}`,
  });
  const text = `Welcome to BRAMA, ${name}!\n\nThank you for joining BRAMA. Start shopping: ${SITE_URL}/products\nFree tutorials: ${SITE_URL}/learn\n\nQuestions? Reply to this email or contact ${CONTACT_EMAIL} / ${CONTACT_PHONE_DISPLAY}.`;
  await send("Welcome email", { to, subject: "Welcome to BRAMA", html, text });
}

export async function sendOrderConfirmationEmail(to: string, name: string | null, order: EmailOrder) {
  const ref = order.reference ?? "";
  const firstName = (name || "").split(" ")[0] || "there";
  const html = shell({
    preheader: `Order confirmed - ${cedis(order.total)}. We're getting it ready for delivery.`,
    footnote: "You're receiving this because you placed an order at bramacosmetics.com.",
    body: `
      <div style="display:inline-block;padding:5px 12px;border-radius:999px;background:${C.brandTint};color:${C.brandDark};font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 16px;">Order confirmed</div>
      <h1 style="margin:0 0 8px;font-family:${SERIF};font-size:28px;font-weight:400;color:${C.ink};">Thank you, ${escapeHtml(firstName)}</h1>
      <p style="margin:0 0 24px;color:${C.inkSoft};">We've received your payment and we're preparing your order for delivery.${ref ? ` Your reference is <strong style="color:${C.ink};">${escapeHtml(ref)}</strong>.` : ""}</p>

      ${itemsTable(order)}

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:22px 0 0;">
        <tr>${order.shippingAddress ? detailBlock("Delivering to", escapeHtml(order.shippingAddress)) : ""}</tr>
        ${order.note ? `<tr><td style="height:10px;font-size:0;">&nbsp;</td></tr><tr>${detailBlock("Your note", escapeHtml(order.note))}</tr>` : ""}
      </table>

      <h2 style="margin:28px 0 10px;font-family:${SERIF};font-size:18px;font-weight:400;color:${C.ink};">What happens next</h2>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;font-size:14px;color:${C.inkSoft};">
        <tr><td width="28" valign="top" style="color:${C.brand};font-weight:700;">1</td><td style="padding-bottom:6px;">We pack your order with care.</td></tr>
        <tr><td width="28" valign="top" style="color:${C.brand};font-weight:700;">2</td><td style="padding-bottom:6px;">Our rider calls you before delivery.</td></tr>
        <tr><td width="28" valign="top" style="color:${C.brand};font-weight:700;">3</td><td>You glow. Tell us how you like it!</td></tr>
      </table>

      ${button(`${SITE_URL}/orders`, "Track your order")}
      <p style="margin:14px 0 0;text-align:center;font-size:12px;color:${C.muted};">Checked out as a guest? Create an account with ${escapeHtml(to)} to see this order.</p>`,
  });
  const text = [
    `Thank you, ${firstName} - your BRAMA order is confirmed.`,
    ref ? `Reference: ${ref}` : "",
    "",
    itemsText(order),
    `Delivery: ${cedis(DELIVERY_FEE)}`,
    `Total paid: ${cedis(order.total)}`,
    "",
    order.shippingAddress ? `Delivering to: ${order.shippingAddress}` : "",
    order.note ? `Your note: ${order.note}` : "",
    "",
    `Track your order: ${SITE_URL}/orders`,
    `Questions? Reply to this email or contact ${CONTACT_EMAIL} / ${CONTACT_PHONE_DISPLAY}.`,
  ]
    .filter((l, i, all) => l !== "" || all[i - 1] !== "")
    .join("\n");
  await send("Order confirmation email", {
    to,
    subject: `Your BRAMA order is confirmed${ref ? ` (${ref})` : ""}`,
    html,
    text,
  });
}

export async function sendNewOrderVendorEmail(order: EmailOrder) {
  const customer = order.customerName || order.customerEmail;
  const html = shell({
    preheader: `New order from ${customer} - ${cedis(order.total)}.`,
    footnote: "Sent to the BRAMA vendor account for every paid order.",
    body: `
      <div style="display:inline-block;padding:5px 12px;border-radius:999px;background:${C.brandTint};color:${C.brandDark};font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 16px;">New paid order</div>
      <h1 style="margin:0 0 4px;font-family:${SERIF};font-size:26px;font-weight:400;color:${C.ink};">${cedis(order.total)} from ${escapeHtml(customer)}</h1>
      <p style="margin:0 0 22px;color:${C.muted};font-size:13px;">${escapeHtml(order.customerEmail)}${order.reference ? ` &middot; Ref ${escapeHtml(order.reference)}` : ""}</p>

      ${itemsTable(order)}

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:22px 0 28px;">
        <tr>${detailBlock("Deliver to", escapeHtml(order.shippingAddress || "No address given - contact the customer"))}</tr>
        ${order.note ? `<tr><td style="height:10px;font-size:0;">&nbsp;</td></tr><tr>${detailBlock("Customer note", escapeHtml(order.note))}</tr>` : ""}
      </table>

      ${button(`${SITE_URL}/vendor/orders`, "Open vendor orders")}`,
  });
  const text = [
    `New paid order: ${cedis(order.total)} from ${customer} (${order.customerEmail})`,
    order.reference ? `Reference: ${order.reference}` : "",
    "",
    itemsText(order),
    "",
    `Deliver to: ${order.shippingAddress || "No address given"}`,
    order.note ? `Customer note: ${order.note}` : "",
    "",
    `Vendor orders: ${SITE_URL}/vendor/orders`,
  ].join("\n");

  for (const vendorEmail of VENDOR_EMAILS) {
    await send("New order vendor email", {
      to: vendorEmail,
      subject: `New order${order.reference ? ` ${order.reference}` : ""} - ${customer} - ${cedis(order.total)}`,
      html,
      text,
    });
  }
}
