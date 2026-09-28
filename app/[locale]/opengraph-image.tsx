import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Club de Judo Boucherville'

/** Link preview: the real logo wall where the dojo tour lands, with one line of info. */
export default async function OgImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const fr = locale === 'fr'
  const [bebas, wall] = await Promise.all([
    readFile(join(process.cwd(), 'public/fonts/BebasNeue-Regular.ttf')),
    readFile(join(process.cwd(), 'public/hero/tour-ending.jpg')),
  ])
  const src = `data:image/jpeg;base64,${wall.toString('base64')}`
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', fontFamily: 'Bebas' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={1200} height={675} style={{ position: 'absolute', top: -20, left: 0, width: 1200, height: 675, objectFit: 'cover' }} alt="" />
        <div style={{ position: 'absolute', left: 48, bottom: 20, display: 'flex', flexDirection: 'column', background: '#F2B705', color: '#0B1B38', padding: '14px 24px 10px' }}>
          <div style={{ fontSize: 58, lineHeight: 1 }}>{fr ? 'Cours de judo dès 4 ans' : 'Judo classes from age 4'}</div>
          <div style={{ fontSize: 30, lineHeight: 1.1, marginTop: 6 }}>
            {fr ? 'Boucherville · Depuis 1970 · Club AAA' : 'Boucherville · Since 1970 · AAA club'}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: 'Bebas', data: bebas, style: 'normal' }] },
  )
}
