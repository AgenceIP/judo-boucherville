'use server'
import { Resend } from 'resend'

type ContactFormData = { nom: string; email: string; message: string; locale?: string }

const ERR = {
  requis: ['Tous les champs sont requis.', 'All fields are required.'],
  courriel: ['Adresse courriel invalide.', 'Invalid email address.'],
  nom: ['Le nom est trop long.', 'Name is too long.'],
  long: ['Le message est trop long (maximum 2000 caractères).', 'Message is too long (2,000 characters max).'],
  court: ['Le message est trop court.', 'Message is too short.'],
  envoi: [
    'L’envoi a échoué. Écrivez-nous directement à info@judoboucherville.com.',
    'Sending failed. Please email us directly at info@judoboucherville.com.',
  ],
} as const

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export async function sendContactEmail(data: ContactFormData): Promise<{ success: boolean; error?: string }> {
  const fail = (k: keyof typeof ERR) => ({ success: false, error: ERR[k][data.locale === 'en' ? 1 : 0] })
  if (!data.nom || !data.email || !data.message) return fail('requis')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return fail('courriel')
  if (data.nom.length > 100) return fail('nom')
  if (data.message.length > 2000) return fail('long')
  if (data.message.length < 10) return fail('court')
  // Without a key the Resend constructor throws, so never report success for an unsent message
  if (!process.env.RESEND_API_KEY) return fail('envoi')

  try {
    const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: 'Site web <noreply@judoboucherville.com>',
      to: 'info@judoboucherville.com',
      replyTo: data.email,
      subject: `Message de ${esc(data.nom)} — Site web`,
      html: `<h2>Nouveau message du site web</h2><p><strong>Nom:</strong> ${esc(data.nom)}</p><p><strong>Courriel:</strong> ${esc(data.email)}</p><p><strong>Message:</strong></p><p>${esc(data.message).replace(/\n/g, '<br>')}</p>`,
    })
    return error ? fail('envoi') : { success: true }
  } catch {
    return fail('envoi')
  }
}
