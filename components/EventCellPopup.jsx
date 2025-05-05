import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Platform, ScrollView, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { AuthContext } from "../app/Context.jsx"

const EventCellPopup = ({ project, onClose }) => {

    const {
        time_time_start,
        time_time_end,
        common_article_no,
        common_comment_customer,
        common_comment_internal,
        time_employee_id,
        recordId,
        time_chargable,
        time_not_worked
    } = project?.fieldData ?? {};

    const [chosenStartTime, setChosenStartTime] = useState(time_time_start);
    const [chosenEndTime, setChosenEndTime] = useState(time_time_end);
    const [customerComment, setCustomerComment] = useState(common_comment_customer)


    return (
        <View style={styles.mainContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>Kundkommentar</Text>
                <TextInput
                    multiline={true}
                    style={styles.commentTextInput}
                    placeholder='Kommentar till kund'
                    value={customerComment}
                    onChangeText={setCustomerComment}
                    // value={project.fieldData.time_not_worked}
                    placeholderTextColor="gray"
                >
                </TextInput>
                <View style={styles.timeContainer}>
                    <TextInput
                        style={styles.timeInput}
                        value={chosenStartTime.substring(0, 5)}
                        onChangeText={setChosenStartTime}
                        placeholderTextColor="gray"
                    />
                    <TextInput
                        style={styles.timeInput}
                        value={chosenEndTime.substring(0, 5)}
                        onChangeText={setChosenEndTime}
                        placeholderTextColor="gray"
                    />
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={onClose}>
                    <Text style={styles.confirmButton}>OK</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={styles.cancelButton}>Cancel</Text>
                </TouchableOpacity>
            </View>


        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: '#2C3340',
        width: 350,
        margin: "auto",
        marginTop: 250,
        // height: 350,
        padding: 10,
        borderRadius: 10
    },
    container: {
        flexDirection: "column",
        margin: "auto",
        gap: 10,
        top: 10

    },
    timeContainer: {
        flexDirection: "row",
        // justifyContent: "space-evenly",
        gap: 10,
        margin: "auto",
        height: 40
    },
    timeInput: {
        backgroundColor: "white",
        width: 145,
        borderRadius: 10,
        textAlign: "center"
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
        backgroundColor: "#70757F",
        borderRadius: 10,
        width: 100,
        textAlign: "center",
        borderRadius: 20
    },
    cancelButton: {
        color: '#FAFFAF',
        margin: "auto",
        padding: 10,
        backgroundColor: "#DC4C64",
        borderRadius: 10,
        width: 100,
        borderRadius: 20,
        textAlign: "center"

    },
    title: {
        color: "white"
    },
    commentTextInput: {
        borderRadius: 12,
        backgroundColor: "white",
        width: 300,
        height: 100,
        padding: 10

    },
});

export default EventCellPopup