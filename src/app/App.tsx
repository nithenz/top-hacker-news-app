import React, {FC} from 'react';
import {Provider as ReduxProvider} from 'react-redux';
import {rootStore} from '@store';
import {StoriesFeed} from '@screens/StoriesFeed';

export const App: FC = () => {
  return (
    <ReduxProvider store={rootStore}>
      <StoriesFeed />
    </ReduxProvider>
  );
};

export default App;
