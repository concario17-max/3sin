import React from 'react';
import { buildBookData, buildChapters } from './lib/parseThreeBodies';

const entries = buildBookData();
const chapters = buildChapters(entries);

function makePreview(text, length = 78) {
  const normalized = String(text).replace(/\s+/g, ' ').trim();
  if (normalized.length <= length) return normalized;
  return `${normalized.slice(0, length).trim()}...`;
}

function App() {
  const [activeId, setActiveId] = React.useState(() => {
    try {
      return localStorage.getItem('three-bodies-active-id') ?? entries[0]?.id ?? null;
    } catch {
      return entries[0]?.id ?? null;
    }
  });
  const [query, setQuery] = React.useState('');
  const deferredQuery = React.useDeferredValue(query);

  const activeEntry = React.useMemo(
    () => entries.find((entry) => entry.id === activeId) ?? entries[0],
    [activeId],
  );

  const activeIndex = React.useMemo(
    () => entries.findIndex((entry) => entry.id === activeEntry?.id),
    [activeEntry],
  );

  const activeChapter = React.useMemo(
    () => chapters.find((chapter) => chapter.id === String(activeEntry?.chapterIndex)),
    [activeEntry],
  );

  const filteredChapters = React.useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();

    if (!normalizedQuery) return chapters;

    return chapters
      .map((chapter) => ({
        ...chapter,
        verses: chapter.verses.filter((entry) => {
          const haystack = [
            chapter.title,
            entry.title,
            entry.paragraphNumber,
            entry.text.korean,
            entry.text.english,
          ]
            .join(' ')
            .toLowerCase();

          return haystack.includes(normalizedQuery);
        }),
      }))
      .filter((chapter) => chapter.verses.length > 0);
  }, [deferredQuery]);

  const completion = React.useMemo(() => {
    if (activeIndex < 0 || entries.length === 0) return 0;
    return Math.round(((activeIndex + 1) / entries.length) * 100);
  }, [activeIndex]);

  React.useEffect(() => {
    try {
      if (activeEntry?.id) {
        localStorage.setItem('three-bodies-active-id', activeEntry.id);
      }
    } catch {
      return;
    }
  }, [activeEntry]);

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeEntry?.id]);

  return (
    <div className="app-shell">
      <div className="app-backdrop" />

      <aside className="sidebar">
        <div className="sidebar__header">
          <p className="eyebrow">Three Bodies</p>
          <h1>삼신 본문</h1>
          <p className="sidebar__description">
            `tibet`의 읽기 포맷을 바탕으로, 티벳어 원문과 영어 번역, 한국어 번역을 한 화면에서
            따라갈 수 있도록 정리한 페이지입니다.
          </p>
        </div>

        <div className="sidebar-search">
          <label className="sidebar-search__label" htmlFor="paragraph-search">
            Passage Finder
          </label>
          <input
            id="paragraph-search"
            className="sidebar-search__input"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="문단 번호, 장 제목, 번역 내용 검색"
          />
          <p className="sidebar-search__meta">
            {deferredQuery ? `${filteredChapters.length}개 장에서 결과 표시` : `${entries.length}개 문단`}
          </p>
        </div>

        <div className="sidebar__chapters">
          {filteredChapters.map((chapter) => (
            <section key={chapter.id} className="chapter-block">
              <div className="chapter-block__title">
                <span>Chapter {chapter.id}</span>
                <strong>{chapter.title}</strong>
              </div>

              <div className="chapter-block__verses">
                {chapter.verses.map((entry) => {
                  const isActive = entry.id === activeEntry.id;

                  return (
                    <button
                      key={entry.id}
                      type="button"
                      className={`verse-link${isActive ? ' is-active' : ''}`}
                      onClick={() => {
                        React.startTransition(() => {
                          setActiveId(entry.id);
                        });
                      }}
                    >
                      <span className="verse-link__body">
                        <strong>{entry.title}</strong>
                        <em>{makePreview(entry.text.korean)}</em>
                      </span>
                      <small>{entry.paragraphNumber}</small>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}

          {filteredChapters.length === 0 ? (
            <div className="empty-search">
              <p className="eyebrow">No Match</p>
              <h2>검색 결과가 없습니다</h2>
              <p>다른 문단 번호나 단어로 다시 찾아보세요.</p>
            </div>
          ) : null}
        </div>
      </aside>

      <main className="reading-panel">
        <section className="reading-overview">
          <div className="overview-pill">
            <span>Current Position</span>
            <strong>
              {activeIndex + 1} / {entries.length}
            </strong>
          </div>
          <div className="overview-pill">
            <span>Current Chapter</span>
            <strong>{activeEntry.chapterTitle}</strong>
          </div>
          <div className="overview-pill overview-pill--progress">
            <span>Reading Progress</span>
            <strong>{completion}%</strong>
            <div className="progress-track" aria-hidden="true">
              <div className="progress-track__fill" style={{ width: `${completion}%` }} />
            </div>
          </div>
        </section>

        <header className="reading-header">
          <div className="reading-header__meta">
            <span>Chapter {activeEntry.chapterIndex}</span>
            <span>Paragraph {activeEntry.paragraphNumber}</span>
          </div>
          <h2>{activeEntry.chapterTitle}</h2>
          <p>{activeEntry.title}</p>
        </header>

        <section className="card card--tibetan">
          <p className="section-label">Tibetan Original</p>
          <div className="tibetan-text">{activeEntry.text.tibetan}</div>
        </section>

        <section className="card">
          <p className="section-label">English Rendering</p>
          <p className="body-text body-text--english">
            {activeEntry.text.english || '영문 번역 없음'}
          </p>
        </section>

        <section className="card card--korean">
          <p className="section-label">Korean Translation</p>
          <p className="body-text body-text--korean">{activeEntry.text.korean}</p>
        </section>

        <nav className="pager">
          <button
            type="button"
            onClick={() => activeIndex > 0 && setActiveId(entries[activeIndex - 1].id)}
            disabled={activeIndex <= 0}
          >
            이전 문단
          </button>
          <button
            type="button"
            onClick={() => activeIndex < entries.length - 1 && setActiveId(entries[activeIndex + 1].id)}
            disabled={activeIndex >= entries.length - 1}
          >
            다음 문단
          </button>
        </nav>
      </main>

      <aside className="info-panel">
        <div className="info-card">
          <p className="eyebrow">Overview</p>
          <h3>현재 선택</h3>
          <dl>
            <div>
              <dt>장</dt>
              <dd>{activeEntry.chapterTitle}</dd>
            </div>
            <div>
              <dt>문단 번호</dt>
              <dd>{activeEntry.paragraphNumber}</dd>
            </div>
            <div>
              <dt>장 내 순서</dt>
              <dd>
                {activeChapter?.verses.findIndex((entry) => entry.id === activeEntry.id) + 1}/
                {activeChapter?.verses.length}
              </dd>
            </div>
            <div>
              <dt>전체 순서</dt>
              <dd>
                {activeIndex + 1}/{entries.length}
              </dd>
            </div>
            <div>
              <dt>문단 요약</dt>
              <dd>{makePreview(activeEntry.text.korean, 120)}</dd>
            </div>
          </dl>
        </div>
      </aside>
    </div>
  );
}

export default App;
