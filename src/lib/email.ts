import { Resend } from "@resend/node";
export const resend = new Resend(process.env.RESEND_API_KEY!);


export async function sendConfirmationEmail(to: string, name: string) {
  try {
    await resend.emails.send({
      from: "Brama <no-reply@brama.com>",
      to,
      subject: "Welcome to BRAMA! 🎉",
      html: `
        <div style="font-family: sans-serif; line-height: 1.5;">
          <h2>Hello ${name},</h2>
          <p>Thank you for signing up at <strong>BRAMA</strong>!</p>
          <p>We’re excited to have you on board. Start shopping your favorite products today!</p>
          <p>— The BRAMA Team</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Failed to send confirmation email:", err);
  }
}
