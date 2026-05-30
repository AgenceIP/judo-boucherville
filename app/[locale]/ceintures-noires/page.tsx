import { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import PageHero from '@/components/shared/PageHero'

export const metadata: Metadata = { title: 'Ceintures noires' }

const ceintures: { annee: number; noms: string[] }[] = [
  { annee: 1972, noms: ['Claude Laverdure'] },
  { annee: 1974, noms: ['Gabriel Aimé', 'Serge Mainville'] },
  { annee: 1976, noms: ['Alain Langlois'] },
  { annee: 1979, noms: ['Jean Sergerie', 'Steven Zoni'] },
  { annee: 1980, noms: ['Serge Brouillard', 'Pierre Berthiaume'] },
  { annee: 1982, noms: ['Daniel Malartre'] },
  { annee: 1983, noms: ['Sylvain Hébert', 'Steve Potvin', 'Stéphane Lemaire', 'Roger Duclos', 'Jean Duclos'] },
  { annee: 1984, noms: ['Daniel De Angelis', 'Louis Mathurin', 'Jacques Sévigny'] },
  { annee: 1985, noms: ['Jean St-Pierre', 'Denis Cournoyer', 'Paul Leblanc', 'Steven Zoni Junior'] },
  { annee: 1986, noms: ['Rénald Gauthier', 'Josée Sarrazin', 'Normand Prud\'homme', 'Daniel Tourville'] },
  { annee: 1987, noms: ['Martin Boucher', 'Jocelyne Demers', 'Serge Côté'] },
  { annee: 1988, noms: ['Marc Trépanier', 'Claude Laflamme', 'Yvan Ouellet', 'Éric Derome', 'Jacques Derome', 'Wilfrid Cabana', 'Pascale Mainville', 'Martin Hébert'] },
  { annee: 1991, noms: ['Richard Coutu', 'Pierre Michel', 'Claude Morin', 'Lise Laflamme', 'Jean-François Labarre'] },
  { annee: 1992, noms: ['Gabriel Sénécal', 'Jean-François Lavoie', 'Sébastien Royer'] },
  { annee: 1993, noms: ['Nicolas Caron', 'Stéphane Cyr', 'Yanick Cyr', 'Ronnie Lemieux', 'Martin Lessard', 'Éric Poulain', 'Andrew Carr'] },
  { annee: 1994, noms: ['Dominique Tremblay', 'Thierry Michel', 'Peggy Donovan'] },
  { annee: 1995, noms: ['Jean-François Villemure'] },
  { annee: 1996, noms: ['Mohamed Kliché', 'Jean-François Llull', 'Jacques Dulude'] },
  { annee: 1997, noms: ['Isabelle Pearson'] },
  { annee: 1998, noms: ['Karl-Éric Seguin', 'Alexandre Roy'] },
  { annee: 1999, noms: ['Véronic Vallée-Granger', 'René Scotto', 'Sylvain Filion', 'Réjean Goulet', 'Daniel Michelin', 'Pierre Seguin'] },
  { annee: 2000, noms: ['Jean Levingston', 'Franklin Morales', 'Andréa Morales', 'Yves Plourde', 'Carl Légaré', 'Carsten Piske'] },
  { annee: 2001, noms: ['Pierre Péloquin', 'Jean Choquette', 'Arnaud Longhi'] },
  { annee: 2004, noms: ['Martin Grandé'] },
  { annee: 2006, noms: ['Charles Brosseau', 'Éric Camiré', 'Guillaume Perrault'] },
  { annee: 2007, noms: ['Valérie Morissette'] },
  { annee: 2008, noms: ['Patrick Gagné', 'Maxime Gagnon', 'Olivier-Aubin Mercier'] },
  { annee: 2009, noms: ['Benoit Arsenault-Dionne', 'Frédéric Bourque', 'Alexei Tchernychev', 'Dominique Côté', 'Michael Fortin-Demers'] },
  { annee: 2010, noms: ['Mathieu Côté'] },
  { annee: 2011, noms: ['Audrey Monette', 'Philippe Desjardins', 'Marie-Michèle Girard', 'Nicolas Larose', 'Tommy Juteau'] },
  { annee: 2012, noms: ['Salima Mesri'] },
  { annee: 2013, noms: ['Ana Laura Portuondo-Isasi', 'Gabriel Juteau'] },
  { annee: 2014, noms: ['Alain Dessureault', 'Artur Tchernychev', 'Adriana Portuondo-Isasi', 'Philippe Dorig'] },
  { annee: 2015, noms: ['Carolanne Vadnais', 'Laurie Monette', 'Jacob Valois', 'Jérémie Blain'] },
  { annee: 2016, noms: ['Mikael Darchen', 'Frédéric Lachance'] },
  { annee: 2017, noms: ['Jérome Lajoie', 'Olivier Legault', 'Jacob St-Jean'] },
  { annee: 2018, noms: ['Arnaud P-Valois'] },
  { annee: 2019, noms: ['Amira Bousbiat'] },
  { annee: 2023, noms: ['Hugo Levacher', 'Léanne Dussault', 'Méloize Perkinson', 'Catherine Toshkov', 'Vincent Roberge-Poitras', 'Sofiane Bousbiat'] },
  { annee: 2024, noms: ['Luc Bourque', 'Charline Bourque', 'Mélody Grenier'] },
  { annee: 2025, noms: ['Tristan Lapointe', 'Samuel Roberge-Poitras', 'Tristan Bourque', 'Gerardo Andrade'] },
]

const total = ceintures.reduce((acc, y) => acc + y.noms.length, 0)

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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

        <div className="text-center mb-16">
          <div className="font-heading text-[clamp(80px,12vw,140px)] text-royal leading-none">{total}</div>
          <p className="text-muted mt-2 tracking-widest uppercase text-sm">
            {locale === 'fr' ? 'Ceintures noires · 1972–2025' : 'Black Belts · 1972–2025'}
          </p>
        </div>

        <div className="space-y-8">
          {[...ceintures].reverse().map(({ annee, noms }) => (
            <div key={annee} className="flex gap-8 items-start border-t border-white/[0.06] pt-6">
              <div className="shrink-0 w-16">
                <span className="font-heading text-2xl text-royal">{annee}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {noms.map(nom => (
                  <span key={nom} className="text-foreground text-sm bg-white/[0.04] border border-white/[0.06] px-3 py-1.5">
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
