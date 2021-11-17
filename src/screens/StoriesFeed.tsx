import React, {FC, useCallback, useEffect, useMemo} from 'react';
import {StoryCard} from '@components/StoryCard';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {useTopStories} from '@app/hooks';

const Colors = {
  black: 'black',
  white: 'white',
};

const styles = StyleSheet.create({
  topText: {
    marginVertical: 20,
    fontSize: 28,
    color: 'white',
    fontWeight: '800',
    paddingHorizontal: 24,
  },
  loaderContaienr: {
    marginVertical: 24,
  },
  safeAreaView: {
    height: '100%',
  },
  storiesContainer: {
    paddingHorizontal: 20,
    height: '90%',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export const StoriesFeed: FC = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const {topStories: stories, fetchTopStories, resetStories} = useTopStories();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? 'black' : 'white',
  };

  useEffect(() => {
    fetchTopStories();
  }, [fetchTopStories]);

  const handleRefresh = useCallback(() => {
    resetStories();
    fetchTopStories();
  }, [fetchTopStories, resetStories]);

  const topStoriesToShow = useMemo(() => {
    return stories
      .concat()
      .sort((a, b) => (a.story?.score || 0) - (b.story?.score || 0))
      .reverse();
  }, [stories]);

  const storiesLoading = (stories?.length ?? 0) < 10;
  const storiesFirstLoading = storiesLoading && !stories;
  const isRefreshing = !storiesFirstLoading && storiesLoading;

  const loadingNode = (
    <View style={styles.loaderContaienr}>
      <ActivityIndicator
        size="large"
        color={isDarkMode ? Colors.white : Colors.black}
      />
    </View>
  );

  const storiesListNode = (
    <FlatList
      style={styles.storiesContainer}
      data={topStoriesToShow}
      refreshing={isRefreshing}
      onRefresh={handleRefresh}
      renderItem={story => (
        <StoryCard
          state={story.item.state}
          story={story.item.story}
          author={story.item.author}
        />
      )}
    />
  );

  const textStyle = {color: isDarkMode ? Colors.white : Colors.black};

  return (
    <SafeAreaView style={[backgroundStyle, styles.safeAreaView]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      <View
        style={{
          backgroundColor: isDarkMode ? Colors.black : Colors.white,
        }}>
        <Text style={[styles.topText, textStyle]}>Top hacker news! 🔥</Text>

        {storiesFirstLoading ? loadingNode : storiesListNode}
      </View>
    </SafeAreaView>
  );
};

export default StoriesFeed;
