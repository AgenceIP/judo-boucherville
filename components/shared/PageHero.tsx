type Props = {
  title: string
  subtitle?: string
  tag?: string
  tagColor?: string
}

export default function PageHero({ title, subtitle, tag, tagColor = 'text-accent-blue' }: Props) {
  return (
    <section className="pt-32 pb-16 bg-bg-base relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent-blue/5 blur-3xl rounded-full" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {tag && (
          <span className={`text-xs font-semibold uppercase tracking-widest ${tagColor} block mb-3`}>
            {tag}
          </span>
        )}
        <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl text-foreground tracking-wider">
          {title}
        </h1>
        {subtitle && (
          <p className="text-muted text-lg mt-4 max-w-2xl">{subtitle}</p>
        )}
      </div>
    </section>
  )
}
