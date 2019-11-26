import React from 'react';
import {
  SafeAreaView,
  StatusBar,
} from 'react-native';

import MineSweeper from './views/MinewseeperView';
import Colors from "./colors";


const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{backgroundColor: Colors.LightGreen, flex: 1, alignItems: "center"}}>
          <MineSweeper height={7} width={5} bombs={7}/>
      </SafeAreaView>
    </>
  );
};

export default App;
