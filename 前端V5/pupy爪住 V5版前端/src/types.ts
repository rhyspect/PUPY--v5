import { LucideIcon } from 'lucide-react';

export type Screen = 'home' | 'tour' | 'market' | 'messages' | 'profile' | 'creation' | 'chat';

export interface NavItem {
  id: Screen;
  label: string;
  icon: string; // Material symbol name
}

export interface Owner {
  name: string;
  avatar: string;
  photos: string[];
  gender: '男' | '女' | '其他';
  age: number;
  residentCity: string;
  frequentCities: string[];
  hobbies: string[];
  mbti: string;
  signature: string;
}

export interface Pet {
  id: string;
  name: string;
  images: string[]; // Up to 4 photos
  type: string;
  gender: '公' | '母';
  personality: 'E系浓宠' | 'I系淡宠';
  hasPet: boolean;
  owner: Owner;
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
