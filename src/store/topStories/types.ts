import {Story, User} from '@model';

export type StoryState = 'loading' | 'finished' | 'error';

export interface StoryItem {
  story?: Story;
  author?: User;
  state: StoryState;
}

export interface TopStoriesState {
  stories: StoryItem[];
  showCount: number;
  authors: Record<string, User>;
}
