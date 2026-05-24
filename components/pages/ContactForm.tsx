'use client'
import { useState, useTransition } from 'react'
import { sendContactEmail } from '@/actions/contact'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export default function ContactForm() {
  const [pending, startTransition] = useTransition()
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = {
      nom: (form.elements.namedItem('nom') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    }
    startTransition(async () => {
      const result = await sendContactEmail(data)
      if (result.success) { setStatus('success'); form.reset() }
      else { setStatus('error'); setErrorMsg(result.error || 'Erreur inconnue.') }
    })
  }

  const inputClasses = 'w-full bg-bg-base border border-white/10 rounded-xl px-4 py-3 text-foreground text-sm focus:border-accent-blue focus:outline-none transition-colors placeholder:text-muted'

  if (status === 'success') {
    return (
      <div className="text-center py-12">
        <span className="text-4xl block mb-4">✓</span>
        <h3 className="font-heading text-2xl text-foreground mb-2">Message envoyé!</h3>
        <p className="text-muted">Nous vous répondrons dans les plus brefs délais.</p>
        <Button onClick={() => setStatus('idle')} variant="outline" className="mt-6">Envoyer un autre message</Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="contact-nom" className="text-xs text-muted uppercase tracking-wider block mb-2">Nom *</label>
        <input id="contact-nom" name="nom" type="text" required className={inputClasses} placeholder="Votre nom" />
      </div>
      <div>
        <label htmlFor="contact-email" className="text-xs text-muted uppercase tracking-wider block mb-2">Courriel *</label>
        <input id="contact-email" name="email" type="email" required className={inputClasses} placeholder="votre@email.com" />
      </div>
      <div>
        <label htmlFor="contact-message" className="text-xs text-muted uppercase tracking-wider block mb-2">Message *</label>
        <textarea id="contact-message" name="message" required rows={5} className={cn(inputClasses, 'resize-none')} placeholder="Votre message..." />
      </div>
      {status === 'error' && <p className="text-red-400 text-sm">{errorMsg}</p>}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? 'Envoi en cours...' : 'Envoyer le message'}
      </Button>
    </form>
  )
}
