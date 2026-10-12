import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#14181c] border-t border-[#2c3440] mt-24 text-[#8899aa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info with Letterboxd 3-dot motif */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00e054]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff8000]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#40bcf4]" />
              </div>
              <span className="font-sans text-base font-extrabold tracking-wider text-white uppercase">
                CHITRA LEKHA
              </span>
            </div>
            <p className="text-xs leading-relaxed text-[#8899aa] max-w-sm">
              The social network for story lovers. Track what you watch and read, log reviews, curate canonical lists, and share your perspective with fellow enthusiasts.
            </p>
            <p className="text-[11px] text-[#667788] pt-2">
              Catalog data powered by The Movie Database (TMDB), AniList GraphQL, Google Books, and Open Library.
            </p>
          </div>

          {/* Catalog Categories */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] uppercase tracking-widest font-bold text-white">
              DISCOVER
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/movies" className="text-[#8899aa] hover:text-[#00e054] transition-colors">
                  Films &amp; Cinema
                </Link>
              </li>
              <li>
                <Link to="/shows" className="text-[#8899aa] hover:text-[#00e054] transition-colors">
                  TV &amp; Episodic Series
                </Link>
              </li>
              <li>
                <Link to="/anime" className="text-[#8899aa] hover:text-[#00e054] transition-colors">
                  Anime &amp; Animation
                </Link>
              </li>
              <li>
                <Link to="/books" className="text-[#8899aa] hover:text-[#00e054] transition-colors">
                  Books &amp; Literature
                </Link>
              </li>
              <li>
                <Link to="/lists" className="text-[#8899aa] hover:text-[#00e054] transition-colors">
                  Curated Lists
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Safety */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] uppercase tracking-widest font-bold text-white">
              COMMUNITY
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/discover" className="text-[#8899aa] hover:text-[#00e054] transition-colors">
                  Search &amp; Members
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-[#8899aa] hover:text-[#00e054] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-[#8899aa] hover:text-[#00e054] transition-colors">
                  Terms and Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#2c3440] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#667788]">
          <p>&copy; {new Date().getFullYear()} Chitra Lekha. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Inspired by cinematic visual journals and thoughtful commentary.</p>
        </div>
      </div>
    </footer>
  );
};
