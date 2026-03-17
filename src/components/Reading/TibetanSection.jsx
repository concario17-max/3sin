import React from 'react';

function TibetanSection({ tibetan, pronunciation }) {
  if (!tibetan && !pronunciation) return null;

  return (
    <>
      <section className="relative mb-8 mt-6 overflow-hidden rounded-[2rem] border border-gold-border/20 bg-white/55 px-5 py-8 text-center shadow-[0_25px_60px_rgba(120,93,48,0.08)] backdrop-blur-xl sm:px-10 sm:py-12">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-gold-surface/25 to-transparent" />
        <div className="relative mx-auto max-w-4xl">
          <p className="font-inter text-[10px] font-semibold uppercase tracking-[0.42em] text-gold-deep/70">Tibetan Original</p>
          <p className="mx-auto mt-4 max-w-[92%] break-keep font-noto text-[1.2rem] font-bold leading-[1.5] tracking-[0.02em] text-[#4A0404] antialiased drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)] sm:text-[1.85rem] sm:leading-[1.62]">
            {tibetan?.replace(/[\r\n]+/g, ' ')}
          </p>
          {pronunciation ? <p className="mt-6 text-sm text-gold-muted">{pronunciation}</p> : null}
        </div>
      </section>
      <div className="mx-auto my-8 flex w-full max-w-md items-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold-border/40 to-transparent" />
        <span className="font-serif text-sm text-gold-primary/60">III</span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold-border/40 to-transparent" />
      </div>
    </>
  );
}

export default TibetanSection;
