const MEDAL = { or: 'bg-[#e8c547]', argent: 'bg-[#c9ced6]', bronze: 'bg-[#c98a4b]' }
const MEDAL_EN = { or: 'gold', argent: 'silver', bronze: 'bronze' }

export function Medal({ kind, locale }: { kind: keyof typeof MEDAL; locale: string }) {
  return (
    <span role="img" aria-label={locale === 'fr' ? `médaille d’${kind}` : `${MEDAL_EN[kind]} medal`}
      className={`inline-block w-2.5 h-2.5 rounded-full align-middle mx-1 ${MEDAL[kind]}`} />
  )
}
