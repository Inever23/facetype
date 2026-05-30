const DATING_STYLES = [
  'The Protector',
  'The Chaser',
  'The Nurturer',
  'The Free Spirit',
  'The Analyzer',
  'The Magnet',
  'The Mirror',
  'The Fixer',
  'The Ghost',
  'The Romantic',
]

function pickStyles(primaryStyle, count = 3) {
  const others = DATING_STYLES.filter((s) => s !== primaryStyle)
  const picked = [primaryStyle]
  while (picked.length < count && others.length) {
    const idx = Math.floor(Math.random() * others.length)
    picked.push(others.splice(idx, 1)[0])
  }
  return picked
}

function distributePercentages(count) {
  if (count === 1) return [100]
  if (count === 2) return [65, 35]
  const a = 55 + Math.floor(Math.random() * 15)
  const b = 30 + Math.floor(Math.random() * 10)
  const c = 100 - a - b
  return [a, b, Math.max(5, c)]
}

export function getFallbackAttachmentDNA(result) {
  const styles = pickStyles(result.style, 3)
  const pcts = distributePercentages(3)
  return {
    dna: styles.map((style, i) => ({ style, percentage: pcts[i] })),
    explanation:
      'Your attachment blend shows a dominant pattern with smaller influences shaping how you show up in relationships.',
  }
}

export function getFallbackToxicPattern(result, answers) {
  const redCount = answers.filter((a) => a === 'red').length
  const patterns = [
    {
      pattern: 'The Avoider',
      description:
        'You pull away the moment things get real, then wonder why people stop chasing. Your silence reads as disinterest even when you care deeply.',
      fix: 'Say one honest feeling out loud before you go quiet — it changes everything.',
    },
    {
      pattern: 'The Fixer',
      description:
        'You fall for potential and stay too long trying to rescue people who never asked to be saved. You confuse compassion with compatibility.',
      fix: 'Date people who are already doing their inner work, not people you want to renovate.',
    },
    {
      pattern: 'The Chaser',
      description:
        'You crave the chase more than the person. When things get stable, you manufacture drama or mentally check out.',
      fix: 'Ask yourself if you want them or just the adrenaline of uncertainty.',
    },
  ]
  const pick = patterns[Math.min(redCount, patterns.length - 1)]
  return pick
}

export function getFallbackPerfectMatch(result) {
  return {
    personality:
      'Emotionally available but not clingy — someone who communicates clearly and makes you feel chosen without needing constant proof.',
    energy:
      'Calm, warm, and consistent — the kind of presence that makes you exhale instead of spiral.',
    habits:
      'They plan dates, follow through on small promises, and respect your time as much as their own.',
    dealbreaker:
      'They would never leave you guessing for days or use silence as a power move.',
  }
}
