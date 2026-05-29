type Props = {
  title: string
  subtitle?: string
  tag?: string
  tagColor?: string
}

export default function PageHero({ title, subtitle, tag, tagColor = 'text-accent-blue' }: Props) {
  return (
    <section className="pt-32 pb-16 bg-black border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {tag && (
          <span className={`text-xs font-heading tracking-widest uppercase ${tagColor} block mb-3`}>
            {tag}
          </span>
        )}
        <h1 className="font-heading text-6xl md:text-7xl lg:text-8xl text-white tracking-tight leading-none">
          {title}
        </h1>
        {subtitle && (
          <p className="text-muted text-lg mt-5 max-w-2xl">{subtitle}</p>
        )}
      </div>
    </section>
  )
}
