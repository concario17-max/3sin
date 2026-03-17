import koSource from '../../1. 삼신 티벳-한글.txt?raw';
import enSource from '../../2. 삼신 영어.txt?raw';
import tocSource from '../../3. 삼신 목차.txt?raw';

function normalizeWhitespace(value) {
  return value.replace(/\r/g, '').replace(/[ \t]+/g, ' ').trim();
}

function parseKoreanEntries(source) {
  const pattern =
    /(\d+)\.\s*\[티벳어 원문\]\s*([\s\S]*?)\s*\[한국어 번역\]\s*([\s\S]*?)(?=\n\d+\.\s*\[티벳어 원문\]|\s*$)/g;
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
  const pattern = /(\d+)문단:\s*([\s\S]*?)(?=\n\s*\d+문단:|\s*$)/g;
  const entries = [];
  let match;

  while ((match = pattern.exec(source)) !== null) {
    entries.push({
      number: Number(match[1]),
      english: normalizeWhitespace(match[2]),
    });
  }

  return entries;
}

function parseToc(source) {
  const pattern = /(.*?)\s*\(문단\s*(\d+)(?:~\s*문단\s*(\d+))?\)/g;
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

function chapterForNumber(number, chapters) {
  return chapters.find((chapter) => number >= chapter.start && number <= chapter.end) ?? null;
}

export function buildBookData() {
  const koreanEntries = parseKoreanEntries(koSource);
  const englishMap = new Map(
    parseEnglishEntries(enSource).map((entry) => [entry.number, entry.english]),
  );
  const chapters = parseToc(tocSource);

  return koreanEntries.map((entry) => {
    const chapter = chapterForNumber(entry.number, chapters);
    const chapterIndex = chapter ? chapters.indexOf(chapter) + 1 : 0;
    const localIndex = chapter ? entry.number - chapter.start + 1 : entry.number;

    return {
      id: `${chapterIndex || 0}.${localIndex}`,
      paragraphNumber: entry.number,
      chapterIndex,
      chapterTitle: chapter?.title ?? '기타',
      title: `문단 ${entry.number}`,
      text: {
        tibetan: entry.tibetan,
        korean: entry.korean,
        english: englishMap.get(entry.number) ?? '',
      },
    };
  });
}

export function buildChapters(entries) {
  const chapterMap = new Map();

  entries.forEach((entry) => {
    const key = `${entry.chapterIndex}-${entry.chapterTitle}`;

    if (!chapterMap.has(key)) {
      chapterMap.set(key, {
        id: String(entry.chapterIndex),
        title: entry.chapterTitle,
        verses: [],
      });
    }

    chapterMap.get(key).verses.push(entry);
  });

  return Array.from(chapterMap.values());
}
