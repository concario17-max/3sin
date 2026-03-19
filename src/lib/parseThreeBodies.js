import koSource from '../../1. 삼신 티벳-한글.txt?raw';
import enSource from '../../2. 삼신 영어.txt?raw';
import tocSource from '../../3. 삼신 목차.txt?raw';

function normalizeWhitespace(value) {
  return value.replace(/\r/g, '').replace(/[ \t]+/g, ' ').trim();
}

function compactChapterLabel(title) {
  return title.replace(/^제\s*(\d+)장/, '$1장');
}

function parseKoreanEntries(source) {
  const pattern =
    /(\d+)\.\s*\[[^\]]+\]\s*([\s\S]*?)\s*\[[^\]]+\]\s*([\s\S]*?)(?=\n\d+\.\s*\[[^\]]+\]|\s*$)/g;
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

function parseEnglishEntries(source) {
  const pattern = /(\d+)\S*:\s*([\s\S]*?)(?=\n\s*\d+\S*:|\s*$)/g;
  const entries = new Map();
  let match;

  while ((match = pattern.exec(source)) !== null) {
    entries.set(Number(match[1]), normalizeWhitespace(match[2]));
  }

  return entries;
}

function parseToc(source) {
  const pattern = /(.*?)\s*\([^0-9]*(\d+)(?:\s*~\s*[^0-9]*(\d+))?\)/g;
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

function normalizeReadingToc(chapters) {
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

export function buildReadingData() {
  const koreanEntries = parseKoreanEntries(koSource);
  const englishEntries = parseEnglishEntries(enSource);
  const toc = normalizeReadingToc(parseToc(tocSource));

  return toc.map((chapter, chapterIndex) => ({
    id: String(chapterIndex + 1),
    chapterName: compactChapterLabel(chapter.title),
    title: chapter.title,
    paragraphs: koreanEntries
      .filter((entry) => entry.number >= chapter.start && entry.number <= chapter.end)
      .map((entry) => ({
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
      })),
  }));
}

export function flattenParagraphs(chapters) {
  return chapters.flatMap((chapter) => chapter.paragraphs ?? []);
}

// Legacy aliases kept for compatibility with older imports during cleanup.
export function buildPrayerData() {
  return buildReadingData().map((chapter) => ({
    ...chapter,
    verses: chapter.paragraphs,
  }));
}

export function flattenVerses(prayers) {
  return prayers.flatMap((chapter) => chapter.verses ?? chapter.paragraphs ?? []);
}
