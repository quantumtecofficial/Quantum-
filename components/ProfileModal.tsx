
import React, { useState, useCallback } from 'react';
import type { Profile } from '../types';
import { CloseIcon } from './icons/CloseIcon';
import { Avatar } from './Avatar';
import { AVAILABLE_AVATARS } from '../constants';

interface ProfileModalProps {
  onClose: () => void;
  onSave: (profile: Profile) => void;
  currentProfile: Profile;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ onClose, onSave, currentProfile }) => {
  const [displayName, setDisplayName] = useState(currentProfile.displayName);
  const [avatarUrl, setAvatarUrl] = useState(currentProfile.avatarUrl);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (displayName.trim()) {
      onSave({ displayName: displayName.trim(), avatarUrl });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Edit Your Profile</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-6">
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              maxLength={50}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Choose Avatar</label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {AVAILABLE_AVATARS.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setAvatarUrl(key)}
                  className={`rounded-full focus:outline-none transition-all duration-200 ${
                    avatarUrl === key
                      ? 'ring-4 ring-indigo-500 ring-offset-2'
                      : 'ring-2 ring-transparent hover:ring-indigo-300'
                  }`}
                  aria-label={`Select avatar ${key}`}
                >
                  <Avatar avatarUrl={key} className="w-full h-full" />
                </button>
              ))}
            </div>
          </div>
        </form>
        <div className="p-5 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={!displayName.trim()}
            className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
};
