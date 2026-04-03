import { LucideIcon } from 'lucide-react';

export type Screen = 'home' | 'tour' | 'market' | 'messages' | 'profile' | 'creation' | 'chat';

export interface NavItem {
  id: Screen;
  label: string;
  icon: string; // Material symbol name
}

export interface Pet {
  id: string;
  name: string;
  age: number;
  breed: string;
  mbti?: string;
  tags: string[];
  distance: string;
  image: string;
  ownerAvatar: string;
  ownerName: string;
  ownerMbti?: string;
  ownerSignature?: string;
  status?: string;
}

export interface Realm {
  id: string;
  name: string;
  description: string;
  story: string;
  function: string;
  image: string;
  onlineCount: number;
  icon: string;
  active?: boolean;
}
