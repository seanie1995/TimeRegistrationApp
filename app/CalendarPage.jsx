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
        todaysDateNormal, yesterdaysDateNormal, currentDayTodos, setCurrentDayTodos, yesterdayTodos, setYesterdayTodos } = useContext(AuthContext);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const route = useRoute();
    const navigation = useNavigation();
    const { dateTitle, chosenDate } = route.params || { dateTitle, chosenDate: "Unknown" }
    const [isEventCellPopupOpen, setEventCellPopupOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null)

    const [showToDo, setShowToDo] = useState(true)

    const toggleToDo = () => setShowToDo(true)
    const toggleReg = () => setShowToDo(false)

    useEffect(() => {
        navigation.setOptions({
            title: dateTitle
        })
    }, [navigation, dateTitle])


    // FETCHES DATA
    useFocusEffect(
        React.useCallback(() => {
            if (chosenDate === todaysDateUS) {
                if (currentDayPosts.length === 0) {
                    console.log("Fetched data from API. Src: CalendarPage.jsx");
                    fetchData();
                    fetchTodoData();       
                } else {
                    console.log("Local Data Used. Src: CalendarPage.jsx");
                }
            } else if (chosenDate === yesterdaysDateUS) {
                if (yesterdayPosts.length === 0) {
                    console.log("Fetched data from API. Src: CalendarPage.jsx");
                    fetchData();
                    fetchTodoData();
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

    const fetchTodoData = async () => {

        const requestBody = {
            "query": [
                {
                    "!common_our_reference": userName,
                    "todo_date": `${chosenDate}`
                }
            ]
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
        } catch (e) {
            console.log(e)
        }
    }



    const onRefresh = async () => {
        setIsRefreshing(true);
        await fetchData();  // Fetch data again
        console.log("Data fetched from API. src: CalendarPage.jsx")
        setIsRefreshing(false);  // Stop the refresh indicator
    };

    const OnOpenEventCell = (event) => {
        setSelectedProject(event)
        setEventCellPopupOpen(true)
        // alert(event.fieldData.recordId)
    }

    return (
        <View style={styles.container}>

            <Modal visible={isEventCellPopupOpen} transparent={true} animationType='slide' onRequestClose={() => setEventCellPopupOpen(false)}>
                <EventCell
                    onClose={() => setEventCellPopupOpen(false)}
                    visible={isEventCellPopupOpen}
                    project={selectedProject}

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
                        <Text>Inga Tider</Text>  // Fallback message
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
                                isTodo={false}
                                // openEventCell={() => setEventCellPopupOpen(true)}
                                openEventCell={OnOpenEventCell}
                            />
                        ) : chosenDate !== todaysDateUS ? (
                            <Calendar
                                chosenEvents={yesterdayPosts}
                                isToday={false}
                                isTodo={false}
                                // openEventCell={() => setEventCellPopupOpen(true)}
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
                                chosenEvents={currentDayTodos}
                                isToday={true}
                                openEventCell={OnOpenEventCell}
                            />
                        ) : chosenDate !== todaysDateUS ? (
                            <ToDoCalendar
                                chosenEvents={yesterdayTodos} 
                                isToday={false}
                                openEventCell={OnOpenEventCell}
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
    },

})

export default CalendarPage