import { React, useState, useEffect } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Calendar } from 'react-native-big-calendar'
import AsyncStorage from '@react-native-async-storage/async-storage'

const CalendarBig = ({ chosenEvents, isToday }) => {

    const [events, setEvents] = useState([]);

    const [chosenDay, setChosenDay] = useState();

    const FindProjectName = async (projectCode) => {
        const projectList = await AsyncStorage.getItem("projectValueLists");
        const parsedList = projectList ? JSON.parse(projectList) : null;

        if (!parsedList || !Array.isArray(parsedList.valueLists)) return null;

        const foundItem = parsedList.valueLists.find(item => item.value === projectCode)
        const projectName = foundItem.displayValue
   
        return projectName;
    }

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
                const startDate = timeConverter(item.fieldData.time_time_start, isToday);
                const endDate = timeConverter(item.fieldData.time_time_end, isToday);
                const projectName = await FindProjectName(item?.fieldData?.["!Project"]);

                const isCommentNull = item?.fieldData.common_comment_customer === ""
                
                
                
                return {
                    title: `${projectName} `,
                    start: startDate,
                    end: endDate,
                    isCommentNull: isCommentNull
                };
            }));

            setEvents(formattedEvents);
        }

        formatEvents();
    }, [chosenEvents]);

    const showEventDetails = (event) => {
        alert(event.title)
    }

    return (

        <GestureHandlerRootView style={styles.mainContainer}>
            <View style={styles.title}><Text>Registrerade Tider</Text></View>
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
                onPressEvent={showEventDetails}
                // eventCellStyle={styles.eventCell}
                eventCellStyle={(event) => {
                    return {
                      backgroundColor: event.isCommentNull ? "#C0C0C0" : "#3B71CA", // grey if no comment
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
        margin: "auto",
        

    },
    title: {
        margin: "auto",

        padding: 10
    },
    // eventCell: {
    //     backgroundColor: "#3B71CA",
    //     borderLeftWidth: 5,
    //     borderColor: "#0b52c2",
    //     borderTopWidth: 1,
    //     borderBottomWidth: 1,
    //     borderRadius: 6,
    //     paddingHorizontal: 6,
    //     paddingVertical: 4

    // }
})

export default CalendarBig