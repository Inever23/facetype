const STYLES = [
  {
    style: 'The Protector',
    emoji: '🛡️',
    description:
      'You love through actions and show up before anyone even asks. Your loyalty runs deep, even when you pretend you don\'t care as much.',
    compatibility: 'Best with someone who appreciates consistency over grand gestures.',
    roast: 'You\'ve definitely driven past their place "just to make sure they got home safe."',
    celebrity: 'Captain America',
  },
  {
    style: 'The Chaser',
    emoji: '🏃',
    description:
      'The thrill of pursuit is your love language — until things get real. You confuse excitement with chemistry every single time.',
    compatibility: 'Most compatible with someone who keeps you guessing without playing games.',
    roast: 'You\'ve lost interest on someone the second they texted back too fast.',
    celebrity: 'James Bond',
  },
  {
    style: 'The Nurturer',
    emoji: '🌸',
    description:
      'You absorb everyone\'s emotions and forget your own needs exist. Giving feels safer than receiving — until you\'re completely drained.',
    compatibility: 'Best with partners who actively ask what YOU need for once.',
    roast: 'You\'ve apologized for being upset about something they did wrong.',
    celebrity: 'Leslie Knope',
  },
  {
    style: 'The Free Spirit',
    emoji: '🦋',
    description:
      'Labels terrify you, but once you\'re in, you\'re the most loyal person in the room. You need freedom to choose commitment.',
    compatibility: 'Works best with someone patient who never tries to cage you.',
    roast: 'You\'ve said "I\'m not looking for anything serious" while planning your wedding Pinterest board.',
    celebrity: 'Phoebe Buffay',
  },
  {
    style: 'The Analyzer',
    emoji: '🧠',
    description:
      'You overthink every text and love deeply — you just show it three weeks too late. Your brain protects a heart that wants to trust.',
    compatibility: 'Most compatible with direct communicators who don\'t make you decode everything.',
    roast: 'You\'ve drafted a reply, deleted it, and still haven\'t sent anything.',
    celebrity: 'Hermione Granger',
  },
  {
    style: 'The Magnet',
    emoji: '✨',
    description:
      'People are drawn to you effortlessly, but letting someone fully in feels like losing control. Charm is your armor.',
    compatibility: 'Best with someone secure enough not to compete for your attention.',
    roast: 'You have three people in your DMs and you\'re "focusing on yourself."',
    celebrity: 'James Dean',
  },
  {
    style: 'The Mirror',
    emoji: '🪞',
    description:
      'You reflect whoever you\'re with and you\'re still figuring out who you actually are. Adaptable, but sometimes you disappear in relationships.',
    compatibility: 'Most compatible with someone who encourages your authentic self.',
    roast: 'Your personality shifted after you watched their favorite show for the third time.',
    celebrity: 'Elle Woods (early act one)',
  },
  {
    style: 'The Fixer',
    emoji: '🔧',
    description:
      'You fall for potential and stay too long trying to save people. Your compassion is beautiful — your boundaries need work.',
    compatibility: 'Best with partners who are already doing their own inner work.',
    roast: 'You\'ve said "I can change them" out loud and meant it sincerely.',
    celebrity: 'Ted Mosby',
  },
  {
    style: 'The Ghost',
    emoji: '👻',
    description:
      'You\'re emotionally unavailable until someone stops trying — then you\'re suddenly all in. Distance is your default until it isn\'t.',
    compatibility: 'Most compatible with someone who won\'t chase but won\'t disappear either.',
    roast: 'You went offline for four days and came back with "hey stranger."',
    celebrity: 'Mr. Darcy',
  },
  {
    style: 'The Romantic',
    emoji: '💘',
    description:
      'You\'re all in from day one and you love love itself more than any specific person sometimes. Hope is your superpower and your kryptonite.',
    compatibility: 'Best with someone who matches your enthusiasm without exploiting it.',
    roast: 'You\'ve planned a future after two great dates and one decent brunch.',
    celebrity: 'Noah Calhoun',
  },
]

export function getFallbackResult(answers) {
  const greenCount = answers.filter((a) => a === 'green').length
  const index = Math.min(9, Math.floor((greenCount / 10) * 10))
  return { ...STYLES[index] }
}
