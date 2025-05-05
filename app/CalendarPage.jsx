import React, { useContext, useState, useEffect } from 'react'
import { View, Text, SafeAreaView, ScrollView, RefreshControl, FlatList, Platform , TouchableOpacity, Image} from 'react-native'
import { StyleSheet } from 'react-native'
import { AuthContext } from "./Context";
import axios from 'axios';
import ToDoCard from "../components/ToDoCard.jsx"
import Calendar from "../components/CalendarBig.jsx"
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar';
import CalendarBig from '../components/CalendarBig.jsx';
const CalendarPage = () => {

    const { userName, token, currentDayPosts, setCurrentDayPosts, yesterdayPosts, setYesterdayPosts, todaysDateUS, yesterdaysDateUS, timeSort, todaysDateNormal, yesterdaysDateNormal } = useContext(AuthContext);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const route = useRoute();
    const navigation = useNavigation();
    const { dateTitle, chosenDate } = route.params || { dateTitle, chosenDate: "Unknown" }

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
        }, [chosenDate, currentDayPosts, yesterdayPosts]) // You can also add dependencies if needed
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

        // const requestBody = {
        //     "query": [
        //         {
        //             "time_employee_id": "SOS",
        //             "time_date": `${chosenDate}`
        //         }
        //     ]
        // };

         const requestBody = {
            "query": [
                {
                    "time_employee_id": userName,
                    "time_date": `${chosenDate}`
                }
            ]
        };

        const API_URL_ANDROID = "http://10.0.2.2:80/fetchTimeRecords";
        // const API_URL_IOS = "http://10.0.200.102/fetchTimeRecords";
        const API_URL_IOS = "http://localhost/fetchTimeRecords";

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

    const onRefresh = async () => {
        setIsRefreshing(true);
        await fetchData();  // Fetch data again
        console.log("Data fetched from API. src: CalendarPage.jsx")
        setIsRefreshing(false);  // Stop the refresh indicator
    };


    return (
        <View style={styles.container}>
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
                {chosenDate === todaysDateUS ? (
                    <Calendar
                        chosenEvents={currentDayPosts}
                        isToday={true}
                    />
                ) : chosenDate !== todaysDateUS ? (
                    <Calendar
                        chosenEvents={yesterdayPosts}
                        isToday={false}
                    />
                ) : (
                    <Text>No Events Available</Text> // Fallback if chosenDate is not today or yesterday
                )}
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


})

export default CalendarPage