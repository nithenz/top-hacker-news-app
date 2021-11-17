import {createSlice} from '@reduxjs/toolkit';
import {fetchStoryAuthor, fetchTopStories} from './thunks';
import {StoryItem, TopStoriesState} from './types';
export type {StoryItem, TopStoriesState} from './types';

const createEmptyStoriesState = (count: number) =>
  new Array(count).fill({state: 'loading'} as StoryItem);

const defaultShowCount = 10;

const initialState = {
  stories: createEmptyStoriesState(defaultShowCount),
  authors: {},
  showCount: defaultShowCount,
} as TopStoriesState;

export const topStoriesSlice = createSlice({
  name: 'topStories',
  initialState,
  reducers: {
    reset(state) {
      state.stories = createEmptyStoriesState(state.showCount);
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchTopStories.fulfilled, (state, action) => {
      state.stories = action.payload.stories;
    });

    builder.addCase(fetchStoryAuthor.fulfilled, (state, action) => {
      const {author} = action.payload;

      state.authors[author.id] = author;
      state.stories = state.stories.map(story => {
        if (story.story?.by === author.id) {
          return {...story, author};
        }

        return story;
      });
    });
  },
});

export const TopStoriesActions = topStoriesSlice.actions;
