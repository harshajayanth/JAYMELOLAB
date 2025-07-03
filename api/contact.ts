import { VercelRequest, VercelResponse } from '@vercel/node';
import { sendEmail, replyEmail } from '../server/utils/sendemail';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { name, email, serviceType, message } = req.body;

    // 🔒 Basic validation
    if (!name || !email || !serviceType || !message) {
      return res.status(400).json({
        message: 'All fields are required: name, email, serviceType, and message',
      });
    }

    // Compose the notification email to you
    const subject = `JAYMELOLAB | New Contact from ${name}`;
    const htmlToYou = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>📬 New Contact Form Submission - JAYMELOLAB</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Service Type:</strong> ${serviceType}</p>
        <p><strong>Message:</strong><br/>${message.replace(/\n/g, "<br/>")}</p>
      </div>
    `;

    await sendEmail(subject, htmlToYou);

    // Auto-reply to the client
    const replySubject = `👋 Hey! Thanks for reaching out to JAYMELOLAB!`;
    const replyHtml = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <p>Hi ${name},</p>

        <p>Thank you for contacting <strong>JAYMELO SOUNDLAB</strong>! We're thrilled to hear from you and look forward to learning more about your project.</p>

        <p>To ensure a smooth and successful collaboration, please follow the steps below:</p>

        <ol style="padding-left: 20px;">
          <li>
            <strong>Step 1:</strong> Schedule a brief consultation with <strong>Harsha Jayanth</strong>.<br/>
            📞 <a href="tel:+919491364620">+91 94913 64620</a>
          </li>
          <li style="margin-top: 10px;">
            <strong>Step 2:</strong> Fill out this form for <strong>${serviceType}</strong>:<br/>
            📝 <a href="https://clover-party-2eb.notion.site/201035a21fe780d1aabaec458247d650?pvs=105" target="_blank" style="color: #3b82f6;">Service Form</a>
          </li>
        </ol>

        <p>Looking forward to connecting!<br/>Warm regards,<br/><strong>Harsha Jayanth</strong></p>
      </div>
    `;

    await replyEmail(replySubject, replyHtml, email);

    return res.status(200).json({ message: 'Contact form submitted and auto-reply sent' });

  } catch (error: any) {
    console.error('❌ Failed to submit contact form:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
