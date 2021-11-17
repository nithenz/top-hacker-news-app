import {configureStore} from '@reduxjs/toolkit';
import {topStoriesSlice} from './topStories';

const reducer = {
  topStories: topStoriesSlice.reducer,
};

const preloadedState = {};

export const rootStore = configureStore({
  reducer,
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState,
});

export default rootStore;
