import { callClaudeJSON } from './anthropic'
import {
  getFallbackAttachmentDNA,
  getFallbackPerfectMatch,
  getFallbackToxicPattern,
} from '../utils/fallbackPro'

const STYLE_LIST =
  'The Protector, The Chaser, The Nurturer, The Free Spirit, The Analyzer, The Magnet, The Mirror, The Fixer, The Ghost, The Romantic'

function buildContext(answers, result) {
  const flagSummary = answers.map((a, i) => `Q${i + 1} ${a}`).join(', ')
  return `User flags: ${flagSummary}. Primary dating style: ${result.style}. Description: ${result.description}`
}

const DNA_SYSTEM = `You are a dating personality analyzer. Based on the user's quiz answers and primary dating style, estimate their attachment style DNA as a blend of exactly 3 dating styles from this list: ${STYLE_LIST}. Percentages must sum to 100. Respond ONLY with valid JSON, no markdown: {"dna": [{"style": "The Ghost", "percentage": 60}, {"style": "The Chaser", "percentage": 30}, {"style": "The Romantic", "percentage": 10}], "explanation": "One sentence explaining what this blend means for how they love."}`

const TOXIC_SYSTEM = `You are a blunt but caring dating coach. Based on the user's green/red flag answers and dating style, identify their core toxic relationship pattern. Respond ONLY with valid JSON, no markdown: {"pattern": "one word or short label", "description": "2 brutally honest sentences about the specific thing this person does to sabotage their relationships", "fix": "one sentence actionable tip"}`

const MATCH_SYSTEM = `You are a dating matchmaker. Based on the user's answers and dating style, describe their ideal partner. Respond ONLY with valid JSON, no markdown: {"personality": "2 sentences describing the perfect partner's personality", "energy": "one sentence about their energy and vibe", "habits": "one sentence about their daily habits and lifestyle", "dealbreaker": "one sentence about what your perfect match would never do"}`

export async function fetchAttachmentDNA(answers, result) {
  try {
    const parsed = await callClaudeJSON(DNA_SYSTEM, buildContext(answers, result), 400)
    if (parsed?.dna?.length >= 2) {
      return {
        dna: parsed.dna.slice(0, 3),
        explanation: parsed.explanation || '',
      }
    }
  } catch {
    /* fallback */
  }
  return getFallbackAttachmentDNA(result)
}

export async function fetchToxicPattern(answers, result) {
  try {
    const parsed = await callClaudeJSON(TOXIC_SYSTEM, buildContext(answers, result), 400)
    if (parsed?.pattern && parsed?.description) {
      return parsed
    }
  } catch {
    /* fallback */
  }
  return getFallbackToxicPattern(result, answers)
}

export async function fetchPerfectMatch(answers, result) {
  try {
    const parsed = await callClaudeJSON(MATCH_SYSTEM, buildContext(answers, result), 450)
    if (parsed?.personality) {
      return parsed
    }
  } catch {
    /* fallback */
  }
  return getFallbackPerfectMatch(result)
}

export async function fetchAllProFeatures(answers, result) {
  const [dna, toxic, match] = await Promise.all([
    fetchAttachmentDNA(answers, result),
    fetchToxicPattern(answers, result),
    fetchPerfectMatch(answers, result),
  ])
  return { dna, toxic, match }
}
