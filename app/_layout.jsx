import AsyncStorage from '@react-native-async-storage/async-storage';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useContext, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import 'react-native-reanimated';
import { AuthContext, AuthProvider } from "./Context";

import CalendarTime from "./CalendarPage.jsx";
import LoginPage from "./Login";
import Index from "./MainScreen.jsx";
import RegTime from "./RegTime.jsx";

import ArticleList from "../components/ArticleListPicker.jsx";
import Calendar from "../components/CalendarBig.jsx";
import ToDoCalendar from "../components/CalenderTodo.jsx";
import DatePicker from "../components/DatePicker.jsx";
import EventCellPopup from "../components/EventCellPopup.jsx";
import TimePicker from "../components/TimePicker.jsx";
import ValueList from "../components/ValueListPicker.jsx";

import { useNavigation } from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
const Stack = createNativeStackNavigator();

export default function RootLayout() {

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    SilkaRegular: require('../assets/fonts/silka-regular-webfont.ttf'),
    SilkaItalic: require('../assets/fonts/silka-regularitalic-webfont.ttf')
  });


  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <AuthConsumer />
    </AuthProvider>
  );
}

function AuthConsumer() {
  const { token } = useContext(AuthContext);

  const navigation = useNavigation();

  useEffect(() => {
    const loadToken = async () => {
      const savedToken = await AsyncStorage.getItem("auth");
      if (savedToken) {
        setToken(savedToken)
      }
    };
    loadToken();
  }, [])

  return (
    <ThemeProvider value={DefaultTheme}>
      {!token ? (
        <LoginPage />
      ) : (
        <Stack.Navigator>
          <Stack.Group screenOptions={{ headerStyle: { backgroundColor: '#FFFFFF' }, headerBackTitle: "Tillbaka" }}>
            <Stack.Screen name="Main" options={{ headerShown: false }} component={Index} />
            <Stack.Screen name="Regga Tid" component={RegTime} options={{ title: "" }} />
            <Stack.Screen name="Tider"
              component={CalendarTime}
            // options={{
            //   headerRight: () => (<TouchableOpacity onPress={ToRegPage}><Image style={styles.addCircleImg} source={addCircle} /></TouchableOpacity>)
            // }} 
            />
          </Stack.Group>
          <Stack.Group >
            <Stack.Screen name="TimePicker" component={TimePicker} />
            <Stack.Screen name="ValueList" component={ValueList} />
            <Stack.Screen name="Calendar" component={Calendar} />
            <Stack.Screen name="ArticleList" component={ArticleList} />
            <Stack.Screen name="EventCellPopup" component={EventCellPopup} />
            <Stack.Screen name="TodoCalendar" component={ToDoCalendar} />
            <Stack.Screen name="DatePicker" component={DatePicker} />
          </Stack.Group>
        </Stack.Navigator>
      )}
      <StatusBar style="dark" />
    </ThemeProvider>
  )
}

const styles = StyleSheet.create({
  addCircleImg: {
    tintColor: "black",
    backgroundColor: "white"

  }
})