type Props = { value?: string }

export default function RichText({ value }: Props) {
  if (!value) return null
  return (
    <div>
      {value.split('\n\n').map((para, i) => (
        <p key={i} className="text-muted leading-relaxed mb-4">{para}</p>
      ))}
    </div>
  )
}
