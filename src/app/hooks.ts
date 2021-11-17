import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppReduxState} from '@store';
import {fetchTopStories as fetchTopStoriesThunk} from '@store/topStories/thunks';
import {TopStoriesActions} from '@store/topStories';

export function useTopStories() {
  const topStories = useSelector(
    (state: AppReduxState) => state.topStories.stories,
  );
  const dispatch = useDispatch();

  const fetchTopStories = useCallback(() => {
    dispatch(fetchTopStoriesThunk());
  }, [dispatch]);

  const resetStories = useCallback(() => {
    dispatch(TopStoriesActions.reset());
  }, [dispatch]);

  return {topStories, fetchTopStories, resetStories};
}
