import { LogBox } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MainNavigator } from './navigations/MainNavigator';

LogBox.ignoreLogs(['InteractionManager has been deprecated']);

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <MainNavigator />
    </>
  );
}
