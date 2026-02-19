/**
 * Shared helper for all pattern tools.
 *
 * Every pattern file exports:
 *   sections        — Record<string, string>   (full content per topic)
 *   compactSections — Record<string, string>   (rules-only per topic)
 *
 * This helper resolves topic + compact into the correct output.
 */

export interface PatternSections {
  title: string;
  sections: Record<string, string>;
  compactSections: Record<string, string>;
}

export const resolvePattern = (
  pattern: PatternSections,
  topic?: string,
  compact?: boolean,
): string => {
  const source = compact ? pattern.compactSections : pattern.sections;
  const keys = Object.keys(pattern.sections);

  if (topic) {
    const section = source[topic];
    if (section) return `# ${pattern.title}\n\n${section}`;
    return `# ${pattern.title}\n\nUnknown topic: "${topic}". Available topics: ${keys.join(', ')}`;
  }

  const body = keys.map((k) => source[k]).join('\n\n');
  return `# ${pattern.title}\n\n${body}`;
};
