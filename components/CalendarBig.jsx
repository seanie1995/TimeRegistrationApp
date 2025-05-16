import { React, useState, useEffect, useContext } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Calendar } from 'react-native-big-calendar'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AuthContext } from "../app/Context.jsx";

const CalendarBig = ({ chosenEvents, isToday, openEventCell }) => {

    const [events, setEvents] = useState([]);
    const [chosenDay, setChosenDay] = useState();
   

    const FindProjectName = async (projectCode) => {
        const projectList = await AsyncStorage.getItem("projectValueLists");
        const parsedList = projectList ? JSON.parse(projectList) : null;
    
        if (!parsedList || !Array.isArray(parsedList.valueLists)) return null;
    
        const foundItem = parsedList.valueLists.find(item => item.value === projectCode);
        return foundItem?.displayValue ?? 'Saknar Titel'; // Safe fallback
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
                const chosenRecordId = item?.fieldData.recordId
                const isCommentNull = item?.fieldData.common_comment_customer === ""
                const chosenItem = item
                const isChargeable = item?.fieldData.time_chargeable === 1
                const noArticleNumber = !item?.fieldData.common_article_no
                

                return {
                    title: `${projectName} `,
                    start: startDate,
                    end: endDate,
                    isCommentNull: isCommentNull,
                    chosenEvent: chosenItem,
                    isChargeable: isChargeable,
                    noArticleNumber: noArticleNumber
                };
            }));

            setEvents(formattedEvents);
        }
        formatEvents();

    }, [chosenEvents, isToday]);

    const showEventDetails = (event) => {
        alert(event.recordId)
    }

    return (

        <GestureHandlerRootView style={styles.mainContainer}>
            <Calendar events={events}
                hourStyle={{fontSize: 12, fontWeight: "bold"}}
                hourRowHeight={100}
                mode="day"
                hideNowIndicator="true"
                overlapOffset={100}
                date={chosenDay}
                maxHour={17}
                minHour={8}
                height={900}
                headerContainerStyle={{ display: "none" }}
                verticalScrollEnabled={true}
                swipeEnabled={false}
                eventCellTextColor="black"
                // onPressEvent={(event) => openEventCell(event.chosenEvent)}
                eventCellStyle={(event) => {
                    return {
                        backgroundColor: event.isChargeable ?  "#D4E9D4" : event.isCommentNull ? "#C0C0C0" : event.noArticleNumber ? "#F16C78" : "#90c2f9",
                        borderLeftWidth: 5,
                        borderColor: event.isChargeable ? "#D4E9D4" : event.isCommentNull ? "#909090" : event.noArticleNumber ? "#dc3545" : "#0b52c2",
                        borderTopWidth: 1,
                        borderBottomWidth: 1,
                        borderRadius: 6,
                        paddingHorizontal: 6,
                        paddingVertical: 4,

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

export default CalendarBig