import React from 'react';
import {
  SafeAreaView,
  StatusBar,
} from 'react-native';

import MineSweeperView from './views/MinewseeperView';
import Colors from "./colors";
import Header from './components/Header';


const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ backgroundColor: Colors.LightGreen, flex: 1, alignItems: "center" }}>
        <Header title="Minewseeper" />
        <MineSweeperView height={5} width={5} bombs={4} />
      </SafeAreaView>
    </>
  );
};

export default App;
