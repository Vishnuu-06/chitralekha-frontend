import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ContentCard } from '../components/ContentCard';
import { NotFoundPage } from '../pages/NotFoundPage';
import { AuthProvider } from '../context/AuthContext';
import { ContentItem } from '../types';

describe('Chitra Lekha Frontend Component Suite', () => {
  it('renders Navbar with brand wordmark and core category links', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('CHITRA LEKHA')).toBeInTheDocument();
    expect(screen.getByText('Discover')).toBeInTheDocument();
    expect(screen.getByText('Movies')).toBeInTheDocument();
    expect(screen.getByText('TV Shows')).toBeInTheDocument();
    expect(screen.getByText('Anime')).toBeInTheDocument();
    expect(screen.getByText('Books')).toBeInTheDocument();
    expect(screen.getByText('Lists')).toBeInTheDocument();
  });

  it('renders Footer with mandatory legal links to Privacy Policy and Terms', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Terms and Conditions')).toBeInTheDocument();
    expect(screen.getByText(/The Movie Database/)).toBeInTheDocument();
  });

  it('renders ContentCard with title, category badge, and rating score', () => {
    const mockItem: ContentItem = {
      id: 101,
      contentType: 'MOVIE',
      provider: 'TMDB',
      externalId: 'tmdb-101',
      title: 'Solaris',
      releaseYear: 1972,
      averageRating: 8.9,
      ratingsCount: 42,
      posterUrl: 'https://image.tmdb.org/t/p/w500/solaris.jpg',
    };

    render(
      <BrowserRouter>
        <AuthProvider>
          <ContentCard item={mockItem} />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Solaris')).toBeInTheDocument();
    expect(screen.getByText('Film')).toBeInTheDocument();
    expect(screen.getByText('1972')).toBeInTheDocument();
    expect(screen.getByText('8.9')).toBeInTheDocument();
  });

  it('renders NotFoundPage with return link to home', () => {
    render(
      <BrowserRouter>
        <NotFoundPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    expect(screen.getByText('Return to Home')).toBeInTheDocument();
  });
});
