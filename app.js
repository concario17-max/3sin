const SOURCE_FILES = {
  korean: './1. 삼신 티벳-한글.txt',
  english: './2. 삼신 영어.txt',
  toc: './3. 삼신 목차.txt',
};

function normalizeWhitespace(value) {
  return value.replace(/\r/g, '').replace(/[ \t]+/g, ' ').trim();
}

function parseKoreanEntries(source) {
  const pattern = /(\d+)\.\s*\[티벳어 원문\]\s*([\s\S]*?)\s*\[한국어 번역\]\s*([\s\S]*?)(?=\n\d+\.\s*\[티벳어 원문\]|\s*$)/g;
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
  const entries = new Map();
  let match;

  while ((match = pattern.exec(source)) !== null) {
    entries.set(Number(match[1]), normalizeWhitespace(match[2]));
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

function buildEntries(koreanText, englishText, tocText) {
  const koreanEntries = parseKoreanEntries(koreanText);
  const englishEntries = parseEnglishEntries(englishText);
  const chapters = parseToc(tocText);

  return koreanEntries.map((entry) => {
    const chapter = chapterForNumber(entry.number, chapters);
    const chapterIndex = chapter ? chapters.indexOf(chapter) + 1 : 0;
    const localIndex = chapter ? entry.number - chapter.start + 1 : entry.number;

    return {
      id: `${chapterIndex}.${localIndex}`,
      paragraphNumber: entry.number,
      chapterIndex,
      chapterTitle: chapter ? chapter.title : '기타',
      title: `문단 ${entry.number}`,
      tibetan: entry.tibetan,
      korean: entry.korean,
      english: englishEntries.get(entry.number) ?? '',
    };
  });
}

function buildChapters(entries) {
  const grouped = new Map();

  entries.forEach((entry) => {
    const key = `${entry.chapterIndex}-${entry.chapterTitle}`;
    if (!grouped.has(key)) {
      grouped.set(key, {
        id: String(entry.chapterIndex),
        title: entry.chapterTitle,
        verses: [],
      });
    }
    grouped.get(key).verses.push(entry);
  });

  return Array.from(grouped.values());
}

async function loadSources() {
  const [korean, english, toc] = await Promise.all(
    Object.values(SOURCE_FILES).map(async (path) => {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`${path} 파일을 읽지 못했습니다.`);
      }
      return response.text();
    }),
  );

  return { korean, english, toc };
}

function renderApp(entries) {
  const chapters = buildChapters(entries);
  let activeIndex = 0;

  const chaptersRoot = document.getElementById('chapters');
  const metaRoot = document.getElementById('reading-meta');
  const titleRoot = document.getElementById('reading-title');
  const subtitleRoot = document.getElementById('reading-subtitle');
  const tibetanRoot = document.getElementById('tibetan-text');
  const englishRoot = document.getElementById('english-text');
  const koreanRoot = document.getElementById('korean-text');
  const overviewRoot = document.getElementById('overview');
  const prevButton = document.getElementById('prev-button');
  const nextButton = document.getElementById('next-button');

  function renderSidebar() {
    chaptersRoot.innerHTML = '';

    chapters.forEach((chapter) => {
      const section = document.createElement('section');
      section.className = 'chapter-block';

      const title = document.createElement('div');
      title.className = 'chapter-block__title';
      title.innerHTML = `<span>Chapter ${chapter.id}</span><strong>${chapter.title}</strong>`;
      section.appendChild(title);

      const verses = document.createElement('div');
      verses.className = 'chapter-block__verses';

      chapter.verses.forEach((entry) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `verse-link${entries[activeIndex].id === entry.id ? ' is-active' : ''}`;
        button.innerHTML = `<span>${entry.title}</span><small>${entry.paragraphNumber}</small>`;
        button.addEventListener('click', () => {
          activeIndex = entries.findIndex((item) => item.id === entry.id);
          renderSidebar();
          renderContent();
        });
        verses.appendChild(button);
      });

      section.appendChild(verses);
      chaptersRoot.appendChild(section);
    });
  }

  function renderContent() {
    const entry = entries[activeIndex];
    const chapter = chapters.find((item) => item.id === String(entry.chapterIndex));
    const chapterPosition = chapter.verses.findIndex((item) => item.id === entry.id) + 1;

    metaRoot.innerHTML = `<span>Chapter ${entry.chapterIndex}</span><span>Paragraph ${entry.paragraphNumber}</span>`;
    titleRoot.textContent = entry.chapterTitle;
    subtitleRoot.textContent = entry.title;
    tibetanRoot.textContent = entry.tibetan;
    englishRoot.textContent = entry.english || '영문 번역 없음';
    koreanRoot.textContent = entry.korean;

    overviewRoot.innerHTML = `
      <div><dt>장</dt><dd>${entry.chapterTitle}</dd></div>
      <div><dt>문단 번호</dt><dd>${entry.paragraphNumber}</dd></div>
      <div><dt>장 내 순서</dt><dd>${chapterPosition}/${chapter.verses.length}</dd></div>
      <div><dt>전체 순서</dt><dd>${activeIndex + 1}/${entries.length}</dd></div>
    `;

    prevButton.disabled = activeIndex <= 0;
    nextButton.disabled = activeIndex >= entries.length - 1;
  }

  prevButton.addEventListener('click', () => {
    if (activeIndex <= 0) return;
    activeIndex -= 1;
    renderSidebar();
    renderContent();
  });

  nextButton.addEventListener('click', () => {
    if (activeIndex >= entries.length - 1) return;
    activeIndex += 1;
    renderSidebar();
    renderContent();
  });

  renderSidebar();
  renderContent();
}

async function init() {
  try {
    const sources = await loadSources();
    const entries = buildEntries(sources.korean, sources.english, sources.toc);
    renderApp(entries);
  } catch (error) {
    document.body.innerHTML = `
      <main style="padding:40px;font-family:Inter,sans-serif;">
        <h1>페이지를 불러오지 못했습니다</h1>
        <p>${error.message}</p>
        <p>정적 서버에서 열어야 텍스트 파일을 읽을 수 있습니다.</p>
      </main>
    `;
  }
}

init();
