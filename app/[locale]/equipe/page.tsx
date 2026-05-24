import { getAllInstructeurs } from '@/sanity/queries/instructeurs'
import PageHero from '@/components/shared/PageHero'
import InstructorCard from '@/components/ui/InstructorCard'

export default async function EquipePage() {
  const instructeurs = await getAllInstructeurs()

  const grouped: Record<string, typeof instructeurs> = {
    judo: instructeurs.filter(i => i.disciplines?.includes('judo')),
    'aiki-jujitsu': instructeurs.filter(i => i.disciplines?.includes('aiki-jujitsu')),
    'jiu-jitsu-bresilien': instructeurs.filter(i => i.disciplines?.includes('jiu-jitsu-bresilien')),
  }

  return (
    <>
      <PageHero
        title="Notre équipe"
        subtitle="Instructeurs accrédités, passionnés et dévoués à votre progression."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {Object.entries(grouped).map(([key, group]) => (
          group.length > 0 && (
            <div key={key}>
              <h2 className="font-heading text-2xl text-muted tracking-widest uppercase mb-8 border-b border-white/5 pb-4">
                {key === 'judo' ? 'Judo' : key === 'aiki-jujitsu' ? 'Aiki Ju-Jitsu' : 'Jiu-Jitsu Brésilien'}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {group.map(instr => (
                  <InstructorCard
                    key={instr._id}
                    nom={instr.nom}
                    grade={instr.grade}
                    role={instr.role}
                    disciplines={instr.disciplines || []}
                    slug={instr.slug.current}
                    photo={instr.photo}
                  />
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    </>
  )
}
