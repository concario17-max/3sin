import koSource from '../../1. 삼신 티벳-한글.txt?raw';
import enSource from '../../2. 삼신 영어.txt?raw';
import tocSource from '../../3. 삼신 목차.txt?raw';
import {
  createReadingData,
  flattenParagraphs,
  normalizeReadingToc,
  parseEnglishEntries,
  parseKoreanEntries,
  parseToc,
} from './parseThreeBodiesCore';

export {
  createReadingData,
  flattenParagraphs,
  normalizeReadingToc,
  parseEnglishEntries,
  parseKoreanEntries,
  parseToc,
} from './parseThreeBodiesCore';

export function buildReadingData() {
  return createReadingData(
    parseKoreanEntries(koSource),
    parseEnglishEntries(enSource),
    normalizeReadingToc(parseToc(tocSource)),
  );
}
