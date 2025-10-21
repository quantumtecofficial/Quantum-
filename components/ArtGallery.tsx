
import React from 'react';
import type { Artwork, Profile } from '../types';
import { ArtCard } from './ArtCard';

interface ArtGalleryProps {
  artworks: Artwork[];
  ownedArtworkIds: Set<string>;
  onDeleteArtwork: (id: string) => void;
  profile: Profile;
  likedArtworkIds: Set<string>;
  onToggleLike: (id: string) => void;
  onViewArtwork: (artwork: Artwork) => void;
}

export const ArtGallery: React.FC<ArtGalleryProps> = ({ artworks, ownedArtworkIds, onDeleteArtwork, profile, likedArtworkIds, onToggleLike, onViewArtwork }) => {
  if (artworks.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-semibold text-gray-600">The gallery is empty.</h2>
        <p className="mt-4 text-gray-500">Be the first to share your masterpiece!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {artworks.map((artwork) => (
        <ArtCard
          key={artwork.id}
          artwork={artwork}
          isOwner={ownedArtworkIds.has(artwork.id)}
          onDelete={onDeleteArtwork}
          profile={profile}
          isLiked={likedArtworkIds.has(artwork.id)}
          onToggleLike={onToggleLike}
          onView={onViewArtwork}
        />
      ))}
    </div>
  );
};