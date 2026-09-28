'use client'
import { useState, useTransition } from 'react'
import { useLocale } from 'next-intl'
import { sendContactEmail } from '@/actions/contact'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export default function ContactForm() {
  const locale = useLocale()
  const fr = locale === 'fr'
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
      locale,
    }
    startTransition(async () => {
      const result = await sendContactEmail(data)
      if (result.success) { setStatus('success'); form.reset() }
      else { setStatus('error'); setErrorMsg(result.error ?? '') }
    })
  }

  const inputClasses = 'w-full bg-transparent border-b border-ink/15 px-0 py-3 text-foreground text-sm focus:border-royal focus:outline-none transition-colors placeholder:text-muted/60'
  const labelClasses = 'text-[.78rem] text-muted uppercase tracking-[.25em] block mb-1'

  if (status === 'success') {
    return (
      <div role="status" className="border border-ink/10 p-8">
        <h3 className="font-heading text-2xl text-foreground mb-2">{fr ? 'Message envoyé' : 'Message sent'}</h3>
        <p className="text-muted text-sm">{fr ? 'Nous vous répondrons dans les plus brefs délais.' : 'We’ll get back to you as soon as possible.'}</p>
        <Button onClick={() => setStatus('idle')} variant="outline" size="sm" className="mt-6">
          {fr ? 'Envoyer un autre message' : 'Send another message'}
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <label htmlFor="contact-nom" className={labelClasses}>{fr ? 'Nom' : 'Name'} *</label>
        <input id="contact-nom" name="nom" type="text" required maxLength={100} autoComplete="name" className={inputClasses} />
      </div>
      <div>
        <label htmlFor="contact-email" className={labelClasses}>{fr ? 'Courriel' : 'Email'} *</label>
        <input id="contact-email" name="email" type="email" required autoComplete="email" className={inputClasses} />
      </div>
      <div>
        <label htmlFor="contact-message" className={labelClasses}>Message *</label>
        <textarea id="contact-message" name="message" required minLength={10} maxLength={2000} rows={5} className={cn(inputClasses, 'resize-none')} />
      </div>
      {status === 'error' && <p role="alert" className="text-red-400 text-sm">{errorMsg}</p>}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? (fr ? 'Envoi…' : 'Sending…') : (fr ? 'Envoyer le message' : 'Send message')}
      </Button>
    </form>
  )
}
