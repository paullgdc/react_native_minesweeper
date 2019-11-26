import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  Dimensions,
  ScrollView,
} from 'react-native';

import MineSweeper from './views/Minewseeper';
import Colors from "./colors";


const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{backgroundColor: Colors.LightGreen, flex: 1, alignItems: "center"}}>
        <ScrollView style={{flex: 1}}>
          <View style={{width: 0.8 * Dimensions.get('window').width}}>
            <MineSweeper height={7} width={5} bombs={7}/>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default App;
