import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Platform, ScrollView, useColorScheme } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { AuthContext } from '../app/Context';

const TimePicker = ({ onClose, onSelect }) => {

    const [selectedHour, setSelectedHour] = useState('08');
    const [selectedMinute, setSelectedMinute] = useState('00');

    const generateHours = () => {
        const hours = [];
        for (let h = 0; h < 24; h++) {
            hours.push(h.toString().padStart(2, '0'));
        }
        return hours;
    };

    const generateMinutes = () => {
        const minutes = [];
        for (let m = 0; m < 60; m++) {
            minutes.push(m.toString().padStart(2, '0'));
        }
        return minutes;
    };

    const hours = generateHours();
    const minutes = generateMinutes();

    const handleConfirm = () => {
        const chosenTime = `${selectedHour}:${selectedMinute}`;
        onSelect(chosenTime);
    };

    const handleCancel = () => {
        onClose();
    };

    const colorScheme = useColorScheme()

    const dynamicStyles = StyleSheet.create({
        mainContainer: {
            backgroundColor: colorScheme === "dark" ? '#2C3340' : "#FAFAFF",
            width: 350,
            margin: "auto",
            marginTop: 250,
            height: 350,
            padding: 10,
            borderRadius: 10
        },  
      });
    
    return (
        <View style={dynamicStyles.mainContainer}>

            <View style={styles.container}>
                <Picker
                    selectedValue={selectedHour}
                    onValueChange={(itemValue) => setSelectedHour(itemValue)}
                    style={styles.timeContainer}       
                >
                    {hours.map((hour) => (
                        <Picker.Item
                            key={hour}
                            label={hour}
                            value={hour}              
                        />
                    ))}
                </Picker>
                <Picker
                    selectedValue={selectedMinute}
                    onValueChange={(itemValue) => setSelectedMinute(itemValue)}
                    style={styles.timeContainer}
                >
                    {minutes.map((minute) => (
                        <Picker.Item
                            key={minute}
                            label={minute}
                            value={minute}
                        />
                    ))}
                </Picker>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity>
                    <Text onPress={handleConfirm} style={styles.confirmButton}>Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={styles.cancelButton} onPress={handleCancel}>Avbryt</Text>
                </TouchableOpacity>
            </View>


        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: '#2C3340',
        width: 350,
        margin: "auto",
        marginTop: 250,
        height: 350,
        padding: 10,
        borderRadius: 10
    },  
    container: {
        flexDirection: "row",
        margin: "auto"
    },
    timeContainer: {
        width: 150,
       
    },
    buttonContainer: {
        flexDirection: "row",
        margin: "auto",
        gap: 20,
        padding: 20
    },
    confirmButton: {
        color: '#FAFFAF', 
        margin: "auto", 
        padding: 10, 
        backgroundColor: "#9EA1AA",
        borderRadius: 10
    },
    cancelButton: {
        color: '#FAFFAF', 
        margin: "auto", 
        padding: 10, 
        backgroundColor: "#DC4C64", 
        borderRadius: 10
    }
});

export default TimePicker;
