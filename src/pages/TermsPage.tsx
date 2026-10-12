import React from 'react';
import { BookOpen, CheckCircle, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 animate-fade-in font-sans text-[#99aabb]">
      <header className="border-b border-[#2c3440] pb-6">
        <div className="flex items-center gap-2 mb-2 text-[#8899aa]">
          <BookOpen className="w-4 h-4 text-[#00e054]" />
          <span className="text-xs uppercase tracking-widest font-bold">Terms &amp; Governance</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">Terms of Service</h1>
        <p className="mt-2 text-sm text-[#8899aa]">
          Last revised: October 2026. The rights, conduct, and responsibilities governing participation on Chitra Lekha.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 uppercase tracking-wide">
          <CheckCircle className="w-4 h-4 text-[#00e054]" />
          1. Acceptance of Terms
        </h2>
        <p className="text-sm text-[#ccddee] leading-relaxed">
          By registering an account or accessing the Chitra Lekha platform, you agree to comply with and be legally bound by these Terms of Service. If you disagree with any provision contained herein, you must refrain from utilizing the service.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 uppercase tracking-wide">
          <AlertTriangle className="w-4 h-4 text-[#ff8000]" />
          2. Community Standards and Spoiler Etiquette
        </h2>
        <p className="text-sm text-[#ccddee] leading-relaxed">
          Chitra Lekha is a community built around thoughtful discussions of storytelling. Members agree to uphold respectful, civil dialogue. Harassment, hate speech, abusive language, spamming, and automated bot activities are strictly forbidden.
        </p>
        <div className="p-4 bg-[#1b2228] border-l-2 border-[#ff8000] rounded-[3px] space-y-2 border border-[#2c3440]">
          <h3 className="text-xs uppercase tracking-wider font-bold text-[#ff8000]">
            Mandatory Spoiler Policy
          </h3>
          <p className="text-xs text-[#ccddee] leading-relaxed">
            When publishing reviews or posts revealing major plot twists, character endings, or narrative climaxes, users must enable the spoiler flag. Failure to flag substantial spoilers constitutes a violation of community guidelines and may result in content masking or temporary account suspension.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 uppercase tracking-wide">
          <ShieldCheck className="w-4 h-4 text-[#00e054]" />
          3. User Content and Intellectual Property
        </h2>
        <p className="text-sm text-[#ccddee] leading-relaxed">
          You retain copyright and ownership of the original text reviews, lists, and comments that you author. By publishing content to public areas of Chitra Lekha, you grant us a worldwide, non-exclusive, royalty-free license to display, index, format, and distribute your submissions across the platform.
        </p>
        <p className="text-sm text-[#ccddee] leading-relaxed">
          All entertainment metadata, cover imagery, posters, and trademarks displayed via TMDB, AniList, Google Books, and Open Library belong to their respective copyright holders and studio distributors.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 uppercase tracking-wide">
          <HelpCircle className="w-4 h-4 text-[#00e054]" />
          4. Moderation, Reporting, and Account Termination
        </h2>
        <p className="text-sm text-[#ccddee] leading-relaxed">
          We provide integrated reporting mechanisms allowing any member to submit reports regarding objectionable content, copyright violations, or harassment. We reserve the right to remove content, block bad-faith actors, and terminate accounts that violate community safety or applicable laws.
        </p>
      </section>

      <footer className="pt-6 border-t border-[#2c3440] text-xs text-[#8899aa]">
        Direct questions regarding these terms to terms@chitralekha.app.
      </footer>
    </div>
  );
};
