import React, {FC, useCallback} from 'react';
import {
  StyleSheet,
  View,
  Text,
  useColorScheme,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import {Story, User} from '@model';
import {AppColors} from '@ui/theme';
import {format as formatTimeAgo} from 'timeago.js';
import {
  BarChart2 as BarChartIcon,
  ExternalLink as ExternalLinkIcon,
} from 'react-native-feather';
import {AppReduxState} from '@store';
import {useSelector} from 'react-redux';
import {StoryItem} from '@store/topStories';
import {extractDomainFromUrl} from '@utils/string';

export interface StoryCardProps {
  story?: Story;
  author?: User;
  state?: StoryItem['state'];
}

export const StoryCard: FC<StoryCardProps> = props => {
  const isDarkMode = useColorScheme() === 'dark';

  const {story, state} = props;
  const {title, score = 0, by, time, url} = story || {};

  const loading = state === 'loading';

  const authorScore = useSelector((reduxState: AppReduxState) =>
    story?.by ? reduxState.topStories.authors[story.by]?.karma : null,
  );

  const handleUrlOpenPress = useCallback(() => {
    if (!url) {
      return;
    }

    (async () => {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(`Don't know how to open this URL: ${url}`);
      }
    })();
  }, [url]);

  const timeAgo = time && formatTimeAgo(time * 1000);
  const urlDomain = url && extractDomainFromUrl(url);

  const containerStyle = {backgroundColor: isDarkMode ? '#181818' : 'white'};
  const textStyle = {color: isDarkMode ? 'white' : 'black'};
  const authorKarmaScoreBadgeStyle = {
    backgroundColor: isDarkMode ? '#333' : '#eee',
    paddingHorizontal: 12,
    width: authorScore || authorScore === 0 ? 'auto' : 96,
  };
  const urlButtonStyle = {backgroundColor: isDarkMode ? '#2d2d2d' : '#f3f3f3'};
  const scoreBadgeStyle = (scoreValue: number) => ({
    backgroundColor:
      scoreValue > 100 ? AppColors.scoreGreen : AppColors.scoreRed,
  });

  const contentNode = (
    <>
      {(!!timeAgo || !!urlDomain) && (
        <Text style={[styles.timeAgo]}>
          {`${timeAgo}${timeAgo && urlDomain ? ' - ' : ''}${urlDomain}`}
        </Text>
      )}

      {title && (
        <Text style={[styles.title, textStyle]} ellipsizeMode="tail">
          {title}
        </Text>
      )}

      {by && <Text style={[styles.username]}>{`@${by}`}</Text>}

      <View style={[styles.scoresContainer]}>
        {score && (
          <View
            style={[
              styles.scoreBadge,
              scoreBadgeStyle(score),
              styles.storyScoreBadge,
            ]}>
            <BarChartIcon
              color={AppColors.white}
              style={styles.scoreBarChartIcon}
              height={13}
              strokeWidth={3.5}
            />
            <Text style={[styles.scoreText]}>{score}</Text>
          </View>
        )}

        <View style={[styles.scoreBadge, authorKarmaScoreBadgeStyle]}>
          <Text style={[styles.scoreText, styles.authorKarmaScoreText]}>
            {authorScore ? `${authorScore} Author karma` : ' '}
          </Text>
        </View>

        {url && (
          <TouchableOpacity
            activeOpacity={0.6}
            style={[styles.urlButton, urlButtonStyle]}
            onPress={handleUrlOpenPress}>
            <ExternalLinkIcon strokeWidth={3} height={14} color={'#d0d0d0'} />
          </TouchableOpacity>
        )}
      </View>
    </>
  );
  const loadingNode = <></>;

  return (
    <TouchableOpacity
      activeOpacity={isDarkMode ? 0.85 : 0.65}
      onPress={handleUrlOpenPress}
      style={[
        styles.container,
        containerStyle,
        !isDarkMode ? styles.containerShadowStyle : {},
      ]}>
      {loading ? loadingNode : contentNode}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    flex: 1,
    height: 196,
    marginVertical: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  timeAgo: {
    marginBottom: 6,
    fontWeight: '600',
    fontSize: 12,
    color: AppColors.darkGray,
  },
  urlButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 20,
    marginLeft: 'auto',
  },
  containerShadowStyle: {
    shadowOffset: {
      height: 5,
      width: 7,
    },
    shadowColor: AppColors.black,
    shadowOpacity: 0.1,
    shadowRadius: 15,
  },
  scoreBarChartIcon: {
    marginBottom: 1,
  },
  authorKarmaScoreText: {
    color: '#a0a0a0',
  },
  username: {
    fontWeight: '600',
    fontSize: 14,
    marginTop: 6,
    color: AppColors.darkGray,
  },
  scoresContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    alignItems: 'flex-end',
    marginTop: 'auto',
    height: 26,
  },
  scoreBadge: {
    marginRight: 10,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  storyScoreBadge: {
    paddingLeft: 6,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
    color: AppColors.white,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    maxHeight: 48,
    overflow: 'hidden',
  },
});
