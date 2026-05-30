export const QUIZ_QUESTIONS = [
  'They cancel plans last minute with a weak excuse',
  'Remembers small details you mentioned weeks ago',
  'Goes quiet for days then acts like nothing happened',
  'Hypes you up in front of their friends',
  'Makes you feel guilty for having needs',
  'Checks in when they know you\'re stressed',
  'Their ex is still their \'best friend\'',
  'Tells you how they feel without being asked',
  'Matches your energy — distant when you\'re distant, warm when you\'re warm',
  'Gets jealous but never actually says it',
]

export const SCAN_MESSAGES = [
  'Detecting facial structure…',
  'Reading micro-expressions…',
  'Analyzing emotional patterns…',
  'Scan complete ✓',
]

export const PROCESSING_MESSAGES = [
  'Combining scan data…',
  'Matching your pattern…',
  'Almost ready…',
]

export const SYSTEM_PROMPT = `You are a dating personality analyzer. Based on a user's 10 green and red flag answers, assign them exactly one of these 10 dating styles: The Protector, The Chaser, The Nurturer, The Free Spirit, The Analyzer, The Magnet, The Mirror, The Fixer, The Ghost, The Romantic. Respond ONLY with valid JSON in this exact format with no markdown or extra text: {"style": "The Protector", "emoji": "🛡️", "description": "2 sentence description of this dating style", "compatibility": "One sentence about who they are most compatible with", "roast": "One funny but accurate sentence that gently calls them out", "celebrity": "One celebrity or fictional character who matches this style"}`
