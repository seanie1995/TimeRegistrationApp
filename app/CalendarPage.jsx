import React, { useContext, useState, useEffect } from 'react'
import { View, Text, SafeAreaView, ScrollView, RefreshControl, FlatList, Platform, TouchableOpacity, Image, Modal } from 'react-native'
import { StyleSheet } from 'react-native'
import { AuthContext } from "./Context";
import axios from 'axios';
import ToDoCard from "../components/ToDoCard.jsx"
import Calendar from "../components/CalendarBig.jsx"
import ToDoCalendar from "../components/CalenderTodo.jsx"
import EventCell from "../components/EventCellPopup.jsx"
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native'

const CalendarPage = () => {

    const { userName, token, currentDayPosts, setCurrentDayPosts, yesterdayPosts, setYesterdayPosts, todaysDateUS, yesterdaysDateUS, timeSort,
        todaysDateNormal, yesterdaysDateNormal, currentDayTodos, setCurrentDayTodos, yesterdayTodos, setYesterdayTodos, currentDayEvents, setCurrentDayEvents, yesterdayEvents, setYesterdayEvents } = useContext(AuthContext);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const route = useRoute();
    const navigation = useNavigation();
    const { dateTitle, chosenDate } = route.params || { dateTitle, chosenDate: "Unknown" }
    const [isEventCellPopupOpen, setEventCellPopupOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null)
    const [isBookedEvent, setIsBookedEvent] = useState();
    const [showToDo, setShowToDo] = useState(true)

    const toggleToDo = () => setShowToDo(true)
    const toggleReg = () => setShowToDo(false)



    useEffect(() => {
        navigation.setOptions({
            title: dateTitle
        })
    }, [navigation, dateTitle])

    // FETCHES REGISTERED POSTS DATA
    useFocusEffect(
        React.useCallback(() => {
            if (chosenDate === todaysDateUS) {
                if (currentDayPosts.length === 0) {
                    console.log("Fetched data from API. Src: CalendarPage.jsx");
                    fetchData();
                } else {
                    console.log("Local Data Used. Src: CalendarPage.jsx");
                }
            } else if (chosenDate === yesterdaysDateUS) {
                if (yesterdayPosts.length === 0) {
                    console.log("Fetched data from API. Src: CalendarPage.jsx");
                    fetchData();
                } else {
                    console.log("Local Data Used. Src: CalendarPage.jsx");
                }
            }
        }, [chosenDate, currentDayPosts, yesterdayPosts, currentDayTodos, yesterdayTodos])
    );

    useEffect(() => {
        navigation.setOptions({
            title: dateTitle,
            headerRight: () => (
                <TouchableOpacity onPress={() => navigation.navigate("Regga Tid")}>
                    <Image
                        source={require("../assets/images/add-circle.png")} // Adjust path if needed
                        style={{ width: 24, height: 24, marginRight: 15 }}
                    />
                </TouchableOpacity>
            )
        });
    }, [navigation, dateTitle]);

    const fetchData = async () => {

        const requestBody = {
            "query": [
                {
                    "time_employee_id": userName,
                    "time_date": `${chosenDate}`
                }
            ]
        };

        const API_URL_ANDROID = "http://10.0.2.2:80/fetchTimeRecords";
        const API_URL_IOS = "http://10.0.200.102/fetchTimeRecords";
        // const API_URL_IOS = "http://localhost/fetchTimeRecords";

        let URL = ""

        if (Platform.OS === 'ios') {
            URL = API_URL_IOS
        } else if (Platform.OS === 'android') {
            URL = API_URL_ANDROID
        }

        try {
            const response = await axios.post(URL, requestBody, { headers: { Authorization: `Bearer ${token}` } });
            const responseBody = response.data.data;

            const formattedResponse = responseBody.map(item => ({
                fieldData: {
                    time_time_start: item.time_time_start,
                    time_time_end: item.time_time_end,
                    common_article_no: item.common_article_no,
                    '!Project': item['!Project'],
                    common_comment_customer: item.common_comment_customer,
                    common_comment_internal: item.common_comment_internal,
                    time_employee_id: item.time_employee_id,
                    recordId: item.recordId,
                    time_chargeable: item.time_chargeable,
                    time_not_worked: item.time_not_worked,
                    '!todo': item['!todo'],
                    common_item_price: item.common_item_price,

                }
            }));

            const sortedResponse = timeSort(formattedResponse)
            if (chosenDate === todaysDateUS) {
                setCurrentDayPosts(sortedResponse);
            } else if (chosenDate === yesterdaysDateUS) {
                setYesterdayPosts(sortedResponse)
            }
        } catch (e) {
            console.log(e)
        }
    }

    const fetchTodoData = async (eventList) => {

        const requestBody = {
            "query": eventList.map(event => ({
                "!ID": event.fieldData['!todo']
            }))
        };

        const API_URL_ANDROID = "http://10.0.2.2:80/fetchTodo";
        const API_URL_IOS = "http://10.0.200.102/fetchTodo";
        // const API_URL_IOS = "http://localhost/fetchTimeRecords";

        let URL = ""

        if (Platform.OS === 'ios') {
            URL = API_URL_IOS
        } else if (Platform.OS === 'android') {
            URL = API_URL_ANDROID
        }

        try {
            const response = await axios.post(URL, requestBody, { headers: { Authorization: `Bearer ${token}` } });
            const responseBody = response.data.data;

            const formattedResponse = responseBody.map(item => ({
                fieldData: {
                    '!ID': item['!ID'],
                    todo_date: item.todo_date,
                    todo_head: item.todo_head,
                    todo_text: item.todo_text,
                    todo_start: item.todo_start,
                    todo_stop: item.todo_stop,
                    todo_done: item.todo_done,
                    recordId: item.recordId,
                    todo_arendenr: item.todo_arendenr,
                    '!common_our_reference': item['!common_our_reference'],
                }
            }));

            if (chosenDate === todaysDateUS) {
                setCurrentDayTodos(formattedResponse);
            } else if (chosenDate === yesterdaysDateUS) {
                setYesterdayTodos(formattedResponse)
            }

            return formattedResponse;
        } catch (e) {
            console.log(e)
        }
    }

    const fetchEventUserData = async () => {

        const requestBody = {
            "query": [
                {
                    "!user": userName,
                }
            ],
            "sort": [
                {
                    "fieldName": "!event",
                    "sortOrder": "descend"
                }
            ],
            "limit": 20
        }

        const API_URL_ANDROID = "http://10.0.2.2:80/fetchEventUsers";
        const API_URL_IOS = "http://10.0.200.102/fetchEventUsers";
        // const API_URL_IOS = "http://localhost/fetchTimeRecords";

        let URL = ""

        if (Platform.OS === 'ios') {
            URL = API_URL_IOS
        } else if (Platform.OS === 'android') {
            URL = API_URL_ANDROID
        }

        try {
            const response = await axios.post(URL, requestBody, { headers: { Authorization: `Bearer ${token}` } });
            const responseBody = response.data.data;

            const formattedResponse = responseBody.map(item => ({
                fieldData: {
                    '!user': item['!user'],
                    "!ID": item['!ID'],
                    '!event': item['!event'],
                    eventuser_done: item.eventuser_done,
                    event_date_start: item.event_date_start,
                    recordId: item.recordId
                }
            }));

            return formattedResponse
        } catch (e) {
            console.log(e + " Failure from fetchEventUsers")
        }
    }

    const fetchEventData = async (eventUsers) => {

        const requestBody = {
            "query": eventUsers.map(user => ({
                "!ID": user.fieldData['!event']
            }))
        }

        const API_URL_ANDROID = "http://10.0.2.2:80/fetchEvents";
        const API_URL_IOS = "http://10.0.200.102/fetchEvents";
        // const API_URL_IOS = "http://localhost/fetchTimeRecords";

        let URL = ""

        if (Platform.OS === 'ios') {
            URL = API_URL_IOS
        } else if (Platform.OS === 'android') {
            URL = API_URL_ANDROID
        }

        try {
            const response = await axios.post(URL, requestBody, { headers: { Authorization: `Bearer ${token}` } });
            const responseBody = response.data.data;

            const formattedResponse = responseBody.map(item => ({
                fieldData: {
                    '!ID': item['!ID'],
                    "!todo": item['!todo'],
                    event_date_end: item.event_date_end,
                    event_date_start: item.event_date_start,
                    event_time_end: item.event_time_end.substring(0, 5),
                    event_time_start: item.event_time_start.substring(0, 5),
                    recordId: item.recordId
                }
            }));

            const chosenDateEvents = formattedResponse.filter(events =>
                events.fieldData.event_date_start === chosenDate
            )

            return chosenDateEvents;
        } catch (e) {
            console.log("Failure from fetchEventData " + e)
        }
    }

    const processEventData = async () => {
        try {
            const eventUsers = await fetchEventUserData();
            if (!eventUsers || eventUsers.length === 0) return

            const eventData = await fetchEventData(eventUsers)
            const todos = await fetchTodoData(eventData)

            if (eventData.length === 0) {
                console.log("No events for today")
            }

            const finalEventList = eventData.map(event => {
                const matchingTodo = todos.find(todo => todo.fieldData['!ID'] === event.fieldData['!todo']);
                const matchingUser = eventUsers.find(user => user.fieldData['!event'] === event.fieldData['!ID']);

    

                return {
                    event_time_start: event.fieldData.event_time_start,
                    event_time_end: event.fieldData.event_time_end,
                    "!todo": event.fieldData["!todo"],
                    event_ID: event.fieldData["!ID"],
                    todo_head: matchingTodo?.fieldData.todo_head || null,
                    event_date_start: event.fieldData.event_date_start,
                    event_date_end: event.fieldData.event_date_end,
                    user_recordId: matchingUser?.fieldData.recordId || "Not found" 
                };
            });

  
            return finalEventList;

        } catch (error) {
            console.log("Failed to fetch todays events" + " " + error)
        }
    }

    useEffect(() => {
        const fetchAndSetEvents = async () => {
            const events = await processEventData();

            if (!events) return;

            if (chosenDate === todaysDateUS) {
                setCurrentDayEvents(events);
            } else if (chosenDate === yesterdaysDateUS) {
                try {
                    setYesterdayEvents(events);
                } catch (e) {
                    console.log(e)
                }

            }
        };
        fetchAndSetEvents();

    }, [chosenDate]);

    const onRefresh = async () => {
        setIsRefreshing(true);
        await fetchData();  // Fetch data again
        console.log("Data fetched from API. src: CalendarPage.jsx")
        setIsRefreshing(false);  // Stop the refresh indicator
    };

    const OnOpenEventCell = (event) => {
        setSelectedProject(event)
        setEventCellPopupOpen(true)
        setIsBookedEvent(false)
    }

    const OnOpenBookedEventCell = (event) => {
        setSelectedProject(event)
        setEventCellPopupOpen(true)
        setIsBookedEvent(true)
    }

    return (
        <View style={styles.container}>

            <Modal visible={isEventCellPopupOpen} transparent={true} animationType='slide' onRequestClose={() => setEventCellPopupOpen(false)}>
                <EventCell
                    onClose={() => setEventCellPopupOpen(false)}
                    visible={isEventCellPopupOpen}
                    event={selectedProject}
                    isBookedEvent={isBookedEvent}
                />
            </Modal>
            <View style={styles.cardListContainer}>

                {chosenDate === todaysDateUS ? (<ScrollView
                    refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
                    style={styles.testBorder}>

                    {currentDayPosts.length > 0 ? (
                        currentDayPosts.map((projects, index) => (
                            <ToDoCard key={index} project={projects} />
                        ))
                    ) : (
                        <Text style={styles.container}>Inga Tider</Text>  // Fallback message
                    )}

                </ScrollView>) : (<ScrollView
                    refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
                    style={styles.testBorder}>

                    {yesterdayPosts.length > 0 ? (
                        yesterdayPosts.map((projects, index) => (
                            <ToDoCard key={index} project={projects} />
                        ))
                    ) : (
                        <Text style={{ textAlign: "center" }}>Inga Tider</Text>  // Fallback message
                    )}
                </ScrollView>)}
            </View>
            <View style={styles.calendarContainer}>
                <View style={styles.timelineTabContainer}>
                    <TouchableOpacity
                        style={{ borderBottomColor: "black", borderBottomWidth: 2, padding: 5, width: 160, opacity: showToDo ? 1 : 0.4 }}
                        onPress={toggleToDo}>
                        <Text style={{ textAlign: "center" }}>Bokad Tid</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ borderBottomColor: "black", borderBottomWidth: 2, padding: 5, width: 160, opacity: !showToDo ? 1 : 0.4 }} onPress={toggleReg}>
                        <Text style={{ textAlign: "center" }}>Registrerade Tider</Text>
                    </TouchableOpacity>
                </View>
                {!showToDo ? (
                    <View>
                        {chosenDate === todaysDateUS ? (
                            <Calendar
                                chosenEvents={currentDayPosts}
                                isToday={true}
                                openEventCell={OnOpenEventCell}
                            />
                        ) : chosenDate !== todaysDateUS ? (
                            <Calendar
                                chosenEvents={yesterdayPosts}
                                isToday={false}
                                openEventCell={OnOpenEventCell}
                            />
                        ) : (
                            <Text>No Events Available</Text>
                        )}
                    </View>
                ) :
                    <View>
                        {chosenDate === todaysDateUS ? (
                            <ToDoCalendar
                                chosenEvents={currentDayEvents}
                                isToday={true}
                                openEventCell={OnOpenBookedEventCell}
                            />
                        ) : chosenDate !== todaysDateUS ? (
                            <ToDoCalendar
                                chosenEvents={yesterdayEvents}
                                isToday={false}
                                openEventCell={OnOpenBookedEventCell}
                            />
                        ) : (
                            <Text>No Events Available</Text>
                        )}
                    </View>
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop: 10
    },
    cardListContainer: {
        height: 300,
    },
    calendarContainer: {
        flex: 1,
    },
    bokadTid: {
        paddingTop: 10,
        fontWeight: 700
    },
    timelineTabContainer: {
        flexDirection: "row",
        margin: "auto",
        marginBottom: 10
    },

})

export default CalendarPage