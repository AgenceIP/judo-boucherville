# Deployment Checklist

## Before deploying:
- [ ] Set all env vars in Vercel dashboard (NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_READ_TOKEN, RESEND_API_KEY)
- [ ] Replace placeholder Google Form URL in /inscription (search for `1FAIpQLSf-placeholder`)
- [ ] Fix Google Maps embed URL in /contact (get real embed URL from Google Maps for 490 chemin du Lac, Boucherville)
- [ ] Add hero video at public/videos/hero.mp4
- [ ] Add hero fallback image at public/images/hero-fallback.jpg
- [ ] Add OG image at public/images/og-default.jpg (1200x630px dark image with club name)
- [ ] Populate all Sanity content via Studio at /studio (instructors, programmes, tournoi data)
- [ ] Update RESEND_API_KEY with production key from resend.com
- [ ] Verify Resend sender domain (judoboucherville.com) in Resend dashboard
- [ ] Run `npm run build` successfully

## Vercel deployment:
1. Push to GitHub
2. Import project at vercel.com
3. Add all env vars from .env.example
4. Deploy

## HostPapa deployment (if not using Vercel):
1. Run: npm run build
2. For static export, add `output: 'export'` to next.config.ts
3. Upload the /out folder to HostPapa via FTP/cPanel
