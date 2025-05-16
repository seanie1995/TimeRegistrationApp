import { Image, StyleSheet, Platform, View, Text, TextInput, TouchableOpacity, Alert, Button, Modal } from 'react-native';
import { useState, useEffect, useContext } from 'react'
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import axios from 'axios';
import { AuthProvider, AuthContext } from './Context';
import DatePicker from "../components/DatePicker"
import calendarLogo from "../assets/images/Calendar.png"

const Index = ({ navigation }) => {
  const { userName, logout, todaysDateNormal, yesterdaysDateNormal, todaysDateUS, yesterdaysDateUS, setChosenDate, chosenDate, chosenDateNormal, setChosenDateNormal } = useContext(AuthContext);

  const ToCalendarPage = (dateTitle, chosenDate) => {
    setChosenDate(chosenDate);
    navigation.navigate("Tider", { dateTitle, chosenDate });
  }

  const handleDateConfirm = ({dateUS, dateNormal}) => {
    setChosenDate(dateUS);
    setChosenDateNormal(dateNormal)
    setIsDatePickerOpen(false);
    ToCalendarPage(dateNormal, dateUS)
  }

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  return (
    <SafeAreaProvider>
      <Modal visible={isDatePickerOpen} transparent={true} animationType='slide' >
        <DatePicker
          onClose={() => setIsDatePickerOpen(false)}
          onConfirm={handleDateConfirm}

        />
      </Modal>
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

        <TouchableOpacity style={styles.väljEttDatumContainer} onPress={() => setIsDatePickerOpen(prev => !prev)} >
          <Text>Välj ett datum </Text><Image source={calendarLogo}/>
        </TouchableOpacity>

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
    marginTop: 15,
    padding: 5,

    flexDirection: "row"
  },


});
