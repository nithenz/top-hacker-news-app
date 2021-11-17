import {Story, User} from '@model';

export interface IHackerNewsApi {
  /**
   * Fetches top stories
   */
  fetchTopStories: () => Promise<number[]>;

  /**
   * Fetches story details
   */
  fetchStory: (storyId: number) => Promise<Story>;

  /**
   * Fetches user details
   */
  fetchUser: (userId: string) => Promise<User>;
}

export const HackerNewsApi: IHackerNewsApi = {
  fetchTopStories: async () => {
    try {
      const response = await fetch(
        'https://hacker-news.firebaseio.com/v0/topstories.json',
      );

      const data = await response.json();

      return data as number[];
    } catch (err) {
      throw err;
    }
  },
  fetchStory: async storyId => {
    try {
      const response = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${storyId}.json`,
      );

      const data = await response.json();

      return data as Story;
    } catch (err) {
      throw err;
    }
  },
  fetchUser: async (userId: string) => {
    try {
      const response = await fetch(
        `https://hacker-news.firebaseio.com/v0/user/${userId}.json`,
      );

      const data = await response.json();

      return data as User;
    } catch (err) {
      throw err;
    }
  },
};

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// Or we can do like this, using fetch factory:
//
// const invokeFetch = async <T>(url: string): Promise<T> => {
//   try {
//     const response = await fetch(url);

//     const data = await response.json();

//     return data as T;
//   } catch (err) {
//     throw err;
//   }
// };

// export const HackerNewsApi: IHackerNewsApi = {
//   fetchTopStories: () =>
//     invokeFetch<number[]>(
//       'https://hacker-news.firebaseio.com/v0/topstories.json',
//     ),
//   fetchStory: storyId =>
//     invokeFetch<Story>(
//       `https://hacker-news.firebaseio.com/v0/item/${storyId}.json`,
//     ),
//   fetchUser: userId =>
//     invokeFetch<User>(
//       `https://hacker-news.firebaseio.com/v0/user/${userId}.json`,
//     ),
// };
