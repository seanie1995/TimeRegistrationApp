import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Platform, ScrollView } from 'react-native';

import { AuthContext } from '../app/Context';

const TimePicker = () => {

    const { setSelectedStartTime, setSelectedEndTime, isStartTime, setTimePickerVisible, selectedStartTime, selectedEndTime, setTriggerModalChange, triggerModalChange } = useContext(AuthContext)
    const [selectedHour, setSelectedHour] = useState('00');
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
        setTriggerModalChange(prev => !prev);
        if (isStartTime) {
            const chosenTime = `${selectedHour}:${selectedMinute}`;
            setSelectedStartTime(chosenTime);
        } else {
            const chosenTime = `${selectedHour}:${selectedMinute}`;
            setSelectedEndTime(chosenTime);
        }
        setTimePickerVisible(false);
    };

    const handleCancel = () => {
        setTimePickerVisible(false);
    };

    return (
        <View style={styles.modalContainer}>
            <Text style={styles.modalSelectedTimeText}>
                Välj Tid
            </Text>

            <View style={styles.modalPickerContainer}>
                <ScrollView horizontal={true} contentContainerStyle={styles.pickerRow}>
                    <View style={styles.pickerItem}>
                        <Text style={styles.pickerLabel}>Hour</Text>
                        <ScrollView style={styles.scrollableList}>
                            {hours.map(hour => (
                                <TouchableOpacity key={hour} onPress={() => setSelectedHour(hour)}>
                                    <Text style={styles.pickerValue}>{hour}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    <View style={styles.pickerItem}>
                        <Text style={styles.pickerLabel}>Minute</Text>
                        <ScrollView style={styles.scrollableList}>
                            {minutes.map(min => (
                                <TouchableOpacity key={min} onPress={() => setSelectedMinute(min)}>
                                    <Text style={styles.pickerValue}>{min}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </ScrollView>
            </View>

            <View style={styles.modalButtonContainer}>
                <TouchableOpacity style={styles.modalButton} onPress={handleConfirm}>
                    <Text style={styles.modalButtonText}>Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButtonCancel} onPress={handleCancel}>
                    <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: "auto",
        borderRadius: 10,
        backgroundColor: "white",
        width: 300
    },
    modalSelectedTimeText: {
        fontSize: 18,
        paddingTop: 20,
    },
    modalPickerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
        width: '100%',
    },
    pickerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    pickerItem: {
        marginHorizontal: 10,
        alignItems: 'center',
    },
    pickerLabel: {
        fontSize: 14,
        marginBottom: 5,
    },
    scrollableList: {
        maxHeight: 150, // Limit the height of the scrollable area
        width: 80, // Width for the scrollable list
    },
    pickerValue: {
        fontSize: 18,
        padding: 10,
        textAlign: 'center',
    },
    modalButtonContainer: {
        flexDirection: "row",
        marginTop: 50,
    },
    modalButton: {
        backgroundColor: '#2C3340',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        marginRight: 10,
        width: 90,
        alignItems: "center",
    },
    modalButtonCancel: {
        backgroundColor: '#E75441',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        marginLeft: 10,
        width: 80,
        alignItems: "center",
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default TimePicker;
