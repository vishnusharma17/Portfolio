/**
 * SMS sender — tries Fast2SMS (India), then Twilio, then Textbelt.
 * Returns { ok, provider, detail }
 */

function digitsOnly(phone) {
  return String(phone || '').replace(/\D/g, '')
}

export async function sendSmsOtp(phone, otp) {
  const message = `Vishnu Portfolio Admin OTP: ${otp}. Valid for 5 minutes. Do not share.`
  const phoneDigits = digitsOnly(phone)

  // 1) Fast2SMS (best for Indian numbers)
  if (process.env.FAST2SMS_API_KEY) {
    try {
      const params = new URLSearchParams({
        authorization: process.env.FAST2SMS_API_KEY,
        route: 'q',
        message,
        numbers: phoneDigits.length === 12 ? phoneDigits.slice(2) : phoneDigits,
        flash: '0',
      })

      const res = await fetch(`https://www.fast2sms.com/dev/bulkV2?${params}`, {
        method: 'GET',
      })
      const data = await res.json().catch(() => ({}))
      if (data.return === true || data.status_code === 200) {
        return { ok: true, provider: 'fast2sms' }
      }
      return {
        ok: false,
        provider: 'fast2sms',
        detail: data.message || JSON.stringify(data),
      }
    } catch (err) {
      return { ok: false, provider: 'fast2sms', detail: err.message }
    }
  }

  // 2) Twilio
  if (
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_FROM
  ) {
    try {
      const to = phoneDigits.startsWith('+') ? phoneDigits : `+${phoneDigits}`
      const auth = Buffer.from(
        `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
      ).toString('base64')

      const body = new URLSearchParams({
        To: to,
        From: process.env.TWILIO_FROM,
        Body: message,
      })

      const res = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body,
        }
      )

      if (res.ok) return { ok: true, provider: 'twilio' }
      const errText = await res.text()
      return { ok: false, provider: 'twilio', detail: errText }
    } catch (err) {
      return { ok: false, provider: 'twilio', detail: err.message }
    }
  }

  // 3) Textbelt (limited free tier)
  const textbeltKey = process.env.TEXTBELT_KEY || 'textbelt'
  try {
    const res = await fetch('https://textbelt.com/text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: phoneDigits,
        message,
        key: textbeltKey,
      }),
    })
    const data = await res.json().catch(() => ({}))
    if (data.success) return { ok: true, provider: 'textbelt' }
    return {
      ok: false,
      provider: 'textbelt',
      detail: data.error || 'SMS quota exceeded or blocked',
    }
  } catch (err) {
    return { ok: false, provider: 'textbelt', detail: err.message }
  }
}
