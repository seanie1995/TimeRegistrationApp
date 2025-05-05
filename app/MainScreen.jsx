import { Image, StyleSheet, Platform, View, Text, TextInput, TouchableOpacity, Alert, Button } from 'react-native';
import { useState, useEffect, useContext } from 'react'
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import axios from 'axios';
import { AuthProvider, AuthContext } from './Context';

const Index = ({ navigation }) => {
  const { userName, logout, todaysDateNormal, yesterdaysDateNormal, todaysDateUS, yesterdaysDateUS, setChosenDate } = useContext(AuthContext);

  const ToCalendarPage = (dateTitle, chosenDate) => {
    setChosenDate(chosenDate);
    navigation.navigate("Tider", {dateTitle, chosenDate});
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>

        {/* LOGO AND "LOGGED IN AS {USERNAME}" BANNER */}

        <Image source={require('../assets/images/TidMojjenLogo.png')} />
        <Text style={styles.inloggadSom}>Inloggad som {userName}</Text>

        {/* BUTTONS */}

        <TouchableOpacity>
          <Text style={styles.registerTimeToday} onPress={() => ToCalendarPage(todaysDateNormal, todaysDateUS)}> <Text style={{ fontWeight: "bold" }}>Dagens</Text> registrering</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.registerTimeYesterday} onPress={() => ToCalendarPage(yesterdaysDateNormal, yesterdaysDateUS)}> <Text style={{ fontWeight: "bold" }}>Gårdagens</Text> registrering</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.väljEttDatum} onPress={() => navigation.navigate("ArticleList")} >
          <Text>Välj ett datum</Text>
        </TouchableOpacity> */}

        <TouchableOpacity>
          <Text style={styles.logoutButton} onPress={logout}>Logga Ut</Text>
        </TouchableOpacity>

      </SafeAreaView>
      <SafeAreaView>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default Index

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 180,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: "80%"
  },
  inloggadSom: {
    marginTop: 50,
    fontSize: 16,
    color: "#70757F"
  },
  logoutButton: {
    marginTop: 15,
    padding: 15,
    backgroundColor: "#DC4C64",
    borderRadius: 20,
    color: "#FAFAFF"
  },
  registerTimeToday: {
    backgroundColor: "#2C3340",
    textAlign: "center",
    alignContent: 'center',
    marginTop: 15,
    padding: 15,
    borderRadius: 12,
    width: 335,
    color: "#FAFAFF"
  },
  registerTimeYesterday: {
    backgroundColor: "#9EA1AA",
    textAlign: "center",
    alignContent: 'center',
    marginTop: 15,
    padding: 15,
    borderRadius: 12,
    width: 335,
    color: "#FAFAFF"
  },
  väljEttDatumContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "red",
    borderWidth: 1
  },
  väljEttDatum: {
    marginTop: 15,

  },

});
