
import React from 'react';
import { avatarComponents } from './avatars';
import { DEFAULT_PROFILE } from '../constants';

interface AvatarProps extends React.SVGProps<SVGSVGElement> {
  avatarUrl: string;
}

export const Avatar: React.FC<AvatarProps> = ({ avatarUrl, ...props }) => {
  const AvatarComponent = avatarComponents[avatarUrl] || avatarComponents[DEFAULT_PROFILE.avatarUrl];
  return <AvatarComponent {...props} />;
};
