import { createContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from "axios";
import { StyleSheet, Platform } from "react-native";


export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(null);
    const [userName, setUserName] = useState("");
    const [todaysDateUS, setTodaysDateUS] = useState("");
    const [yesterdaysDateUS, setYesterdaysDateUS] = useState("");
    const [todaysDateNormal, setTodaysDateNormal] = useState("");
    const [yesterdaysDateNormal, setYesterdaysDateNormal] = useState("");
    const [chosenDate, setChosenDate] = useState("");

    const [currentDayPosts, setCurrentDayPosts] = useState([]);
    const [yesterdayPosts, setYesterdayPosts] = useState([]);
    const [chosenDayPosts, setChosenDayPosts] = useState([]);

    const [selectedStartTime, setSelectedStartTime] = useState();
    const [selectedEndTime, setSelectedEndTime] = useState()
    const [isStartTime, setIsStartTime] = useState(false);
    const [timePickerVisible, setTimePickerVisible] = useState(false)

    const [updateTimeTrigger, setUpdateTimeTrigger] = useState()

    const [projectValueList, setProjectValueList] = useState();
    const [articleValueList, setArticleValueList] = useState();

    // FETCH AND CACHE VALUE LIST 

    const fetchValueList = async () => {
        try {

            // const API_URL_IOS = "http://localhost/fetchProjectValueList";

            const API_URL_LOCAL = "http://10.0.200.102/fetchValueList";
            const API_URL_ANDROID = "http://10.0.2.2:80/fetchProjectValueList";
            const API_URL_IOS = "http://10.0.200.102/fetchProjectValueList";
            const API_URL = "http://localhost/fetchValueList";

            let URL = ""

            if (Platform.OS === 'ios') {
                URL = API_URL_IOS
            } else if (Platform.OS === 'android') {
                URL = API_URL_ANDROID
            }

            const headers = {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }

            const response = await axios.get(URL, { headers })

            AsyncStorage.setItem("projectValueLists", JSON.stringify(response.data))

            return response.data.valueLists;


        } catch (e) {
            console.log("Error fetching value lists")
            console.log(e)
        }
    }

    const fetchArticleValueList = async () => {
        try {

            // const API_URL_IOS = "http://localhost/fetchArticleValueList";

            const API_URL_LOCAL = "http://10.0.200.102/fetchArticleValueList";
            const API_URL_ANDROID = "http://10.0.2.2:80/fetchArticleValueList";
            const API_URL_IOS = "http://10.0.200.102/fetchArticleValueList";
            const API_URL = "http://localhost/fetchArticleValueList";

            let URL = ""

            if (Platform.OS === 'ios') {
                URL = API_URL_IOS
            } else if (Platform.OS === 'android') {
                URL = API_URL_ANDROID
            }

            const headers = {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }

            const response = await axios.get(URL, { headers })

            AsyncStorage.setItem("articleValueLists", JSON.stringify(response.data))

            return response.data.valueLists;


        } catch (e) {
            console.log("Error fetching value lists")
            console.log(e)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            if (token) {
                // Fetch from API if token is available
                const result = await fetchValueList();
                const result2 = await fetchArticleValueList();
                setArticleValueList(result2)
                setProjectValueList(result); // Set the state with the fetched valueLists
            } else {
                // Fetch from AsyncStorage if no token is available
                const valueLists = await AsyncStorage.getItem("valueLists");
                const articleValueList = await AsyncStorage.getItem("articleValueLists");
                if (valueLists) {
                    setProjectValueList(JSON.parse(valueLists).valueLists);
                }
                if (articleValueList) {
                    setArticleValueList(JSON.parse(articleValueList).articleValueList)
                }
            }
        };
        fetchData(); // Call fetchData when the token changes
    }, [token]); // Re-run when `token` changes

    // ------------------------------------------

    // DATE FORMATTERS. FILEMAKER WANTS DATES IN US FORMAT (MM/DD/YY) BUT WE NEED TO SHOW DATA IN DD/MM/YY
    const formatterUS = (date) => {
        const formatter = new Intl.DateTimeFormat('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
        });

        const formattedDate = formatter.format(date);
        return formattedDate
    };

    const formatterNormal = (date) => {
        const formatter = new Intl.DateTimeFormat('sv-SE', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        })

        const formattedDate = formatter.format(date);

        return formattedDate;
    }

    // SORT ARRAY BY TIME

    const timeSort = (array) => {

        return [...array].sort((a, b) => {
            const timeA = new Date(`1970-01-01T${a.fieldData.time_time_start}Z`);
            const timeB = new Date(`1970-01-01T${b.fieldData.time_time_start}Z`);
            return timeA - timeB;
        });
    }

    // FETCH TODAYS DATE

    useEffect(() => {
        const today = new Date();

        const todayFormatted = formatterUS(today);
        const todayFormattedNormal = formatterNormal(today);

        setTodaysDateNormal(todayFormattedNormal)
        setTodaysDateUS(todayFormatted);
    }, [])

    // FETCH YESTERDAY'S DATE

    useEffect(() => {
        const yesterday = new Date();

        yesterday.setDate(yesterday.getDate() - 1);

        const yesterdayFormatted = formatterUS(yesterday);
        const yesterdayFormattedNormal = formatterNormal(yesterday);

        setYesterdaysDateNormal(yesterdayFormattedNormal)
        setYesterdaysDateUS(yesterdayFormatted);

    }, [])

    // TOKEN INFORMER THINGY //

    useEffect(() => {

        // if (token) {
        //     console.log("Token Status: Exists");
        // } else if (!token) {
        //     console.log("Token Status: Deleted");
        // }

    }, [token])

    // USERNAME INFORMER

    useEffect(() => {
        if (userName) {
            console.log(userName + " " + "is active")
        } else if (!userName) {
            console.log("Username not registered")
        }
    }, [userName])

    // LOGIN

    const login = async (username, password) => {

        try {
            setUserName(username);
            // URL TO MAKE APP WORK AT HOME
            // const API_URL_ANDROID = "http://10.0.2.2:80/login";
            // const API_URL_IOS = "http://localhost/login";

            const API_URL_LOCAL = "http://10.0.200.102/login";
            const API_URL_ANDROID = "http://10.0.2.2:80/login";
            const API_URL_IOS = "http://10.0.200.102/login";
            const API_URL = "http://localhost/login";
            let URL = ""

            if (Platform.OS === 'ios') {
                URL = API_URL_IOS
            } else if (Platform.OS === 'android') {
                URL = API_URL_ANDROID
            }

            // const encodedName = btoa(`${username}:${password}`);

            const encodedName = "="

            const headers = {
                "Authorization": `Basic ${encodedName}`,
                "Content-Type": "application/json"
            }

            const response = await axios.post(URL, {}, { headers });
            const token = response.data.token;

            await AsyncStorage.setItem("auth", JSON.stringify(token));

            setToken(token);
        } catch (e) {
            alert("Inloggning misslyckades");
            if (e instanceof Error) {
                console.log("Error message: " + e.message);
                // console.log("Stack trace: " + e.stack);
            } else {
                // If the error is not an instance of Error, just log it
                console.log("Unknown error: ", e);
            }
        }
    }

    // LOGOUT //

    const logout = async () => {
        // URL TO MAKE APP WORK AT HOME
        // const API_URL_ANDROID = "http://10.0.2.2:80/login";
        // const API_URL_IOS = "http://localhost/logout";

        const API_URL_LOCAL = "http://10.0.200.102/logout";
        const API_URL_ANDROID = "http://10.0.2.2:80/logout";
        const API_URL_IOS = "http://10.0.200.102/logout";
        const API_URL = "http://localhost/logout";
        let URL = ""

        if (Platform.OS === 'ios') {
            URL = API_URL_IOS
        } else if (Platform.OS === 'android') {
            URL = API_URL_ANDROID
        }

        try {
            await axios.delete(URL, { headers: { Authorization: `Bearer ${token}` } });

            await AsyncStorage.removeItem("auth");

            setToken(null);
            setChosenDayPosts("");
            setCurrentDayPosts("")
            setYesterdayPosts("")
            setUserName("")

            alert("Du har blivit utloggad");
        } catch (e) {
            console.log("Problem logging out" + " " + e)
        }
    }

    return (
        <AuthContext.Provider
            value={{
                logout, login, token, userName, todaysDateUS, yesterdaysDateUS, todaysDateNormal,
                yesterdaysDateNormal, setChosenDate, chosenDate, currentDayPosts, 
                setCurrentDayPosts, yesterdayPosts, setYesterdayPosts, timeSort, selectedStartTime, setSelectedStartTime, selectedEndTime, setSelectedEndTime,
                timePickerVisible, setTimePickerVisible, isStartTime, setIsStartTime, projectValueList, articleValueList, setUpdateTimeTrigger, formatterNormal
            }}>
            {children}
        </AuthContext.Provider>
    );
};

const styles = StyleSheet.create({
    sparaButton: {
        width: 80,
        flexDirection: "row",
        gap: 6
    }
})