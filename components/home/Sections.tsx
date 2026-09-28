import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Phone, Mail, ArrowUpRight, ArrowRight } from 'lucide-react'
import { club, inscription, palmares, totalPalmares } from '@/data/club'
import RevealText from '@/components/ui/RevealText'
import AnimatedCounter from '@/components/ui/AnimatedCounter'
import Magnetic from '@/components/ui/Magnetic'

const tel = `tel:+1${club.tel.replace(/\D/g, '')}`

/** A photo that opens like a sliding door, then drifts slower than the page */
function Photo({ src, alt, className = '', sizes }: { src: string; alt: string; className?: string; sizes: string }) {
  return (
    <figure className={`clip-reveal relative rounded-[4px] ${className}`}>
      <div className="inner absolute inset-0">
        <div data-parallax className="absolute inset-x-0 -top-[8%] h-[116%]">
          <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
        </div>
      </div>
    </figure>
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
    <section className="on-dark bg-ink text-panel py-20 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <RevealText as="h2" className="display text-[clamp(3rem,7vw,6rem)] max-w-[12ch]">
            {fr ? 'S’inscrire en trois temps' : 'Sign up in three moves'}
          </RevealText>
          <div className="flex flex-wrap gap-3">
            <Magnetic strength={0.25}>
              <Link href={`/${locale}/inscription`} className="btn btn-primary">
                {fr ? `Inscription ${inscription.saison}` : `Registration ${inscription.saison}`} <ArrowRight size={16} aria-hidden="true" className="arr" />
              </Link>
            </Magnetic>
            <Link href={`/${locale}/inscription#tarifs`} className="btn btn-ghost-light">{fr ? 'Tous les tarifs' : 'All fees'}</Link>
          </div>
        </div>

        <ol className="mt-16 grid md:grid-cols-3 gap-x-10 gap-y-12">
          {steps.map(([title, text], i) => (
            <li key={title} data-reveal-seam className="step relative" style={{ '--i': i } as React.CSSProperties}>
              <span aria-hidden="true" className="step-num display block text-[clamp(7rem,14vw,11rem)] leading-[.8]" data-n={i + 1}>{i + 1}</span>
              <h3 className="mt-6 text-[1.3rem] font-semibold leading-snug">{title}</h3>
              <p className="mt-2 text-panel/75 leading-relaxed max-w-[40ch]">{text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-20 grid lg:grid-cols-[.6fr_1.4fr] gap-8">
          <h3 className="display text-[2.2rem] text-accent">{fr ? 'Début des cours' : 'Classes start'}</h3>
          <ul className="cascade grid sm:grid-cols-2 gap-x-10">
            {inscription.debutCours.map(([cFr, cEn, dFr, dEn], i) => (
              <li key={cFr} style={{ '--i': i } as React.CSSProperties} className="flex items-baseline justify-between gap-4 border-t border-panel/15 py-3">
                <span>{fr ? cFr : cEn}</span>
                <span className="tabular-nums text-panel/75 text-right">{fr ? dFr : dEn}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-10 text-panel/70">{fr ? 'Tous nos professeurs sont accrédités. Aucun bénévole.' : 'All our coaches are accredited. No volunteers.'}</p>
      </div>
    </section>
  )
}

export function Dojo({ locale }: { locale: string }) {
  const fr = locale === 'fr'
  return (
    <section className="bg-panel py-20 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-10 items-end">
          <RevealText as="h2" className="display text-[clamp(3rem,7vw,6rem)] text-ink">{club.dojo}</RevealText>
          <p className="text-[1.15rem] leading-relaxed text-ink-2 max-w-[46ch]">
            {fr
              ? `Au ${club.lieu}, 490, chemin du Lac. Un grand tatami jaune et bleu, les huit valeurs du judo sur les murs, le portrait de Jigoro Kano et le tableau des ceintures noires du club.`
              : `Inside the ${club.lieu}, 490 chemin du Lac. A large yellow and blue tatami, the eight values of judo on the walls, a portrait of Jigoro Kano and the club’s black belt board.`}
          </p>
        </div>

        <div className="mt-14 grid grid-cols-6 md:grid-rows-[18rem_18rem] gap-3 lg:gap-4">
          <Photo src="/images/photos/tatami-long.jpg" alt={fr ? 'Le tatami du dojo, jaune et bleu, vu vers le mur du club' : 'The yellow and blue tatami, looking toward the club wall'} className="col-span-6 md:col-span-3 md:row-span-2 aspect-[4/5] md:aspect-auto" sizes="(min-width: 768px) 50vw, 100vw" />
          <Photo src="/images/photos/valeurs-respect.jpg" alt={fr ? 'Le mur des valeurs : Respect, Contrôle de soi, Amitié' : 'The values wall: Respect, Self-control, Friendship'} className="col-span-6 md:col-span-3 aspect-[16/9] md:aspect-auto" sizes="(min-width: 768px) 50vw, 100vw" />
          <Photo src="/images/photos/kano.jpg" alt={fr ? 'Portrait de Jigoro Kano, fondateur du judo, sous le mot Honneur' : 'Portrait of Jigoro Kano, founder of judo, under the word Honour'} className="col-span-3 md:col-span-1 aspect-[3/4] md:aspect-auto" sizes="(min-width: 768px) 17vw, 50vw" />
          <Photo src="/images/photos/ceintures-noires.jpg" alt={fr ? 'Le tableau des ceintures noires du club' : 'The club’s black belt board'} className="col-span-3 md:col-span-2 aspect-[3/4] md:aspect-auto" sizes="(min-width: 768px) 33vw, 50vw" />
        </div>
      </div>
    </section>
  )
}

export function Palmares({ locale }: { locale: string }) {
  const fr = locale === 'fr'
  const [or, argent, bronze] = totalPalmares
  return (
    <section className="on-dark bg-blue text-panel py-20 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <p className="display text-[clamp(2.6rem,6vw,5.2rem)] !leading-[.98] max-w-[16ch]">
          {fr ? 'Depuis 2002, nos judokas ont rapporté ' : 'Since 2002, our judoka have brought home '}
          <span className="text-accent tabular-nums"><AnimatedCounter end={or + argent + bronze} /></span>
          {fr ? ' médailles.' : ' medals.'}
        </p>
        <p className="mt-6 text-[1.15rem] text-panel/85 max-w-[52ch]">
          {fr
            ? `Aux championnats provinciaux et canadiens : ${or} en or, ${argent} en argent, ${bronze} en bronze. Club reconnu AAA par Judo Québec, entraîneur-chef ${club.responsable}, 7e dan.`
            : `At provincial and national championships: ${or} gold, ${argent} silver, ${bronze} bronze. An AAA club recognized by Judo Québec, head coach ${club.responsable}, 7th dan.`}
        </p>

        <div className="mt-14 overflow-x-auto">
          <table className="w-full min-w-[34rem] text-left">
            <caption className="sr-only">{fr ? 'Médailles par championnat, 2002 à 2024' : 'Medals by championship, 2002 to 2024'}</caption>
            <thead>
              <tr className="text-panel/75 text-[.9rem]">
                <th scope="col" className="font-semibold pb-3">{fr ? 'Championnat' : 'Championship'}</th>
                {[['Or', 'Gold', 'bg-accent'], ['Argent', 'Silver', 'bg-[#cfd6e2]'], ['Bronze', 'Bronze', 'bg-[#c98a4b]']].map(([f, e, bg]) => (
                  <th key={f} scope="col" className="font-semibold pb-3 w-24 text-right">
                    <span className={`inline-block w-3 h-3 rounded-full mr-2 align-middle ${bg}`} aria-hidden="true" />{fr ? f : e}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="cascade">
              {palmares.map(([nom, en, o, a, b], i) => (
                <tr key={nom} style={{ '--i': i } as React.CSSProperties} className="border-t border-panel/15 transition-colors hover:bg-panel/5">
                  <th scope="row" className="py-3.5 pr-4 font-semibold">{fr ? nom : en}</th>
                  <td className="py-3.5 text-right display text-[1.7rem] leading-none text-accent tabular-nums">{o}</td>
                  <td className="py-3.5 text-right display text-[1.7rem] leading-none tabular-nums">{a}</td>
                  <td className="py-3.5 text-right display text-[1.7rem] leading-none text-[#e9b27d] tabular-nums">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-[1rem]">
          {[['resultats', 'Tous les résultats', 'All results'], ['equipe', 'Nos professeurs', 'Our coaches'], ['ceintures-noires', 'Ceintures noires', 'Black belts'], ['challenge', 'Le Challenge', 'The Challenge']].map(([href, f, e]) => (
            <Link key={href} href={`/${locale}/${href}`} className="u-line inline-flex items-center gap-1 font-semibold text-panel">
              {fr ? f : e} <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          ))}
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
    <section className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 grid lg:grid-cols-[.8fr_1.2fr] gap-10 lg:gap-20">
        <div className="lg:sticky lg:top-28 self-start">
          <RevealText as="h2" className="display text-[clamp(3rem,7vw,6rem)] text-ink">{fr ? 'Vos questions' : 'Your questions'}</RevealText>
          <p className="mt-5 text-ink-2 text-[1.05rem] max-w-[34ch]">
            {fr ? 'Pas trouvé? Appelez le ' : 'Not here? Call '}
            <a href={tel} className="u-line font-semibold text-ink tabular-nums">{club.tel}</a>.
          </p>
        </div>
        <div className="cascade border-t border-ink/15">
          {qa.map(([q, a], i) => (
            <details key={q} style={{ '--i': i } as React.CSSProperties} className="group border-b border-ink/15">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[1.15rem] font-semibold text-ink transition-colors hover:text-blue [&::-webkit-details-marker]:hidden">
                {q}
                <span aria-hidden="true" className="grid place-items-center w-9 h-9 shrink-0 rounded-full bg-ink text-panel text-xl leading-none transition-[transform,background-color,color] duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-open:rotate-[135deg] group-open:bg-accent group-open:text-ink">+</span>
              </summary>
              <p className="pb-6 pr-14 text-ink-2 leading-relaxed text-[1.02rem]">{a}</p>
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
    <section className="bg-accent py-20 lg:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div>
          <RevealText as="h2" className="display text-[clamp(3rem,7vw,6rem)] text-ink">{fr ? 'On se voit sur le tatami' : 'See you on the mat'}</RevealText>
          <ul className="mt-9 grid gap-4 text-[1.1rem] text-ink">
            <li className="flex gap-3">
              <MapPin className="mt-1 shrink-0" size={20} aria-hidden="true" />
              <a href={map} target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4">
                <span className="font-semibold block">{club.dojo}, {club.lieu}</span>
                {club.adresse}
              </a>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-1 shrink-0" size={20} aria-hidden="true" />
              <a href={tel} className="u-line font-semibold tabular-nums">{club.tel}</a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-1 shrink-0" size={20} aria-hidden="true" />
              <a href={`mailto:${club.courriel}`} className="u-line">{club.courriel}</a>
            </li>
          </ul>
          <div className="mt-9 flex flex-wrap gap-3">
            <Magnetic strength={0.25}>
              <a href={map} target="_blank" rel="noopener noreferrer" className="btn btn-blue">{fr ? 'Itinéraire' : 'Directions'} <ArrowRight size={16} aria-hidden="true" className="arr" /></a>
            </Magnetic>
            <Link href={`/${locale}/contact`} className="btn btn-ghost">{fr ? 'Nous écrire' : 'Write to us'}</Link>
          </div>
        </div>
        <Photo src="/images/photos/entree.jpg" alt={fr ? 'Le dojo vu de l’entrée, le tatami et le mur du club au fond' : 'The dojo from the entrance, the tatami and the club wall at the far end'} className="aspect-[4/3]" sizes="(min-width: 1024px) 50vw, 100vw" />
      </div>
    </section>
  )
}
