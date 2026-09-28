import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Phone, Mail, ArrowUpRight } from 'lucide-react'
import { club, inscription, totalPalmares } from '@/data/club'

const tel = `tel:+1${club.tel.replace(/\D/g, '')}`

/** Section heading with a tatami seam that draws itself when the section enters */
function Heading({ kicker, title, light }: { kicker: string; title: string; light?: boolean }) {
  return (
    <div data-reveal-seam>
      <p className={`label ${light ? 'text-accent' : 'text-blue'}`}>{kicker}</p>
      <h2 className={`mt-3 font-display font-extrabold uppercase text-[clamp(2.6rem,5.5vw,4.5rem)] leading-[.88] ${light ? 'text-panel' : 'text-ink'}`}>
        {title}
      </h2>
      <span aria-hidden="true" className={`seam mt-6 block h-[3px] w-24 ${light ? 'bg-accent' : 'bg-blue'}`} />
    </div>
  )
}

export function Steps({ locale }: { locale: string }) {
  const fr = locale === 'fr'
  const steps = fr
    ? [
        ['Remplissez le formulaire en ligne', 'Un formulaire par programme. Trouvez le vôtre avec l’outil plus haut ou sur la page Inscription.'],
        ['Payez par chèque ou virement Interac', inscription.paiement],
        ['Présentez-vous au premier cours', 'En judogi et sandales. Les dates de début sont juste en dessous.'],
      ]
    : [
        ['Fill in the online form', 'One form per program. Find yours with the tool above or on the Registration page.'],
        ['Pay by cheque or Interac e-transfer', inscription.paiementEn],
        ['Show up for your first class', 'In judogi and sandals. Start dates are right below.'],
      ]
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 grid lg:grid-cols-[.9fr_1.1fr] gap-12 lg:gap-20">
        <div>
          <Heading kicker={fr ? `Inscription ${inscription.saison}` : `Registration ${inscription.saison}`} title={fr ? 'Trois étapes' : 'Three steps'} />
          <p className="mt-6 text-ink-2 max-w-[42ch]">
            {fr ? 'Tous nos professeurs sont accrédités. Aucun bénévole.' : 'All our coaches are accredited. No volunteers.'}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`/${locale}/inscription`} className="btn btn-primary">{fr ? 'Page Inscription' : 'Registration page'}</Link>
            <Link href={`/${locale}/inscription#tarifs`} className="btn btn-ghost">{fr ? 'Tous les tarifs' : 'All fees'}</Link>
          </div>
        </div>
        <ol className="grid gap-[3px] bg-ink/10 p-[3px] rounded-[6px]">
          {steps.map(([title, text], i) => (
            <li key={title} className="grid grid-cols-[4.5rem_1fr] gap-4 bg-panel rounded-[3px] p-5 sm:p-6">
              <span className="font-display font-extrabold text-[3.4rem] leading-[.8] text-blue">{i + 1}</span>
              <div>
                <h3 className="text-[1.15rem] font-semibold text-ink">{title}</h3>
                <p className="mt-1.5 text-ink-2 leading-relaxed">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-12">
        <h3 className="label text-ink">{fr ? 'Début des cours' : 'Classes start'}</h3>
        <ul className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8">
          {inscription.debutCours.map(([cFr, cEn, dFr, dEn]) => (
            <li key={cFr} className="flex items-baseline justify-between gap-4 border-t border-ink/10 py-2.5">
              <span className="text-ink">{fr ? cFr : cEn}</span>
              <span className="font-mono text-[.85rem] text-ink-2 text-right">{fr ? dFr : dEn}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

const VALUES = [
  ['礼儀', 'Politesse', 'Courtesy'], ['勇気', 'Courage', 'Courage'], ['誠意', 'Sincérité', 'Sincerity'], ['名誉', 'Honneur', 'Honour'],
  ['謙虚', 'Modestie', 'Modesty'], ['尊敬', 'Respect', 'Respect'], ['自制', 'Contrôle de soi', 'Self-control'], ['友情', 'Amitié', 'Friendship'],
]

export function Dojo({ locale }: { locale: string }) {
  const fr = locale === 'fr'
  const photos: [string, string, string, string][] = [
    ['/images/photos/tatami-long.jpg', 'Le tatami du dojo, jaune et bleu', 'The dojo tatami, yellow and blue', 'row-span-2'],
    ['/images/photos/valeurs-respect.jpg', 'Le mur des valeurs : Respect, Contrôle de soi, Amitié', 'The values wall: Respect, Self-control, Friendship', 'col-span-2'],
    ['/images/photos/kano.jpg', 'Portrait de Jigoro Kano, fondateur du judo', 'Portrait of Jigoro Kano, founder of judo', ''],
    ['/images/photos/ceintures-noires.jpg', 'Le tableau des ceintures noires du club', 'The club’s black belt board', ''],
  ]
  return (
    <section className="py-20 lg:py-28 bg-blue text-panel overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-10 items-end">
          <Heading kicker={fr ? '490, chemin du Lac' : '490 chemin du Lac'} title={club.dojo} light />
          <p className="text-[1.1rem] leading-relaxed text-panel/85 max-w-[48ch]">
            {fr
              ? `Au ${club.lieu}. Un grand tatami, des murs qui portent le code moral du judo, et le tableau des ceintures noires du club.`
              : `Inside the ${club.lieu}. A large tatami, walls that carry judo’s moral code, and the club’s black belt board.`}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-[3px] bg-[#0b3474] p-[3px] rounded-[6px] lg:h-[40rem]">
          {photos.map(([src, altFr, altEn, span]) => (
            <figure key={src} className={`relative min-h-[14rem] overflow-hidden rounded-[3px] ${span}`}>
              <Image src={src} alt={fr ? altFr : altEn} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover transition-transform duration-[1.2s] ease-out hover:scale-[1.03]" />
            </figure>
          ))}
        </div>

        <ul className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-y-6 gap-x-4" aria-label={fr ? 'Le code moral du judo' : 'The moral code of judo'}>
          {VALUES.map(([kanji, vFr, vEn]) => (
            <li key={vFr} className="border-t border-panel/25 pt-3">
              <span className="font-jp text-[1.1rem] text-accent" aria-hidden="true">{kanji}</span>
              <span className="block mt-1 font-display font-bold uppercase text-[1.6rem] leading-none">{fr ? vFr : vEn}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function Proof({ locale }: { locale: string }) {
  const fr = locale === 'fr'
  const medals = totalPalmares[0] + totalPalmares[1] + totalPalmares[2]
  const items: [string, string, string][] = fr
    ? [
        ['AAA', 'Club reconnu AAA', 'par Judo Québec'],
        [String(medals), 'Médailles', 'provinciales et canadiennes depuis 2002'],
        ['7e dan', 'Entraîneur-chef', `${club.responsable}`],
        ['1970', 'Depuis', 'plus de 55 ans de judo à Boucherville'],
      ]
    : [
        ['AAA', 'AAA club', 'recognized by Judo Québec'],
        [String(medals), 'Medals', 'provincial and national since 2002'],
        ['7th dan', 'Head coach', `${club.responsable}`],
        ['1970', 'Since', 'over 55 years of judo in Boucherville'],
      ]
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <Heading kicker={fr ? 'Pourquoi ici' : 'Why here'} title={fr ? 'Un club qui gagne. Et qui enseigne.' : 'A club that wins. And teaches.'} />
        <dl className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-[3px] bg-ink/10 p-[3px] rounded-[6px]">
          {items.map(([big, label, detail]) => (
            <div key={label} className="bg-panel rounded-[3px] p-6 flex flex-col">
              <dt className="order-2 mt-3">
                <span className="block text-[1.05rem] font-semibold text-ink">{label}</span>
                <span className="block text-[.95rem] text-ink-2">{detail}</span>
              </dt>
              <dd className="order-1 font-display font-extrabold text-[clamp(3.2rem,5vw,4.6rem)] leading-[.85] text-blue">{big}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-[.95rem]">
          <Link href={`/${locale}/resultats`} className="inline-flex items-center gap-1 font-semibold text-blue hover:text-ink">{fr ? 'Résultats' : 'Results'} <ArrowUpRight size={16} aria-hidden="true" /></Link>
          <Link href={`/${locale}/equipe`} className="inline-flex items-center gap-1 font-semibold text-blue hover:text-ink">{fr ? 'Nos professeurs' : 'Our coaches'} <ArrowUpRight size={16} aria-hidden="true" /></Link>
          <Link href={`/${locale}/ceintures-noires`} className="inline-flex items-center gap-1 font-semibold text-blue hover:text-ink">{fr ? 'Ceintures noires' : 'Black belts'} <ArrowUpRight size={16} aria-hidden="true" /></Link>
          <Link href={`/${locale}/challenge`} className="inline-flex items-center gap-1 font-semibold text-blue hover:text-ink">Challenge <ArrowUpRight size={16} aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
  )
}

export function Faq({ locale }: { locale: string }) {
  const fr = locale === 'fr'
  const qa: [string, string][] = fr
    ? [
        ['À partir de quel âge?', 'Dès 4 ans avec le cours Parents / enfants (nés de 2019 à 2022). Le parent est inscrit gratuitement. Les enfants seuls commencent dès 5 ans avec le cours débutant du samedi.'],
        ['Mon enfant est timide (ou très actif). Est-ce pour lui?', 'Oui. On apprend d’abord à tomber sans se faire mal, puis à respecter son partenaire. Les timides prennent confiance. Les plus énergiques apprennent les règles.'],
        ['Est-ce sécuritaire?', 'La première chose qu’on apprend au judo, c’est la chute. Les cours sont adaptés à chaque âge, et tous nos professeurs sont accrédités, aucun bénévole.'],
        ['Je suis adulte et débutant. Est-ce trop tard?', 'Non. Le cours Judo adultes accueille débutants et avancés. Un ou deux cours par semaine suffisent pour progresser. Dès 50 ans, le programme Prévention des chutes est fait pour vous.'],
        ['Quel équipement faut-il?', 'Un judogi (habit de judo), des sandales et la Carte d’Accès Boucherville. Les détails sont donnés à l’inscription.'],
        ['Comment payer?', inscription.paiement],
        ['Peut-on essayer avant de s’inscrire?', 'Le Jiu-Jitsu brésilien offre un essai gratuit le mardi et le jeudi. Pour les autres cours, appelez-nous au 450 655-1888.'],
        ['Les horaires peuvent-ils changer?', 'Oui, selon le nombre d’inscriptions. En cas de doute, appelez-nous au 450 655-1888.'],
      ]
    : [
        ['From what age?', 'From age 4 with the Parents & children class (born 2019 to 2022). The parent joins free. Children on their own start at 5 with the Saturday beginner class.'],
        ['My child is shy (or very active). Is judo for them?', 'Yes. First we learn to fall without getting hurt, then to respect our partner. Shy kids gain confidence. Energetic kids learn the rules.'],
        ['Is it safe?', 'The first thing you learn in judo is how to fall. Classes are adapted to each age, and all our coaches are accredited, no volunteers.'],
        ['I’m an adult beginner. Is it too late?', 'No. Adult judo welcomes beginners and advanced students. One or two classes a week is enough to progress. From age 50, the Fall prevention program is made for you.'],
        ['What equipment do I need?', 'A judogi (judo uniform), sandals and the Boucherville Access Card. Details are given at registration.'],
        ['How do I pay?', inscription.paiementEn],
        ['Can I try before registering?', 'Brazilian Jiu-Jitsu offers a free trial on Tuesdays and Thursdays. For other classes, call us at 450 655-1888.'],
        ['Can schedules change?', 'Yes, depending on the number of registrations. If in doubt, call us at 450 655-1888.'],
      ]
  return (
    <section className="py-20 lg:py-28 bg-panel">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 grid lg:grid-cols-[.8fr_1.2fr] gap-10 lg:gap-20">
        <Heading kicker="FAQ" title={fr ? 'Vos questions' : 'Your questions'} />
        <div className="divide-y divide-ink/10 border-y border-ink/10">
          {qa.map(([q, a]) => (
            <details key={q} className="group py-1">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[1.1rem] font-semibold text-ink [&::-webkit-details-marker]:hidden">
                {q}
                <span aria-hidden="true" className="grid place-items-center w-8 h-8 shrink-0 rounded-full bg-canvas text-blue transition-transform duration-300 group-open:rotate-45">+</span>
              </summary>
              <p className="pb-5 pr-12 text-ink-2 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

export function FindUs({ locale }: { locale: string }) {
  const fr = locale === 'fr'
  const map = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(club.adresse)}`
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div>
          <Heading kicker={fr ? 'Nous trouver' : 'Find us'} title={fr ? 'Au bord du tatami' : 'See you on the mat'} />
          <ul className="mt-8 grid gap-4 text-[1.05rem]">
            <li className="flex gap-3">
              <MapPin className="mt-1 shrink-0 text-blue" size={20} aria-hidden="true" />
              <a href={map} target="_blank" rel="noopener noreferrer" className="text-ink hover:text-blue">
                <span className="font-semibold block">{club.dojo}, {club.lieu}</span>
                {club.adresse}
              </a>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-1 shrink-0 text-blue" size={20} aria-hidden="true" />
              <a href={tel} className="font-mono text-ink hover:text-blue">{club.tel}</a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-1 shrink-0 text-blue" size={20} aria-hidden="true" />
              <a href={`mailto:${club.courriel}`} className="text-ink hover:text-blue">{club.courriel}</a>
            </li>
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={map} target="_blank" rel="noopener noreferrer" className="btn btn-blue">{fr ? 'Itinéraire' : 'Directions'}</a>
            <Link href={`/${locale}/contact`} className="btn btn-ghost">{fr ? 'Nous écrire' : 'Write to us'}</Link>
          </div>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[6px]">
          <Image src="/images/photos/entree.jpg" alt={fr ? 'Le dojo vu de l’entrée' : 'The dojo seen from the entrance'} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>
      </div>
    </section>
  )
}
