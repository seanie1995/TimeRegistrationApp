import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useContext, useState } from 'react'
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthContext } from './Context';

const LoginPage = ({ navigation }) => {

  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleLogin = async () => {
    await login(formData.username, formData.password);
    navigation.navigate('')
  }

  return (
    <SafeAreaProvider >
      <SafeAreaView style={styles.container}>
        <Image style={styles.logo} source={require('../assets/images/TidMojjenLogo.png')} />
        <Text>Användarnamn</Text>
        <TextInput
          style={styles.input}
          placeholder='Användarnamn'
          value={formData.username}
          onChangeText={(text) => handleChange('username', text)}
        />
        {/* <Text>Lösenord</Text>
        <TextInput
          style={styles.input}
          placeholder='Lösenord'
          value={formData.password}
          onChangeText={(text) => handleChange('password', text)}
          secureTextEntry={true}
        /> */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Logga In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default LoginPage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingBottom: 200
  },
  logo: {
    marginBottom: 25,
  },
  input: {
    height: 50,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 353,
    borderRadius: 12
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E75441",
    padding: 10,
    borderRadius: 12,
    width: 353,
    height: 50,
    textAlign: "center",
  },
  buttonContainer: {
    height: 50,
    margin: 12
  },
  buttonText: {
    color: "white"
  },
  loginBackground: {
    color: "#E3E3E9"
  }
});
