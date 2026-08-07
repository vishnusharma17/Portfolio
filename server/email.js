import tls from 'tls'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'vishnusharma983j@gmail.com'

export function maskEmail(email) {
  const str = String(email || ADMIN_EMAIL).trim()
  const [user, domain] = str.split('@')
  if (!user || !domain) return '***@***.com'
  const visible = user.slice(0, 4)
  return `${visible}***@${domain}`
}

export async function sendEmailOtp(email, otp) {
  const recipient = email || ADMIN_EMAIL
  const subject = `Portfolio Admin OTP: ${otp}`
  const textContent = `Your Vishnu Portfolio Admin OTP is: ${otp}\nValid for 5 minutes. Do not share with anyone.`
  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px; background: #0f172a; color: #f8fafc; border-radius: 12px; max-width: 480px; margin: auto; border: 1px solid #1e293b;">
      <h2 style="color: #38bdf8; margin-top: 0; margin-bottom: 8px; font-size: 1.4rem;">Vishnu Portfolio Admin</h2>
      <p style="color: #94a3b8; font-size: 0.95rem; line-height: 1.5;">Use the OTP code below to unlock your admin dashboard:</p>
      <div style="background: #1e293b; border: 1px dashed #38bdf8; padding: 18px; text-align: center; border-radius: 8px; margin: 20px 0;">
        <span style="font-size: 2.2rem; font-weight: bold; letter-spacing: 8px; color: #38bdf8;">${otp}</span>
      </div>
      <p style="color: #64748b; font-size: 0.82rem; margin-bottom: 0;">This OTP is valid for 5 minutes. If you did not request this, please ignore.</p>
    </div>
  `

  // 1) Resend API (Free 3,000 emails/month)
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Portfolio Admin <onboarding@resend.dev>',
          to: recipient,
          subject,
          html: htmlContent,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.id) {
        return { ok: true, provider: 'resend' }
      }
      return { ok: false, provider: 'resend', detail: data.message || JSON.stringify(data) }
    } catch (err) {
      return { ok: false, provider: 'resend', detail: err.message }
    }
  }

  // 2) Brevo / Sendinblue API (Free 300 emails/day)
  if (process.env.BREVO_API_KEY) {
    try {
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': process.env.BREVO_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: { name: 'Vishnu Portfolio', email: 'vishnusharma983j@gmail.com' },
          to: [{ email: recipient }],
          subject,
          htmlContent,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        return { ok: true, provider: 'brevo' }
      }
      return { ok: false, provider: 'brevo', detail: data.message || JSON.stringify(data) }
    } catch (err) {
      return { ok: false, provider: 'brevo', detail: err.message }
    }
  }

  // 3) Gmail SMTP via App Password
  if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
    try {
      const user = process.env.GMAIL_USER
      const pass = process.env.GMAIL_PASS.replace(/\s+/g, '')
      const result = await sendSmtpEmail({
        host: 'smtp.gmail.com',
        port: 465,
        user,
        pass,
        to: recipient,
        subject,
        text: textContent,
        html: htmlContent,
      })
      if (result.ok) return { ok: true, provider: 'gmail-smtp' }
      return { ok: false, provider: 'gmail-smtp', detail: result.detail }
    } catch (err) {
      return { ok: false, provider: 'gmail-smtp', detail: err.message }
    }
  }

  return {
    ok: false,
    provider: 'none',
    detail: 'No email service configured in server/.env',
  }
}

function sendSmtpEmail({ host, port, user, pass, to, subject, text, html }) {
  return new Promise((resolve) => {
    const socket = tls.connect(port, host, { rejectUnauthorized: false }, () => {
      let step = 0
      const commands = [
        `EHLO ${host}\r\n`,
        `AUTH LOGIN\r\n`,
        `${Buffer.from(user).toString('base64')}\r\n`,
        `${Buffer.from(pass).toString('base64')}\r\n`,
        `MAIL FROM:<${user}>\r\n`,
        `RCPT TO:<${to}>\r\n`,
        `DATA\r\n`,
      ]

      const mailBody = [
        `From: "Vishnu Portfolio" <${user}>`,
        `To: <${to}>`,
        `Subject: ${subject}`,
        `MIME-Version: 1.0`,
        `Content-Type: text/html; charset=utf-8`,
        ``,
        html || text,
        `\r\n.\r\n`,
      ].join('\r\n')

      socket.on('data', (data) => {
        const response = data.toString()

        if (step < commands.length) {
          socket.write(commands[step])
          step++
        } else if (step === commands.length) {
          socket.write(mailBody)
          step++
        } else {
          socket.write('QUIT\r\n')
          socket.end()
          if (response.startsWith('250') || response.startsWith('221')) {
            resolve({ ok: true })
          } else {
            resolve({ ok: false, detail: response.trim() })
          }
        }
      })
    })

    socket.on('error', (err) => {
      resolve({ ok: false, detail: err.message })
    })
  })
}
