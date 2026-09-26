import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { clientKeyFromHeaders, isRateLimited } from '../security/rateLimiter';
import { validateBookingRequest } from '../validation/booking';

function jsonResponse(status: number, body: unknown): HttpResponseInit {
  return {
    status,
    jsonBody: body,
    headers: { 'Content-Type': 'application/json' },
  };
}

function generateCode(): string {
  const n = Math.floor(1000 + Math.random() * 8999);
  return `VSP-${n}`;
}

/**
 * Notifies whoever handles bookings. Kept behind an env-configured webhook
 * so no email/CRM vendor is hardcoded — point BOOKING_NOTIFY_WEBHOOK_URL at
 * Zapier/Make/Power Automate, or replace this with a direct call to your
 * provider's API (Resend, SendGrid, etc.) once you pick one. The booking is
 * always accepted and logged even if this fails, so a flaky webhook never
 * blocks a guest's request from being recorded in the Function logs.
 */
async function notify(context: InvocationContext, payload: Record<string, unknown>): Promise<void> {
  const webhookUrl = process.env.BOOKING_NOTIFY_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeout);
  } catch (error) {
    context.warn('booking notify webhook failed', error);
  }
}

export async function booking(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const clientKey = clientKeyFromHeaders(request.headers);
  if (isRateLimited(clientKey)) {
    return jsonResponse(429, { message: 'Demasiadas solicitudes. Intenta más tarde.' });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse(400, { message: 'Cuerpo de la solicitud inválido.' });
  }

  const result = validateBookingRequest(body);
  if (!result.valid) {
    return jsonResponse(400, { message: result.message });
  }

  const code = generateCode();
  const { data, nights } = result;

  context.log('booking received', { code, lodgeId: data.lodgeId, roomId: data.roomId, nights });

  await notify(context, { code, nights, ...data, receivedAt: new Date().toISOString() });

  return jsonResponse(201, { code, nights });
}

app.http('booking', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'booking',
  handler: booking,
});
