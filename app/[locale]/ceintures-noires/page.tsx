import { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import PageHero from '@/components/shared/PageHero'
import BlackBeltConstellation from '@/components/pages/BlackBeltConstellation'
import { ceintures, totalCeintures as total } from '@/data/ceintures-noires'

export const metadata: Metadata = { title: 'Ceintures noires' }

export default async function CeinturesNoiresPage() {
  const locale = await getLocale()

  return (
    <>
      <PageHero
        title={locale === 'fr' ? 'Ceintures noires' : 'Black Belts'}
        subtitle={locale === 'fr'
          ? `${total} ceintures noires formées depuis la fondation du club en 1970.`
          : `${total} black belts trained since the club's founding in 1970.`}
        tag="Palmarès"
      />

      {/* The lineage as a night sky — every star is a real black belt */}
      <BlackBeltConstellation ceintures={ceintures} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

        <div className="text-center mb-16">
          <div className="font-heading text-[clamp(80px,12vw,140px)] text-royal leading-none">{total}</div>
          <p className="text-muted mt-2 tracking-widest uppercase text-sm">
            {locale === 'fr' ? 'Ceintures noires · 1972–2025' : 'Black Belts · 1972–2025'}
          </p>
        </div>

        <div className="space-y-8">
          {[...ceintures].reverse().map(({ annee, noms }) => (
            <div key={annee} className="flex gap-8 items-start border-t border-foreground/15 pt-6">
              <div className="shrink-0 w-16">
                <span className="font-heading text-2xl text-royal">{annee}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {noms.map(nom => (
                  <span key={nom} className="text-foreground text-sm bg-foreground/[0.05] border border-foreground/15 px-3 py-1.5">
                    {nom}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
