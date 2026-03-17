import React from 'react';

function Label({ children }) {
  return <p className="font-inter text-[10px] font-semibold uppercase tracking-[0.38em] text-gold-deep/70">{children}</p>;
}

function TranslationSection({ english, korean }) {
  return (
    <section className="mb-10 space-y-8 sm:space-y-10">
      {english ? (
        <div className="rounded-[1.8rem] border border-gold-border/18 bg-white/55 px-5 py-6 shadow-[0_20px_50px_rgba(120,93,48,0.05)] backdrop-blur-lg sm:px-8 sm:py-8">
          <Label>English Rendering</Label>
          <div className="mx-auto mt-4 max-w-4xl">
            <p className="text-left font-serif text-[18px] leading-[1.85] tracking-[0.005em] text-text-primary/92 sm:text-[21px] sm:leading-[1.9]">
              {english.replace(/[\r\n]+/g, ' ')}
            </p>
          </div>
        </div>
      ) : null}
      {korean ? (
        <div className="rounded-[1.8rem] border border-gold-border/18 bg-gradient-to-b from-sand-primary/75 to-white/60 px-5 py-6 shadow-[0_20px_50px_rgba(120,93,48,0.06)] backdrop-blur-lg sm:px-8 sm:py-8">
          <Label>Korean Translation</Label>
          <p className="mt-4 font-korean break-keep text-[16px] leading-[2] tracking-[-0.01em] text-text-primary sm:text-[18px] sm:leading-[2.1]">
            {String(korean).replace(/[\r\n]+/g, ' ')}
          </p>
        </div>
      ) : null}
    </section>
  );
}

export default TranslationSection;
