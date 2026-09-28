import PageHero from '@/components/shared/PageHero'

// ponytail: PDFs still served by the old site — copy them to /public before the DNS cutover
const OLD = 'https://judoboucherville.com/html/Download/'

const groupes: { titre: [string, string]; docs: { titre: string; href: string }[] }[] = [
  {
    titre: ['Programme technique', 'Technical programme'],
    docs: [
      { titre: 'Liste des techniques de judo du Kodokan', href: 'https://rise.articulate.com/share/mgkGB9ClG1C3dXe9_6BgM0jx6euzwGtr#/' },
      { titre: 'Aide-mémoire judo avec vidéos (Judo Québec)', href: 'https://judo-quebec.qc.ca/wp-content/uploads/2021/01/Aide-memoire-judo-avec-videos-v7.pdf' },
      { titre: 'Ceinture blanche', href: `${OLD}ceintureblanche.pdf` },
      { titre: 'Ceinture jaune', href: `${OLD}ceinturejaune.pdf` },
      { titre: 'Ceinture orange', href: `${OLD}ceintureorange.pdf` },
      { titre: 'Ceinture verte', href: `${OLD}ceintureverte.pdf` },
      { titre: 'Ceinture bleue', href: `${OLD}ceinturebleue.pdf` },
    ],
  },
  {
    titre: ['Compétition', 'Competition'],
    docs: [
      { titre: 'Préparation technique', href: `${OLD}PreparationTechnique.pdf` },
      { titre: 'Rapport de compétition', href: `${OLD}RapportdeCompetition.pdf` },
      { titre: 'Observation des adversaires', href: `${OLD}Observationdesadversaires.pdf` },
      { titre: 'Récupération et réchauffement', href: `${OLD}RecupetRechauf.pdf` },
      { titre: 'Calendrier Judo Québec 2026-2027', href: 'https://judo-quebec.qc.ca/files/Pages/repertoire%20des%20activit%C3%A9s/repertoire-activites-2026-2027%20publication%202026-06-26.pdf' },
    ],
  },
  {
    titre: ['Club', 'Club'],
    docs: [
      { titre: 'Règlements généraux du CJB', href: `${OLD}ReglementsGeneraux%20CJB.pdf` },
      { titre: 'Mises à jour des règlements généraux du CJB', href: `${OLD}MjRerglementGnereauxCJBI-2.pdf` },
    ],
  },
]

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return { title: locale === 'fr' ? 'Téléchargements' : 'Downloads' }
}

export default async function TelechargementsPage({ params }: Props) {
  const { locale } = await params
  const fr = locale === 'fr'

  return (
    <>
      <PageHero
        title={fr ? 'Téléchargements' : 'Downloads'}
        subtitle={fr
          ? 'Programmes techniques par ceinture, outils de compétition et règlements du club.'
          : 'Belt syllabi, competition tools and club bylaws (documents in French).'}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-14">
        {groupes.map(g => (
          <section key={g.titre[0]}>
            <h2 className="text-[10px] text-muted uppercase tracking-[.25em] border-b border-ink/10 pb-3">{g.titre[fr ? 0 : 1]}</h2>
            <ul>
              {g.docs.map(d => (
                <li key={d.href}>
                  <a href={d.href} target="_blank" rel="noopener noreferrer" className="group flex justify-between gap-6 border-b border-ink/10 py-4 text-ink hover:text-royal transition-colors">
                    {d.titre}
                    <span className="text-xs text-muted group-hover:text-royal shrink-0">{d.href.endsWith('.pdf') ? 'PDF ↗' : '↗'}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  )
}
