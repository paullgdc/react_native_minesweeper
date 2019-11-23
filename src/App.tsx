import React from 'react';
import {
  SafeAreaView,
  StatusBar,
} from 'react-native';

import MineSweeper from './views/Minewseeper';

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{backgroundColor: "brown", flex: 1}}>
          <MineSweeper height={4} width={4} bombs={1}/>
      </SafeAreaView>
    </>
  );
};

export default App;
