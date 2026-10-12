import React from 'react';
import { Shield, Lock, Eye, FileText, Database, UserCheck } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 animate-fade-in font-sans text-[#99aabb]">
      <header className="border-b border-[#2c3440] pb-6">
        <div className="flex items-center gap-2 mb-2 text-[#8899aa]">
          <Shield className="w-4 h-4 text-[#00e054]" />
          <span className="text-xs uppercase tracking-widest font-bold">Privacy &amp; Governance</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">Privacy Policy</h1>
        <p className="mt-2 text-sm text-[#8899aa]">
          Effective date: October 2026. How Chitra Lekha handles personal information, tracking records, and privacy.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 uppercase tracking-wide">
          <FileText className="w-4 h-4 text-[#00e054]" />
          1. Information We Collect
        </h2>
        <p className="text-sm text-[#ccddee] leading-relaxed">
          Chitra Lekha collects information necessary to deliver a dedicated entertainment tracking and discussion platform. When you register, we collect your unique username, email address, and a cryptographically salted password hash. We never store plaintext passwords.
        </p>
        <p className="text-sm text-[#ccddee] leading-relaxed">
          Through your active participation, we store your voluntary profile details, including display names, biographical statements, external avatar URLs, and designated favorite titles. We also store your entertainment tracking ledger, comprising statuses (such as Watched, Reading, Want to Watch), progress markers, numerical ratings, written reviews, curated thematic lists, and direct messages.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 uppercase tracking-wide">
          <Database className="w-4 h-4 text-[#00e054]" />
          2. External Metadata Providers
        </h2>
        <p className="text-sm text-[#ccddee] leading-relaxed">
          To provide comprehensive catalogs for movies, television shows, anime, and literature, our application communicates with external metadata providers:
        </p>
        <ul className="list-disc pl-5 text-sm text-[#ccddee] space-y-1">
          <li><strong>The Movie Database (TMDB)</strong> for movie and television metadata.</li>
          <li><strong>AniList GraphQL API</strong> for anime titles, studios, and episode information.</li>
          <li><strong>Google Books API</strong> and <strong>Open Library</strong> for publication details, author credits, and book cover links.</li>
        </ul>
        <p className="text-sm text-[#ccddee] leading-relaxed">
          All external requests are proxied securely through the Chitra Lekha backend. Your personal credentials, email address, private messages, and account details are never shared with or sold to these third-party providers.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 uppercase tracking-wide">
          <Lock className="w-4 h-4 text-[#00e054]" />
          3. Session Storage and Cookies
        </h2>
        <p className="text-sm text-[#ccddee] leading-relaxed">
          We utilize secure, HTTP-only session cookies to maintain your authenticated state. These cookies cannot be accessed by client-side JavaScript, protecting your account against cross-site scripting vulnerabilities. We do not use third-party tracking pixels, advertising networks, or cross-site tracking cookies.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 uppercase tracking-wide">
          <Eye className="w-4 h-4 text-[#00e054]" />
          4. Privacy Controls and Direct Correspondence
        </h2>
        <p className="text-sm text-[#ccddee] leading-relaxed">
          Direct messages between users are strictly private and authorized exclusively for participating parties. You have the ability to block any user at any time, instantly preventing incoming messages and notifications. Curated lists marked as private remain accessible solely by your account.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 uppercase tracking-wide">
          <UserCheck className="w-4 h-4 text-[#00e054]" />
          5. Account Deletion and Data Portability
        </h2>
        <p className="text-sm text-[#ccddee] leading-relaxed">
          You retain full ownership of your data. You may request account deletion at any time via your account settings. Upon deletion, your personal profile, credentials, tracking records, and direct messages are permanently removed from active databases in accordance with regulatory requirements.
        </p>
      </section>

      <footer className="pt-6 border-t border-[#2c3440] text-xs text-[#8899aa]">
        For inquiries regarding data privacy or governance, contact governance@chitralekha.app.
      </footer>
    </div>
  );
};
