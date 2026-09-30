import { it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Contenu from '../Contenu'
import type { Bloc } from '@/lib/content/types'

const s = (text: string, marks: string[] = []) => ({ _type: 'span' as const, _key: text, text, marks })
const lien = (href: string, children: Extract<Bloc, { _type: 'block' }>['children']): Bloc =>
  ({ _type: 'block', _key: href, style: 'normal', children, markDefs: [{ _key: 'l', _type: 'link', href }] })

it('a line that is only a link renders like the old standalone link, medals included', () => {
  render(<Contenu locale="fr" alt="x" contenu={[lien('https://judo.org/r', [s('Résultats complets', ['l']), { _type: 'medaille', _key: 'm', kind: 'or' }, s('', ['l'])])]} />)
  const a = screen.getByRole('link')
  expect(a).toHaveAttribute('href', 'https://judo.org/r')
  expect(a).toHaveClass('inline-block', 'break-all')
  expect(a).toHaveTextContent('Résultats complets ↗')
  expect(screen.getByRole('img', { name: 'médaille d’or' })).toBeInTheDocument()
})

it('a link inside a sentence stays in the sentence, localized when internal', () => {
  render(<Contenu locale="en" alt="x" contenu={[{ _type: 'block', _key: 'p', style: 'normal',
    markDefs: [{ _key: 'l', _type: 'link', href: '/inscription' }], children: [s('Voir '), s('inscription', ['l']), s('.')] }]} />)
  const a = screen.getByRole('link')
  expect(a).toHaveAttribute('href', '/en/inscription')
  expect(a.closest('p')).toHaveTextContent('Voir inscription.')
})

it('renders headings, bold, the medal tally and small logos', () => {
  const { container } = render(<Contenu locale="fr" alt="Logo" contenu={[
    { _type: 'block', _key: 'h', style: 'h4', children: [s('Coupe Canada')] },
    { _type: 'block', _key: 'p', style: 'normal', children: [s('Léa', ['strong']), s(' 1re')] },
    { _type: 'bilanMedailles', _key: 'b', or: 2, argent: 0, bronze: 1 },
    { _type: 'image', _key: 'i', src: '/images/logo.png', w: 200, h: 100, petit: true },
  ]} />)
  expect(container.querySelector('h4')).toHaveTextContent('Coupe Canada')
  expect(container.querySelector('strong')).toHaveTextContent('Léa')
  const bilan = container.querySelector('p.tabular-nums')!
  expect(bilan).toHaveTextContent('201')
  expect(bilan.querySelectorAll('[role=img]')).toHaveLength(3)
  expect(screen.getByAltText('Logo')).toHaveClass('h-20')
})
