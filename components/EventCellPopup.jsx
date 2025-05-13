import React, { useContext, useState } from 'react';
import axios from 'axios';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Platform, ScrollView, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { AuthContext } from "../app/Context.jsx"

const EventCellPopup = ({ event, onClose, isBookedEvent }) => {

    const { userName, token, setCurrentDayPosts, setYesterdayPosts, todaysDateUS, yesterdaysDateUS, timeSort, currentDayPosts } = useContext(AuthContext)

    let chosenEvent;

    if (!isBookedEvent) {
        chosenEvent = {
            time_time_start: event.fieldData.time_time_start,
            time_time_end: event.fieldData.time_time_end,
            common_article_no: event.fieldData.common_article_no,
            common_comment_customer: event.fieldData.common_comment_customer,
            common_comment_internal: event.fieldData.common_comment_internal,
            time_employee_id: event.fieldData.time_employee_id,
            recordId: event.fieldData.recordId,
            time_chargable: event.fieldData.time_chargable,
            time_not_worked: event.fieldData.time_not_worked
        }
    } else if (isBookedEvent) {
        chosenEvent = {
            event_ID: event.event_ID,
            time_time_start: event.event_time_start,
            time_time_end: event.event_time_end,
            common_comment_customer: event.todo_head,
            "!todo": event["!todo"],
            time_date: event.event_date_start,
            user_recordId: event.user_recordId
        }
    }



    const [chosenStartTime, setChosenStartTime] = useState(chosenEvent.time_time_start);
    const [chosenEndTime, setChosenEndTime] = useState(chosenEvent.time_time_end);
    const [customerComment, setCustomerComment] = useState(chosenEvent.common_comment_customer);
    const [eventDate, setEventDate] = useState(chosenEvent.time_date);

    const [todoFinished, setTodoFinished] = useState(false);

    const postBookedEvent = async () => {

        const eventToPost = {
            fieldData: {
                "!common_article_name": "",
                "!Project": "",
                common_arendenr: "",
                common_article_no: "",
                common_comment_customer: customerComment,
                time_employee_id: userName,
                time_date: eventDate,
                time_source: "app",
                time_time_end: chosenEndTime,
                time_time_start: chosenStartTime,
                "!todo": chosenEvent["!todo"],
            }
        }

        const filteredData = Object.fromEntries(
            Object.entries(eventToPost.fieldData)
                .filter(([_, value]) => value !== "")
        );

        const payload = {
            "fieldData": {
                ...filteredData
            }
        }

        const API_URL_ANDROID = "http://10.0.2.2:80/registerTime";
        const API_URL_IOS = "http://10.0.200.102/registerTime";

        let URL

        if (Platform.OS === 'ios') {
            URL = API_URL_IOS
        } else if (Platform.OS === 'android') {
            URL = API_URL_ANDROID
        }
        
        try {
            
            await axios.post(URL, payload, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } });
            // console.log(eventToPost)

            const tempId = Math.floor(Math.random() * 1000)

            const updatedEventData = {
                ...eventToPost,
                "fieldData": {
                    ...eventToPost.fieldData,
                    recordId: tempId
                }
            }

            if (eventDate === todaysDateUS) {
                setCurrentDayPosts(prevPosts => timeSort([...prevPosts, updatedEventData]));
           
            } else if (eventDate === yesterdaysDateUS) {
                setYesterdayPosts(prevPosts => timeSort([...prevPosts, updatedEventData]))
            }

            onClose();


        } catch (e) {
            console.log(e + ". Failure found in EventCellPopup")
        }


    }

    const postBookedEventFinished = () => {

        const eventToPost = {
            fieldData: {
                "!common_article_name": "",
                "!Project": "",
                common_arendenr: "",
                common_article_no: "",
                common_comment_customer: customerComment,
                time_employee_id: userName,
                time_date: "",
                time_source: "app",
                time_time_end: chosenEndTime,
                time_time_start: chosenStartTime,
                "!todo": "",
                // "time_eventuser::eventuser_done": 1
            }
        }


    }
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
                    // value={event.fieldData.time_not_worked}
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
                <TouchableOpacity onPress={postBookedEvent}>
                    <Text style={styles.confirmButton}>OK</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onClose}>
                    <Text style={styles.cancelButton}>Cancel</Text>
                </TouchableOpacity>
            </View>
            {isBookedEvent ? (
                <TouchableOpacity onPress={onClose}><Text style={styles.confirmAndOkButton}>OK + Utförd</Text></TouchableOpacity>
            ) : null}
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
        // justifyContent: "space-between",
        margin: "auto",
        gap: 10,
        paddingTop: 20,
        paddingBottom: 10
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
    confirmAndOkButton: {
        color: '#FAFFAF',
        margin: "auto",
        padding: 10,
        backgroundColor: "#70757F",

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