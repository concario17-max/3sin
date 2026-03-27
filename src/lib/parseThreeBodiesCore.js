/** @typedef {import('../types').ReadingChapter} ReadingChapter */
/** @typedef {import('../types').ReadingParagraph} ReadingParagraph */

/**
 * @typedef ParsedKoreanEntry
 * @property {number} number
 * @property {string} tibetan
 * @property {string} korean
 */

/**
 * @typedef ParsedTocEntry
 * @property {string} title
 * @property {number} start
 * @property {number} end
 */

/**
 * @param {string} value
 * @returns {string}
 */
function normalizeWhitespace(value) {
  return value.replace(/\r/g, '').replace(/[ \t]+/g, ' ').trim();
}

/**
 * @param {string} title
 * @returns {string}
 */
export function compactChapterLabel(title) {
  return title.replace(/^제\s*(\d+)\s*장/, '$1장');
}

/**
 * @param {string} source
 * @returns {ParsedKoreanEntry[]}
 */
export function parseKoreanEntries(source) {
  const pattern =
    /(\d+)\.\s*\[[^\]]+\]\s*([\s\S]*?)\s*\[[^\]]+\]\s*([\s\S]*?)(?=\n\d+\.\s*\[[^\]]+\]|\s*$)/g;
  /** @type {ParsedKoreanEntry[]} */
  const entries = [];
  let match;

  while ((match = pattern.exec(source)) !== null) {
    entries.push({
      number: Number(match[1]),
      tibetan: normalizeWhitespace(match[2]),
      korean: normalizeWhitespace(match[3]),
    });
  }

  return entries;
}

/**
 * @param {string} source
 * @returns {Map<number, string>}
 */
export function parseEnglishEntries(source) {
  const pattern = /(\d+)\S*:\s*([\s\S]*?)(?=\n\s*\d+\S*:|\s*$)/g;
  const entries = new Map();
  let match;

  while ((match = pattern.exec(source)) !== null) {
    entries.set(Number(match[1]), normalizeWhitespace(match[2]));
  }

  return entries;
}

/**
 * @param {string} source
 * @returns {ParsedTocEntry[]}
 */
export function parseToc(source) {
  const pattern = /(.*?)\s*\([^0-9]*(\d+)(?:\s*~\s*[^0-9]*(\d+))?\)/g;
  /** @type {ParsedTocEntry[]} */
  const chapters = [];
  let match;

  while ((match = pattern.exec(source)) !== null) {
    chapters.push({
      title: normalizeWhitespace(match[1]),
      start: Number(match[2]),
      end: match[3] ? Number(match[3]) : Number(match[2]),
    });
  }

  return chapters;
}

/**
 * @param {ParsedTocEntry[]} chapters
 * @returns {ParsedTocEntry[]}
 */
export function normalizeReadingToc(chapters) {
  if (chapters.length < 2) return chapters;

  const [firstChapter, secondChapter, ...restChapters] = chapters;
  if (!firstChapter.title.startsWith('귀의의 찬시')) return chapters;

  return [
    {
      ...secondChapter,
      start: firstChapter.start,
    },
    ...restChapters,
  ];
}

/**
 * @param {ParsedKoreanEntry[]} koreanEntries
 * @param {Map<number, string>} englishEntries
 * @param {ParsedTocEntry[]} toc
 * @returns {ReadingChapter[]}
 */
export function createReadingData(koreanEntries, englishEntries, toc) {
  return toc.map((chapter, chapterIndex) => ({
    id: String(chapterIndex + 1),
    chapterName: compactChapterLabel(chapter.title),
    title: chapter.title,
    paragraphs: koreanEntries
      .filter((entry) => entry.number >= chapter.start && entry.number <= chapter.end)
      .map(
        /**
         * @returns {ReadingParagraph}
         */
        (entry) => ({
          id: `${chapterIndex + 1}.${entry.number - chapter.start + 1}`,
          title: `Paragraph ${entry.number}`,
          paragraphNumber: entry.number,
          chapterTitle: chapter.title,
          text: {
            tibetan: entry.tibetan,
            pronunciation: '',
            english: englishEntries.get(entry.number) ?? '',
            korean: entry.korean,
          },
        }),
      ),
  }));
}

/**
 * @param {ReadingChapter[]} chapters
 * @returns {ReadingParagraph[]}
 */
export function flattenParagraphs(chapters) {
  return chapters.flatMap((chapter) => chapter.paragraphs);
}
