import { React, useState, useEffect, useContext } from 'react'
import { StyleSheet, View, Text } from 'react-native'

import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Calendar } from 'react-native-big-calendar'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AuthContext } from "../app/Context.jsx";

const CalenderTodo = ({chosenEvents, isToday, openEventCell}) => {

    const [events, setEvents] = useState([]);

    const [chosenDay, setChosenDay] = useState();

    useEffect(() => {
        if (isToday) {
            const today = new Date();
            setChosenDay(today);
        } else if (!isToday) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1)
            setChosenDay(yesterday)
        }
    }, [isToday])

    const timeConverter = (timeString, isToday) => {
        let date;
        const [hours, minutes] = timeString.split(':');
        if (isToday) {
            const today = new Date();
            date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes);
        } else {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);  // Get yesterday's date
            date = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), hours, minutes);
        }
        return date;
    };

    useEffect(() => {

        const formatEvents = async () => {
            const formattedEvents = await Promise.all(chosenEvents.map(async item => {
                const startDate = timeConverter(item.event_time_start, isToday);
                const endDate = timeConverter(item.event_time_end, isToday);
                const projectName = item.todo_head
                return {
                    title: `${projectName} `,
                    start: startDate,
                    end: endDate,
                    chosenEvent: item
                };
            }));

            setEvents(formattedEvents);
        }
        formatEvents();

    }, [chosenEvents, isToday]);
    return (
        <GestureHandlerRootView style={styles.mainContainer}>
            <Calendar events={events}
                mode="day"
                hideNowIndicator="true"
                overlapOffset={100}
                date={chosenDay}
                maxHour={17}
                minHour={8}
                height={700}
                headerContainerStyle={{ display: "none" }}
                verticalScrollEnabled={true}
                swipeEnabled={false}
                eventCellTextColor='black'
                onPressEvent={(event) => openEventCell(event.chosenEvent)}
                eventCellStyle={(event) => {
                    return {
                        backgroundColor: event.isCommentNull ? "#C0C0C0" : "#90c2f9",
                        borderLeftWidth: 5,
                        borderColor: event.isCommentNull ? "#909090" : "#0b52c2",
                        borderTopWidth: 1,
                        borderBottomWidth: 1,
                        borderRadius: 6,
                        paddingHorizontal: 6,
                        paddingVertical: 4
                    };
                }}
            />
        </GestureHandlerRootView>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        width: 400,
        height: 800,
        margin: "auto"
    },
    title: {
        margin: "auto",

        padding: 10
    }
})

export default CalenderTodo