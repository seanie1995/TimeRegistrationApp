import { DarkTheme, DefaultTheme, ThemeProvider, } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useContext } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider, AuthContext } from "./Context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, Image, StyleSheet, Text } from 'react-native';

import LoginPage from "./Login"
import Index from "./MainScreen.jsx"
import RegTime from "./RegTimeCopy.jsx"
import CalendarTime from "./CalendarPage.jsx"

import TimePicker from "../components/TimePicker.jsx"
import ArticleList from "../components/ArticleListPicker.jsx"
import ValueList from "../components/ValueListPicker.jsx"
import CalendarTest from "../components/CalendarBig.jsx"
import EventCellPopup from "../components/EventCellPopup.jsx"

import addCircle from "../assets/images/add-circle.png";
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

  // const ToRegPage = () => {
  //   navigation.navigate("Regga Tid")
  // }

  return (
    <ThemeProvider value={DefaultTheme}>
      {!token ? (
        <LoginPage />
        // <EventCellPopup/>
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
            <Stack.Screen name="CalendarTest" component={CalendarTest} />
            <Stack.Screen name="ArticleList" component={ArticleList} />
            <Stack.Screen name="EventCellPopup" component={EventCellPopup}/>
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