// Relative imports only inside sanity/: the Sanity CLI does not know the @/ alias.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
export const apiVersion = '2026-09-01'
