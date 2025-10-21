
import React, { useState, useCallback } from 'react';
import type { Artwork, Comment, Profile } from '../types';
import { HeartIcon } from './icons/HeartIcon';
import { CommentIcon } from './icons/CommentIcon';
import { TrashIcon } from './icons/TrashIcon';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { Avatar } from './Avatar';
import { EyeIcon } from './icons/EyeIcon';
import { ImageIcon } from './icons/ImageIcon';
import { ShareIcon } from './icons/ShareIcon';

interface ArtCardProps {
  artwork: Artwork;
  isOwner: boolean;
  onDelete: (id: string) => void;
  profile: Profile;
  isLiked: boolean;
  onToggleLike: (id: string) => void;
  onView: (artwork: Artwork) => void;
}

const CommentSection: React.FC<{
  comments: Comment[];
  onAddComment: (text: string) => void;
}> = ({ comments, onAddComment }) => {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onAddComment(commentText.trim());
      setCommentText('');
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
          className="flex-grow bg-gray-100 border border-gray-300 rounded-full py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          type="submit"
          className="bg-indigo-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-indigo-600 disabled:bg-gray-300"
          disabled={!commentText.trim()}
        >
          Post
        </button>
      </form>
      <div className="mt-4 space-y-3 max-h-40 overflow-y-auto pr-2">
        {comments.map((comment) => (
           <div key={comment.id} className="flex items-start gap-2.5 text-sm">
             <Avatar avatarUrl={comment.author.avatarUrl} className="h-8 w-8 flex-shrink-0 mt-0.5" />
             <div className="flex-grow">
               <p className="font-bold text-gray-800 text-xs">{comment.author.displayName}</p>
               <p className="bg-gray-100 rounded-lg py-1.5 px-2.5 mt-0.5">{comment.text}</p>
             </div>
           </div>
        ))}
         {comments.length === 0 && <p className="text-xs text-gray-400 text-center py-2">No comments yet.</p>}
      </div>
    </div>
  );
};

export const ArtCard: React.FC<ArtCardProps> = ({ artwork, isOwner, onDelete, profile, isLiked, onToggleLike, onView }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isCopied, setIsCopied] = useState(false);


  const handleLike = useCallback(() => {
    onToggleLike(artwork.id);
  }, [artwork.id, onToggleLike]);

  const handleAddComment = useCallback((text: string) => {
    const newComment: Comment = {
      id: Date.now(),
      text,
      timestamp: new Date(),
      author: profile,
    };
    setComments((prev) => [newComment, ...prev].sort((a,b) => b.id - a.id));
  }, [profile]);
  
  const handleDeleteClick = useCallback(() => {
    setIsConfirmModalOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    onDelete(artwork.id);
    setIsConfirmModalOpen(false);
  }, [artwork.id, onDelete]);

  const handleCloseConfirmModal = useCallback(() => {
    setIsConfirmModalOpen(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const handleShare = useCallback(() => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#artwork/${artwork.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    });
  }, [artwork.id]);

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col">
        <div className="relative group">
          {imageError ? (
            <div className="w-full aspect-[4/3] bg-gray-100 flex items-center justify-center text-gray-400" aria-label="Image failed to load">
              <ImageIcon className="h-12 w-12" />
            </div>
          ) : (
            <>
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                className="w-full object-cover aspect-[4/3]"
                onError={handleImageError}
              />
              <div 
                onClick={!imageError ? () => onView(artwork) : undefined}
                className={`absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${!imageError ? 'cursor-pointer' : ''}`}
                role="button"
                aria-label="View larger image"
              >
                {!imageError && <EyeIcon className="h-10 w-10 text-white drop-shadow-lg" />}
              </div>
            </>
          )}
          {isOwner && (
            <button
              onClick={handleDeleteClick}
              className="absolute top-2 right-2 bg-black/50 p-2 rounded-full text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75 transition-colors"
              aria-label="Delete artwork"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          )}
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-gray-900 truncate">{artwork.title}</h3>
          {artwork.artist && (
            <p className="text-sm text-gray-500 mt-1">by {artwork.artist}</p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            {artwork.tags.map((tag) => (
              <span
                key={tag}
                className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex-grow flex items-end justify-between text-gray-500">
            <div className="flex items-center gap-4">
              <button onClick={handleLike} className="flex items-center gap-1.5 group">
                <HeartIcon
                  className={`h-6 w-6 transition-colors duration-200 ${
                    isLiked ? 'text-red-500 fill-current' : 'text-gray-400 group-hover:text-red-400'
                  }`}
                />
                <span className="font-semibold text-sm">{artwork.likes}</span>
              </button>
              <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center gap-1.5 group"
              >
                <CommentIcon className="h-6 w-6 text-gray-400 group-hover:text-indigo-500" />
                <span className="font-semibold text-sm">{comments.length}</span>
              </button>
            </div>
             <div className="relative">
                <button onClick={handleShare} className="flex items-center gap-1.5 group">
                    <ShareIcon className="h-6 w-6 text-gray-400 group-hover:text-indigo-500" />
                </button>
                {isCopied && (
                    <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded-md px-2 py-1 whitespace-nowrap">
                        Copied!
                    </span>
                )}
            </div>
          </div>
          {showComments && <CommentSection comments={comments} onAddComment={handleAddComment} />}
        </div>
      </div>
      <ConfirmDeleteModal
        isOpen={isConfirmModalOpen}
        onClose={handleCloseConfirmModal}
        onConfirm={handleConfirmDelete}
        artworkTitle={artwork.title}
      />
    </>
  );
};