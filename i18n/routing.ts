// i18n/routing.ts — stub, will be replaced in Task 4
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['fr', 'en'],
  defaultLocale: 'fr',
})

export type Locale = (typeof routing.locales)[number]
