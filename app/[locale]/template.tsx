/**
 * Re-mounted by Next on every navigation: a short opacity fade so pages arrive
 * softly, with no exit animation fighting the router (the old PageTransition
 * did, and felt choppy).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-in">{children}</div>
}
