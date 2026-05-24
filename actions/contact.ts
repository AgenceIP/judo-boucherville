'use server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

type ContactFormData = { nom: string; email: string; message: string }

export async function sendContactEmail(data: ContactFormData): Promise<{ success: boolean; error?: string }> {
  if (!data.nom || !data.email || !data.message) {
    return { success: false, error: 'Tous les champs sont requis.' }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return { success: false, error: 'Adresse courriel invalide.' }
  }
  if (data.nom.length > 100) {
    return { success: false, error: 'Le nom est trop long.' }
  }
  if (data.message.length > 2000) {
    return { success: false, error: 'Le message est trop long (maximum 2000 caractères).' }
  }
  if (data.message.length < 10) {
    return { success: false, error: 'Le message est trop court.' }
  }
  const safeMessage = data.message
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')
  const safeName = data.nom.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const safeEmail = data.email.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  try {
    await resend.emails.send({
      from: 'Site web <noreply@judoboucherville.com>',
      to: 'info@judoboucherville.com',
      replyTo: data.email,
      subject: `Message de ${safeName} — Site web`,
      html: `<h2>Nouveau message du site web</h2><p><strong>Nom:</strong> ${safeName}</p><p><strong>Courriel:</strong> ${safeEmail}</p><p><strong>Message:</strong></p><p>${safeMessage}</p>`,
    })
    return { success: true }
  } catch {
    return { success: false, error: "Erreur lors de l'envoi. Veuillez réessayer." }
  }
}
