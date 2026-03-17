import React from 'react';
import { buildBookData, buildChapters } from './lib/parseThreeBodies';

const entries = buildBookData();
const chapters = buildChapters(entries);

function App() {
  const [activeId, setActiveId] = React.useState(entries[0]?.id ?? null);

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

  return (
    <div className="app-shell">
      <div className="app-backdrop" />

      <aside className="sidebar">
        <div className="sidebar__header">
          <p className="eyebrow">Three Bodies</p>
          <h1>삼신 본문</h1>
          <p className="sidebar__description">
            `tibet` 본문 포맷을 기준으로, 업로드하신 텍스트 3개를 연결한 React 읽기 페이지입니다.
          </p>
        </div>

        <div className="sidebar__chapters">
          {chapters.map((chapter) => (
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
                      onClick={() => setActiveId(entry.id)}
                    >
                      <span>{entry.title}</span>
                      <small>{entry.paragraphNumber}</small>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </aside>

      <main className="reading-panel">
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
              <dd>{activeIndex + 1}</dd>
            </div>
          </dl>
        </div>
      </aside>
    </div>
  );
}

export default App;
