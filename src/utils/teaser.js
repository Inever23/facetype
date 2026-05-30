export function getTeaserLine(description) {
  if (!description) return 'You love deeply but protect yourself first…'

  const firstSentence = description.split(/[.!?]/)[0]?.trim()
  if (!firstSentence) return 'You love deeply but protect yourself first…'
  if (firstSentence.length <= 52) return `${firstSentence}…`
  return `${firstSentence.slice(0, 49).trim()}…`
}
