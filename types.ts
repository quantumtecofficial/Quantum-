
export interface Profile {
  displayName: string;
  avatarUrl: string;
}

export interface Comment {
  id: number;
  text: string;
  timestamp: Date;
  author: Profile;
}

export interface Artwork {
  id: string;
  imageUrl: string;
  title: string;
  artist: string;
  tags: string[];
  timestamp: Date;
  likes: number;
}