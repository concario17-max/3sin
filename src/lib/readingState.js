/** @typedef {import('../types').ReadingParagraph} ReadingParagraph */

/**
 * @param {string | null} savedValue
 * @param {ReadingParagraph | null} fallbackParagraph
 * @param {ReadingParagraph[]} paragraphs
 * @returns {ReadingParagraph | null}
 */
export function resolveStoredActiveParagraph(savedValue, fallbackParagraph, paragraphs) {
  try {
    if (!savedValue) return fallbackParagraph;

    const parsed = JSON.parse(savedValue);
    let paragraphId = null;

    if (typeof parsed === 'string') {
      paragraphId = parsed;
    } else if (parsed && typeof parsed === 'object') {
      if (typeof parsed.id === 'string') {
        paragraphId = parsed.id;
      } else if (typeof parsed.paragraphId === 'string') {
        paragraphId = parsed.paragraphId;
      }
    }

    if (!paragraphId) return fallbackParagraph;
    return paragraphs.find((paragraph) => paragraph.id === paragraphId) ?? fallbackParagraph;
  } catch {
    return fallbackParagraph;
  }
}
