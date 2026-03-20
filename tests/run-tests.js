import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  DESKTOP_FRAME_COLUMNS_DEFAULT,
  DESKTOP_FRAME_COLUMNS_FULL_WIDTH,
  DESKTOP_FRAME_COLUMNS_LEFT_CLOSED,
  DESKTOP_FRAME_COLUMNS_RIGHT_CLOSED,
  getDesktopFrameColumns,
} from '../src/components/ui/desktopFrame.js';
import {
  createReadingData,
  flattenParagraphs,
  normalizeReadingToc,
  parseEnglishEntries,
  parseKoreanEntries,
  parseToc,
} from '../src/lib/parseThreeBodiesCore.js';
import { resolveStoredActiveParagraph } from '../src/lib/readingState.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

async function loadFixture(name) {
  return readFile(path.join(projectRoot, name), 'utf8');
}

function runDesktopFrameTests() {
  assert.equal(getDesktopFrameColumns(true, true), DESKTOP_FRAME_COLUMNS_DEFAULT);
  assert.equal(getDesktopFrameColumns(false, true), DESKTOP_FRAME_COLUMNS_LEFT_CLOSED);
  assert.equal(getDesktopFrameColumns(true, false), DESKTOP_FRAME_COLUMNS_RIGHT_CLOSED);
  assert.equal(getDesktopFrameColumns(false, false), DESKTOP_FRAME_COLUMNS_FULL_WIDTH);
}

async function runParserTests() {
  const koreanSource = await loadFixture('1. 삼신 티벳-한글.txt');
  const englishSource = await loadFixture('2. 삼신 영어.txt');
  const tocSource = await loadFixture('3. 삼신 목차.txt');

  const koreanEntries = parseKoreanEntries(koreanSource);
  const englishEntries = parseEnglishEntries(englishSource);
  const normalizedToc = normalizeReadingToc(parseToc(tocSource));
  const chapters = createReadingData(koreanEntries, englishEntries, normalizedToc);
  const flatParagraphs = flattenParagraphs(chapters);

  assert.equal(koreanEntries.length, 168);
  assert.equal(englishEntries.size, 168);
  assert.equal(normalizedToc.length, 4);
  assert.equal(normalizedToc[0].start, 1);
  assert.match(normalizedToc[0].title, /^제1장/);
  assert.equal(chapters.length, 4);
  assert.equal(flatParagraphs.length, 168);
  assert.equal(flatParagraphs[0]?.paragraphNumber, 1);
  assert.equal(flatParagraphs.at(-1)?.paragraphNumber, 168);
}

function runReadingStateTests() {
  const paragraphs = [
    {
      id: '1.1',
      title: 'Paragraph 1',
      paragraphNumber: 1,
      chapterTitle: '제1장 죽음',
      text: {
        tibetan: 'a',
        pronunciation: '',
        english: 'a',
        korean: 'a',
      },
    },
    {
      id: '1.2',
      title: 'Paragraph 2',
      paragraphNumber: 2,
      chapterTitle: '제1장 죽음',
      text: {
        tibetan: 'b',
        pronunciation: '',
        english: 'b',
        korean: 'b',
      },
    },
  ];

  assert.equal(
    resolveStoredActiveParagraph(JSON.stringify('1.2'), paragraphs[0], paragraphs)?.id,
    '1.2',
  );
  assert.equal(
    resolveStoredActiveParagraph('{bad json', paragraphs[0], paragraphs)?.id,
    '1.1',
  );
}

async function main() {
  runDesktopFrameTests();
  await runParserTests();
  runReadingStateTests();
  console.log('All tests passed.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
