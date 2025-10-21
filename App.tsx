import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { ArtGallery } from './components/ArtGallery';
import { UploadModal } from './components/UploadModal';
import { ProfileModal } from './components/ProfileModal';
import { ImageViewerModal } from './components/ImageViewerModal';
import type { Artwork, Profile } from './types';
import { DUMMY_ARTWORKS, DEFAULT_PROFILE } from './constants';

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [viewingArtwork, setViewingArtwork] = useState<Artwork | null>(null);

  const [artworks, setArtworks] = useState<Artwork[]>(() => {
    try {
      const savedArtworks = localStorage.getItem('artworks');
      if (savedArtworks) {
        const parsedArtworks = JSON.parse(savedArtworks);
        return parsedArtworks.map((art: any) => ({
          ...art,
          timestamp: new Date(art.timestamp),
          likes: art.likes ?? 0,
        }));
      }
    } catch (error) {
      console.error("Failed to load artworks from local storage:", error);
    }
    return DUMMY_ARTWORKS;
  });
  
  const [ownedArtworkIds, setOwnedArtworkIds] = useState<Set<string>>(() => {
    try {
      const savedOwnedIds = localStorage.getItem('ownedArtworkIds');
      return savedOwnedIds ? new Set(JSON.parse(savedOwnedIds)) : new Set();
    } catch (error) {
      console.error("Failed to load owned artwork IDs from local storage:", error);
      return new Set();
    }
  });

  const [likedArtworkIds, setLikedArtworkIds] = useState<Set<string>>(() => {
    try {
      const savedLikedIds = localStorage.getItem('likedArtworkIds');
      return savedLikedIds ? new Set(JSON.parse(savedLikedIds)) : new Set();
    } catch (error) {
      console.error("Failed to load liked artwork IDs from local storage:", error);
      return new Set();
    }
  });

  const [profile, setProfile] = useState<Profile>(() => {
    try {
      const savedProfile = localStorage.getItem('profile');
      return savedProfile ? JSON.parse(savedProfile) : DEFAULT_PROFILE;
    } catch (error) {
      console.error("Failed to load profile from local storage:", error);
      return DEFAULT_PROFILE;
    }
  });

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('artworks', JSON.stringify(artworks));
    } catch (error) {
      console.error("Failed to save artworks to local storage:", error);
    }
  }, [artworks]);

  useEffect(() => {
    try {
      localStorage.setItem('ownedArtworkIds', JSON.stringify(Array.from(ownedArtworkIds)));
    } catch (error) {
      console.error("Failed to save owned artwork IDs to local storage:", error);
    }
  }, [ownedArtworkIds]);

  useEffect(() => {
    try {
      localStorage.setItem('likedArtworkIds', JSON.stringify(Array.from(likedArtworkIds)));
    } catch (error) {
      console.error("Failed to save liked artwork IDs to local storage:", error);
    }
  }, [likedArtworkIds]);

  useEffect(() => {
    try {
      localStorage.setItem('profile', JSON.stringify(profile));
    } catch (error) {
      console.error("Failed to save profile to local storage:", error);
    }
  }, [profile]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#artwork/')) {
        const artworkId = hash.substring('#artwork/'.length);
        const artworkToView = artworks.find(art => art.id === artworkId);
        if (artworkToView) {
          setViewingArtwork(artworkToView);
          // Optional: Clear hash so modal doesn't reopen on every refresh
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      }
    };
    
    handleHashChange(); // Check hash on initial load
  }, [artworks]);

  const handleOpenModal = useCallback(() => setIsModalOpen(true), []);
  const handleCloseModal = useCallback(() => setIsModalOpen(false), []);
  const handleOpenProfileModal = useCallback(() => setIsProfileModalOpen(true), []);
  const handleCloseProfileModal = useCallback(() => setIsProfileModalOpen(false), []);
  
  const handleViewArtwork = useCallback((artwork: Artwork) => setViewingArtwork(artwork), []);
  const handleCloseViewer = useCallback(() => setViewingArtwork(null), []);

  const handleUploadArtwork = useCallback((artworkData: Omit<Artwork, 'id' | 'timestamp' | 'likes'>) => {
    try {
        const newArt: Artwork = {
          ...artworkData,
          id: crypto.randomUUID(),
          timestamp: new Date(),
          likes: 0,
        };
        setArtworks(prevArtworks => [newArt, ...prevArtworks]);
        setOwnedArtworkIds(prevIds => new Set(prevIds).add(newArt.id));
        setIsModalOpen(false);
    } catch (error) {
        console.error("Error creating new artwork:", error);
    }
  }, []);

  const handleDeleteArtwork = useCallback((idToDelete: string) => {
    setArtworks(prevArtworks => prevArtworks.filter(art => art.id !== idToDelete));
    setOwnedArtworkIds(prevIds => {
      const newIds = new Set(prevIds);
      newIds.delete(idToDelete);
      return newIds;
    });
  }, []);

  const handleToggleLike = useCallback((artworkId: string) => {
    const isLiked = likedArtworkIds.has(artworkId);
    
    setArtworks(prevArtworks =>
      prevArtworks.map(art =>
        art.id === artworkId
          ? { ...art, likes: isLiked ? art.likes - 1 : art.likes + 1 }
          : art
      )
    );

    setLikedArtworkIds(prevIds => {
      const newIds = new Set(prevIds);
      if (isLiked) {
        newIds.delete(artworkId);
      } else {
        newIds.add(artworkId);
      }
      return newIds;
    });
  }, [likedArtworkIds]);

  const handleProfileUpdate = useCallback((newProfile: Profile) => {
    setProfile(newProfile);
    handleCloseProfileModal();
  }, [handleCloseProfileModal]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredArtworks = artworks.filter(artwork => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      artwork.title.toLowerCase().includes(query) ||
      (artwork.artist && artwork.artist.toLowerCase().includes(query)) ||
      artwork.tags.some(tag => tag.toLowerCase().includes(query))
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header
        onUploadClick={handleOpenModal}
        onProfileClick={handleOpenProfileModal}
        profile={profile}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />
      <main className="container mx-auto px-4 py-8">
        {artworks.length > 0 && filteredArtworks.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-3xl font-semibold text-gray-600">No Artworks Found</h2>
            <p className="mt-4 text-gray-500">Your search for "{searchQuery}" did not match any artworks.</p>
          </div>
        ) : (
          <ArtGallery 
            artworks={filteredArtworks} 
            ownedArtworkIds={ownedArtworkIds}
            onDeleteArtwork={handleDeleteArtwork}
            profile={profile}
            likedArtworkIds={likedArtworkIds}
            onToggleLike={handleToggleLike}
            onViewArtwork={handleViewArtwork}
          />
        )}
      </main>
      {isModalOpen && (
        <UploadModal onClose={handleCloseModal} onUpload={handleUploadArtwork} profile={profile} />
      )}
      {isProfileModalOpen && (
        <ProfileModal 
          onClose={handleCloseProfileModal} 
          onSave={handleProfileUpdate} 
          currentProfile={profile} 
        />
      )}
      {viewingArtwork && (
        <ImageViewerModal
          isOpen={!!viewingArtwork}
          onClose={handleCloseViewer}
          artwork={viewingArtwork}
        />
      )}
    </div>
  );
};

export default App;