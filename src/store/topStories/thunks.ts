import {createAsyncThunk} from '@reduxjs/toolkit';
import {Story, User} from '@model';
import {HackerNewsApi} from '@api/hacker-news';
import {AppReduxState} from '@store';
import {StoryItem} from './types';

const actionPrefix = 'topStories/';

const actionName = (operationName: string) => `${actionPrefix}${operationName}`;

/**
 * Fetches top stories and its authors
 */
export const fetchTopStories = createAsyncThunk<{stories: StoryItem[]}>(
  actionName('fetchTopStories'),
  async (_, {getState, dispatch}) => {
    const topStoriesIds = await HackerNewsApi.fetchTopStories();

    const state = getState() as AppReduxState;

    const loadStoriesPromises = topStoriesIds
      .slice(0, state.topStories.showCount)
      .map(
        storyId =>
          new Promise<Story>((resolve, reject) => {
            HackerNewsApi.fetchStory(storyId).then(resolve).catch(reject);
          }),
      );

    const results = await Promise.all(
      loadStoriesPromises.map(promise =>
        promise
          .then(value => {
            if (value.by) {
              dispatch(fetchStoryAuthor({userId: value.by}));
            }
            return {state: 'finished', story: value} as StoryItem;
          })
          .catch(() => ({state: 'error'} as StoryItem)),
      ),
    );

    return {stories: results};
  },
);

export const fetchStoryAuthor = createAsyncThunk<
  {
    author: User;
  },
  {userId: string},
  {rejectValue: string}
>(actionName('fetchStoryAuthor'), async ({userId}) => {
  const author = await HackerNewsApi.fetchUser(userId);
  console.log('user', userId, author.karma);
  return {author};
});

export const fetchAuthors = createAsyncThunk<{authors: User[]}>(
  actionName('fetchAuthors'),
  async (_, {getState}) => {
    const state = getState() as AppReduxState;

    const loadAuthorsPromises = state.topStories.stories
      .filter(story => !!story?.story?.by)
      .map(storyItem => HackerNewsApi.fetchUser(storyItem.story!.by!));

    const results = await Promise.all(
      loadAuthorsPromises.map(promise =>
        promise
          .then(value => value)
          .catch(() => {
            return null;
          }),
      ),
    );

    return {authors: results.filter(resultItem => !!resultItem) as User[]};
  },
);
