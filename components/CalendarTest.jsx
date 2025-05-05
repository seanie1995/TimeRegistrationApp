import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, FlatList, Text, TouchableOpacity } from 'react-native';
import { debounce } from 'lodash'
import { AuthContext } from '../app/Context';
import { useNavigation } from 'expo-router';

const CalendarTest = () => {

    const HourBlock = ({ title }) => (
        <View style={styles.flatListHours}>
            <Text style={styles.hourText}>{title}</Text>
        </View>
    )

    const activityHour = "08:00:00";

    

    const ActivityBlock = () => (
        <View style={styles.activityBlock} >
            <Text style={styles.activityTitle}>Activity Block</Text>
        </View>
    )

    const GenerateHourIndex = () => {
        const hoursIndex = []
        for (let h = 8; h <= 17; h++) {
            hoursIndex.push(h.toString().padStart(2, "0"))
        }

        return hoursIndex;
    }

    const hoursIndex = GenerateHourIndex();

    function CalculateHours(startTime, endTime) {

        const start = new Date(`1970-01-01T${startTime}`);
        const end = new Date(`1970-01-01T${endTime}`);

        const diffMs = end - start;
        const diffHours = diffMs / (1000 * 60 * 60);

        return diffHours;
    }

    const ActivityStartFinder = (hour) => {
       
        const time = hour.slice(0, 2)

        const targetHour = hoursIndex.indexOf(time)

        const targetStart = targetHour * 30

        return targetStart
    }

    const hours = [
        "08.00", "09.00", "10.00", "11.00", "12.00", "13.00", "14.00", "15.00", "16.00", "17.00"
    ];

   

    return (
        <View style={styles.flatlistContainer}>
            <FlatList
                data={hours}
                keyExtractor={item => String(item)}
                renderItem={({ item }) => <HourBlock title={item} />}
            />
            <ActivityBlock />
        </View>
    )
}

export default CalendarTest

// 1 Hour === 30px
// 1 Activity per hour === 330px

const styles = StyleSheet.create({
    flatlistContainer: {
        marginTop: 100,
        marginLeft: 10,
        marginRight: 10
    },

    flatListHours: {
        width: 370,
        // marginTop: 20,
        height: 40,
        gap: 20,
        borderColor: "#2C33401A",
        borderStyle: "solid",
        borderTopWidth: 1,
        flexDirection: "row"
    },
    hourText: {
        fontSize: 12,
        fontFamily: "SilkaRegular",
        color: "##2C334066"
    },
    activityBlock: {
        backgroundColor: "#90D5FF",
        position: "absolute",
        marginLeft: 40,
        height: 40,
        width: 330,
        borderRadius: 5,

    },
    activityTitle: {
        padding: 5
    }

})