import { NextRequest, NextResponse } from 'next/server';
import { addContactMessage, readLocalDb } from '@/lib/db';
import {
  contactFormSchema,
  checkRateLimit,
  sanitizeText,
} from '@/lib/validations';

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'local-client';

    const rate = checkRateLimit(`contact:${ip}`, 5, 60_000);
    if (!rate.allowed) {
      return NextResponse.json(
        {
          error: `Too many messages submitted. Please wait ${rate.retryAfterSeconds} seconds before trying again.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();

    // Honeypot check: if bot filled hidden field, silently reject
    if (body.honeypot && String(body.honeypot).trim().length > 0) {
      return NextResponse.json(
        { error: 'Spam detection triggered.' },
        { status: 400 }
      );
    }

    const parsed = contactFormSchema.safeParse(body);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0]?.message || 'Invalid form input.';
      return NextResponse.json({ error: firstIssue }, { status: 400 });
    }

    const cleanName = sanitizeText(parsed.data.name);
    const cleanEmail = sanitizeText(parsed.data.email);
    const cleanSubject = sanitizeText(parsed.data.subject);
    const cleanMessage = sanitizeText(parsed.data.message);

    const saved = await addContactMessage({
      name: cleanName,
      email: cleanEmail,
      subject: cleanSubject,
      message: cleanMessage,
    });

    // Optional Resend email notification if RESEND_API_KEY is configured
    let emailNotificationSent = false;
    if (process.env.RESEND_API_KEY) {
      try {
        const db = readLocalDb();
        const notifyTo =
          process.env.CONTACT_NOTIFICATION_EMAIL ||
          db.profile.email ||
          'hafizhusnain018@gmail.com';

        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Portfolio Contact <onboarding@resend.dev>',
            to: [notifyTo],
            subject: `[Portfolio Message] ${cleanSubject} — from ${cleanName}`,
            text: `Name: ${cleanName}\nEmail: ${cleanEmail}\nSubject: ${cleanSubject}\n\nMessage:\n${cleanMessage}`,
          }),
        });
        emailNotificationSent = resendRes.ok;
      } catch (e) {
        console.warn('Optional Resend notification failed:', e);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Your message has been saved and delivered to Ali Husnain.',
      record_id: saved.id,
      email_notification_sent: emailNotificationSent,
    });
  } catch (err) {
    console.error('Error in POST /api/contact:', err);
    return NextResponse.json(
      { error: 'An unexpected server error occurred while saving your message.' },
      { status: 500 }
    );
  }
}
