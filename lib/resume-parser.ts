import { extractSkills } from './skills'
import type { ParsedResume } from './types'

const EDUCATION_PATTERN =
  /\b(b\.?\s?tech|b\.?\s?e\.?|bachelor|master|m\.?\s?tech|b\.?\s?sc|m\.?\s?sc|bca|mca|diploma|degree|university|college)\b/i

/**
 * Rule-based (non-AI) resume parser. It is intentionally simple and explainable:
 * regex for contact details, keyword matching for skills, and line heuristics for
 * name and education. Users always review the result before it is saved.
 */
export function parseResume(text: string): ParsedResume {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)

  const email = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0]
  const phone = text.match(/(?:\+?\d{1,3}[\s-]?)?(?:\(?\d{2,5}\)?[\s-]?)?\d{3,5}[\s-]?\d{4,5}/)?.[0]?.trim()

  const name = lines
    .slice(0, 6)
    .find(
      (l) =>
        l.length <= 40 &&
        /^[A-Za-z][A-Za-z .'-]+$/.test(l) &&
        l.split(/\s+/).length >= 2 &&
        !/resume|curriculum|vitae|profile|developer|engineer|designer|analyst|summary/i.test(l),
    )

  const education = lines.find((l) => EDUCATION_PATTERN.test(l) && l.length <= 120)

  const yearsMatch = text.match(/(\d{1,2})\+?\s*(?:years?|yrs?)\s+(?:of\s+)?experience/i)
  const experience = yearsMatch
    ? `${yearsMatch[1]}+ years`
    : /\bintern(ship)?\b/i.test(text)
      ? 'Internship experience'
      : 'Fresher'

  return { name, email, phone, education, experience, skills: extractSkills(text) }
}
