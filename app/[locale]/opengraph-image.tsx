import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Club de Judo Boucherville'

export default async function OgImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const bebas = await readFile(join(process.cwd(), 'public/fonts/BebasNeue-Regular.ttf'))
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 80, background: '#0A0A0A', color: '#FAFAFA', fontFamily: 'Bebas' }}>
        <div style={{ fontSize: 26, letterSpacing: 8, color: '#888888' }}>
          {locale === 'fr' ? 'Fondé en 1970 · Club reconnu AAA' : 'Founded in 1970 · AAA club'}
        </div>
        <div style={{ fontSize: 176, lineHeight: 0.9, marginTop: 24 }}>JUDO</div>
        <div style={{ fontSize: 176, lineHeight: 0.9 }}>BOUCHERVILLE</div>
        <div style={{ width: 160, height: 8, background: '#4169E1', marginTop: 40 }} />
      </div>
    ),
    { ...size, fonts: [{ name: 'Bebas', data: bebas, style: 'normal' }] },
  )
}
