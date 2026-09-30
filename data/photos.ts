// The site's ambient photos (home sections, page heroes, tour ending on phones).
export type PhotoKey = 'murCjb' | 'murCjbLoin' | 'tatamiLong' | 'valeursRespect' | 'kano' | 'ceinturesNoires' | 'hautsGrades' | 'entree'

export const photosSite: Record<PhotoKey, { src: string; alt: string; altEn: string }> = {
  murCjb: {
    src: '/images/photos/mur-cjb.jpg',
    alt: 'Le logo du Club de Judo Boucherville peint sur le mur de bois du dojo',
    altEn: 'The Club de Judo Boucherville logo painted on the dojo’s wooden wall',
  },
  murCjbLoin: {
    src: '/images/photos/mur-cjb-loin.jpg',
    alt: 'Le mur du club et son logo, vus depuis le tatami jaune',
    altEn: 'The club wall and its logo, seen from the yellow tatami',
  },
  tatamiLong: {
    src: '/images/photos/tatami-long.jpg',
    alt: 'Le tatami du dojo, jaune et bleu, vu vers le mur du club',
    altEn: 'The yellow and blue tatami, looking toward the club wall',
  },
  valeursRespect: {
    src: '/images/photos/valeurs-respect.jpg',
    alt: 'Le mur des valeurs : Respect, Contrôle de soi, Amitié',
    altEn: 'The values wall: Respect, Self-control, Friendship',
  },
  kano: {
    src: '/images/photos/kano.jpg',
    alt: 'Portrait de Jigoro Kano, fondateur du judo, sous le mot Honneur',
    altEn: 'Portrait of Jigoro Kano, founder of judo, under the word Honour',
  },
  ceinturesNoires: {
    src: '/images/photos/ceintures-noires.jpg',
    alt: 'Le tableau des ceintures noires du club',
    altEn: 'The club’s black belt board',
  },
  hautsGrades: {
    src: '/images/photos/hauts-grades.jpg',
    alt: 'Le tableau des hauts gradés du club, sous le mot Sincérité',
    altEn: 'The club’s high-grades board, under the word Sincerity',
  },
  entree: {
    src: '/images/photos/entree.jpg',
    alt: 'Le dojo vu de l’entrée, le tatami et le mur du club au fond',
    altEn: 'The dojo from the entrance, the tatami and the club wall at the far end',
  },
}
