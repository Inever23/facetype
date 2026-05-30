import { SYSTEM_PROMPT } from '../constants/questions'
import { getFallbackResult } from '../utils/fallbackResult'

function buildUserMessage(answers) {
  const parts = answers.map((a, i) => `Q${i + 1} ${a}`)
  return `The user answered: ${parts.join(', ')}`
}

export function parseJsonFromText(text) {
  const trimmed = text.trim()
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('No JSON in response')
  return JSON.parse(jsonMatch[0])
}

export async function callClaudeJSON(system, userContent, maxTokens = 512) {
  const apiKey = import.meta.env.REACT_APP_ANTHROPIC_API_KEY

  if (!apiKey || apiKey === 'your_key_here') {
    return null
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content: userContent }],
    }),
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  const data = await response.json()
  const text = data.content?.[0]?.text ?? ''
  return parseJsonFromText(text)
}

function parseResult(text) {
  const parsed = parseJsonFromText(text)
  if (!parsed.style || !parsed.emoji) throw new Error('Invalid result shape')
  return parsed
}

export async function fetchPersonalityResult(answers) {
  try {
    const parsed = await callClaudeJSON(SYSTEM_PROMPT, buildUserMessage(answers))
    if (parsed) return parsed
  } catch {
    /* fallback below */
  }
  return getFallbackResult(answers)
}
