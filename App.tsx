import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Navigation from './Src/Navigation';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Navigation />
    </GestureHandlerRootView>
  );
}
