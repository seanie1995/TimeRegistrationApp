import React, { useContext, useState, useEffect, useLayoutEffect } from 'react'
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, Image, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native'

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { AuthContext } from './Context.jsx';
import { useNavigation, useRoute } from '@react-navigation/native'
import Checkmark from "../assets/images/SparaCheck.png"

import TimePicker from "../components/TimePicker.jsx"
import ProjectPicker from "../components/ValueListPicker.jsx"
import ArticlePicker from "../components/ArticleListPicker.jsx"
import EventCell from "../components/EventCellPopup.jsx"

import { goBack } from 'expo-router/build/global-state/routing.js';
import axios from 'axios';
import { ScrollView } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage'

const RegTime = () => {
    const route = useRoute();
    const recordId = route?.params?.recordId || null;
    const { chosenDate, token, yesterdaysDateUS, todaysDateUS, setYesterdayPosts, setCurrentDayPosts, currentDayPosts,
        yesterdayPosts, timeSort, projectValueLists, articleValueLists } = useContext(AuthContext);

    const navigation = useNavigation();
    const [isDebiterat, setIsDebiterat] = useState(false);
    const [ejArbete, setEjArbete] = useState(false);
    const [saving, setSaving] = useState(false);
    const [projectName, setProjectName] = useState();
    const [articleName, setArticleName] = useState();
    const [projectNameDisplay, setProjectNameDisplay] = useState();
    const [articleNameDisplay, setArticleNameDisplay] = useState();
    const [selectedProject, setSelectedProject] = useState();
    const [selectedArticle, setSelectedArticle] = useState();
    const [isProjectPickerOpen, setIsProjectPickerOpen] = useState(false);
    const [isArticlePickerOpen, setArticlePickerOpen] = useState(false);
    const [isStartTime, setIsStartTime] = useState();

    const ToggleProjectPicker = () => {
        setIsProjectPickerOpen(true);
    }
    const ToggleArticlePicker = () => {
        setArticlePickerOpen(true);
    }

    const [isTimePickerOpen, setTimePickerIsOpen] = useState(false);

    // MODAL ON/OFF TOGGLES

    const ToggleStartTimePicker = () => {
        setIsStartTime(true)
        setTimePickerIsOpen(true);
    }
    const ToggleEndTimePicker = () => {
        setIsStartTime(false)
        setTimePickerIsOpen(true);
    }
    const HandleTimeSelect = (chosenTime) => {

        if (recordId) {
            if (isStartTime) {
                setPostToModify(prevData => ({
                    ...prevData,
                    fieldData: {
                        ...prevData.fieldData,
                        time_time_start: chosenTime
                    }
                }))
            } else if (!isStartTime) {
                setPostToModify(prevData => ({
                    ...prevData,
                    fieldData: {
                        ...prevData.fieldData,
                        time_time_end: chosenTime
                    }
                }))
            }
        } else if (!recordId) {
            if (isStartTime) {
                setFormData(prevData => ({
                    ...prevData,
                    fieldData: {
                        ...prevData.fieldData,
                        time_time_start: chosenTime
                    }
                }))
            } else if (!isStartTime) {
                setFormData(prevData => ({
                    ...prevData,
                    fieldData: {
                        ...prevData.fieldData,
                        time_time_end: chosenTime
                    }
                }))
            }
        }
        setTimePickerIsOpen(false);
    }
    const handleProjectSelect = (project) => {
        setSelectedProject(project);
        setIsProjectPickerOpen(false);
        setProjectName(project.displayValue)

        if (recordId) {
            setPostToModify(prevData => ({
                ...prevData,
                fieldData: {
                    ...prevData.fieldData,
                    "!Project": project.value,
                    "projectName": project.displayValue
                }
            }))
        } else {
            setFormData(prevData => ({
                ...prevData,
                fieldData: {
                    ...prevData.fieldData,
                    "!Project": project.value,
                    "projectName": project.displayValue
                }
            }));
        }
    }
    const handleArticleSelect = (article) => {
        setSelectedArticle(article);
        setArticlePickerOpen(false);
        setArticleName(article.displayValue)

        if (recordId) {
            setPostToModify(prevData => ({
                ...prevData,
                fieldData: {
                    ...prevData.fieldData,
                    common_article_no: article.value,

                }
            }))
        } else {
            setFormData(prevData => ({
                ...prevData,
                fieldData: {
                    ...prevData.fieldData,
                    common_article_no: article.value,

                }
            }));
        }
    }

    // STATES FOR FORMS FOR EXISTING AND NEW RECORDS
    const [postToModify, setPostToModify] = useState({
        "fieldData": {
            "!common_article_name": "",
            "!Project": "",
            common_arendenr: "",
            common_article_no: "",
            common_comment_customer: "",
            common_comment_internal: "",
            time_employee_id: "SOS",
            time_date: "",
            time_source: "App",
            time_time_end: "",
            time_time_start: "",
            projectName: ""

        }
    });
    const [formData, setFormData] = useState({
        "fieldData": {
            "!common_article_name": "",
            "!Project": "",
            common_arendenr: "",
            common_article_no: "",
            common_comment_customer: "",
            common_comment_internal: "",
            time_employee_id: "SOS",
            time_date: chosenDate,
            time_source: "App",
            time_time_end: "",
            time_time_start: ""
        }
    });

    // HANDLE DEBITERA & EJ ARBETE STATES
    const handleDebitera = () => {
        setIsDebiterat(prev => {
            const newValue = !prev;
            setPostToModify(prevPost => ({
                ...prevPost,
                fieldData: {
                    ...prevPost.fieldData,
                    time_chargeable: newValue
                }
            }));

            return newValue;
        });
    };
    const handleEjArbete = () => {
        setEjArbete(prev => {
            const newValue = !prev;
            setPostToModify(prevPost => ({
                ...prevPost,
                fieldData: {
                    ...prevPost.fieldData,
                    time_not_worked: newValue
                }
            }));
            return newValue;
        });
    };

    const FindProjectName = async (projectCode) => {
        const projectList = await AsyncStorage.getItem("projectValueLists");
        const parsedList = projectList ? JSON.parse(projectList) : null;

        if (!parsedList || !Array.isArray(parsedList.valueLists)) return null;

        const foundItem = parsedList.valueLists.find(item => item.value === projectCode)
        const projectName = foundItem.displayValue

        setProjectNameDisplay(projectName)
    }

    const FindArticleName = async (articleCode) => {
        const articleList = await AsyncStorage.getItem("articleValueLists");
        const parsedList = articleList ? JSON.parse(articleList) : null;

        if (!parsedList || !Array.isArray(parsedList.valueLists)) return null;

        const foundItem = parsedList.valueLists.find(item => item.value === articleCode)
        const articleName = foundItem.displayValue;
        setArticleNameDisplay(articleName)
    }

    useEffect(() => {
        FindProjectName(postToModify?.fieldData?.["!Project"])
    }, [postToModify])

    useEffect(() => {
        FindArticleName(postToModify?.fieldData?.common_article_no)
    }, [postToModify])

    // CHECKS IF FORM IS ENTIRELY NEW OR MODIFYING AN EXISTING RECORD
    useEffect(() => {

        if (!recordId) return;

        let searchPost = null;
        let foundProjectName = null;

        if (recordId !== null && chosenDate === todaysDateUS) {
            searchPost = currentDayPosts.find(post => post.fieldData.recordId === recordId);

            if (searchPost) {
                setPostToModify(searchPost);
            }
        } else if (recordId !== null && chosenDate === yesterdaysDateUS) {
            searchPost = yesterdayPosts.find(post => post.fieldData.recordId === recordId);

            setPostToModify(searchPost)
        }

        if (searchPost) {
            setPostToModify(searchPost)
        } else {
            setPostToModify({
                fieldData: {
                    "!common_article_name": "",
                    "!Project": "",
                    common_arendenr: "",
                    common_article_no: "",
                    common_comment_customer: "",
                    common_comment_internal: "",
                    time_employee_id: "SOS",
                    time_date: "",
                    time_source: "App",
                    time_time_end: "",
                    time_time_start: "",
                    projectName: ""
                }
            });
        }



    }, [])

    // ADDING DATA TO FORM TO BE SENT TO API 
    const handleChange = (name, value) => {

        if (recordId) {
            setPostToModify(prevData => ({
                ...prevData,
                fieldData: {
                    ...prevData.fieldData,
                    [name]: value
                }
            }))
        } else {
            setFormData(prevData => ({
                ...prevData,
                fieldData: {
                    ...prevData.fieldData,
                    [name]: value
                }
            }));
        }
    };
    useEffect(() => {
        if (saving === true) {
            setSaving(false);
            if (recordId) {
                handlePatch();

            } else {
                handlePost();
            }
        }
    }, [saving])

    // POST NEW RECORD FUNCTION
    const handlePost = async () => {

        // const API_URL_IOS = "http://localhost/registerTime";

        const API_URL_LOCAL = "http://10.0.200.102/registerTime";
        const API_URL_ANDROID = "http://10.0.2.2:80/registerTime";
        const API_URL_IOS = "http://10.0.200.102/registerTime";
        const API_URL = "http://localhost/registerTime";
        let URL = ""

        if (Platform.OS === 'ios') {
            URL = API_URL_IOS
        } else if (Platform.OS === 'android') {
            URL = API_URL_ANDROID
        }

        try {

            const filteredData = Object.fromEntries(
                Object.entries(formData.fieldData)
                    .filter(([key]) => key !== "projectName")
            );

            const payload = {
                ...formData,
                "fieldData": filteredData
            };

            console.log(payload.fieldData)

            await axios.post(URL, payload, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } });

            const tempId = Math.floor(Math.random() * 1000)

            const updatedFormData = {
                ...formData,
                "fieldData": {
                    ...formData.fieldData,
                    recordId: tempId
                }
            }

            if (chosenDate === todaysDateUS) {
                setCurrentDayPosts(prevPosts => timeSort([...prevPosts, updatedFormData]));
            } else if (chosenDate === yesterdaysDateUS) {
                setYesterdayPosts(prevPosts => timeSort([...prevPosts, updatedFormData]))
            }

            alert("Tid reggat!")
            navigation.goBack();

        } catch (e) {
            alert("Tid inte reggat!")
            console.log(e)
            console.log(e.response?.data);
        }
    }

    // PATCH EXISTING RECORD FUNCTION
    const handlePatch = async () => {
        if (!recordId) {
            console.log('Record ID is undefined or invalid');
            alert("Record ID is undefined. Try to refresh project list")
            return;
        }

        const API_URL_LOCAL = `http://10.0.200.102/modifyTime/${recordId}`;
        const API_URL_ANDROID = `http://10.0.2.2:80/modifyTime/${recordId}`;
        const API_URL_IOS = `http://10.0.200.102/modifyTime/${recordId}`;
        // const API_URL_IOS = `http://localhost/modifyTime/${recordId}`;
        let URL = "";


        if (Platform.OS === 'ios') {
            URL = API_URL_IOS
        } else if (Platform.OS === 'android') {
            URL = API_URL_ANDROID
        }

        try {

            // Removes all blanks to prevent redundant and empty data being sent to the API. 
            const filteredData = Object.fromEntries(
                Object.entries(postToModify.fieldData)
                    .filter(([key, value]) => key !== "recordId" && value !== "" && value !== null && value !== undefined && key !== "projectName")
            );

            // filteredData removes the "fieldData" variable that encapsulates the data being modified
            // Solution to this is to simply place data-to-modify in a new object that has a fieldData variable in it. Lazy but it works.

            let filteredData2 = {
                "fieldData": {
                    ...filteredData
                }
            }

            await axios.patch(URL, filteredData2, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            // Re-entering recordId into the modified post so that you can re-enter it from the card in the calendar view.

            filteredData2 = {
                "fieldData": {
                    ...filteredData2.fieldData,
                    "recordId": recordId,
                }
            }

            // Find the outdated version of cached post and replace

            if (chosenDate === todaysDateUS) {
                const updatedPosts = currentDayPosts.map(item =>
                    item.fieldData.recordId === recordId ? filteredData2 : item
                );
                const sortedPosts = timeSort(updatedPosts)
                setCurrentDayPosts(sortedPosts);
            } else if (chosenDate === yesterdaysDateUS) {
                const updatedPosts = yesterdayPosts.map(item =>
                    item.fieldData.recordId === recordId ? filteredData2 : item
                );
                const sortedPosts = timeSort(updatedPosts)
                setYesterdayPosts(sortedPosts);
            }

            alert("Post ändrad");
            console.log()
            navigation.goBack();

        } catch (e) {
            console.log("Error:", e);
            console.log("Error response:", e.response);
        }
    }

    // "SPARA" BUTTON -> FIRES OFF API POST/PATCH CALL
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={styles.sparaButton}>
                    <TouchableOpacity onPress={() => setSaving(true)}><Text style={{ color: "#198754" }}>Spara</Text></TouchableOpacity>
                    <Image source={Checkmark} />
                </View>
            ),
        });
    }, [navigation]);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}

                >

                    <Modal visible={isTimePickerOpen} transparent={true} animationType='slide' onRequestClose={() => SetTimePickerIsOpen(false)}>
                        <TimePicker
                            onClose={() => setTimePickerIsOpen(false)}
                            visible={isTimePickerOpen}
                            isStartTime={isStartTime}
                            onSelect={HandleTimeSelect}
                        />
                    </Modal>
                    <Modal visible={isProjectPickerOpen} transparent={true} animationType='slide' onRequestClose={() => setIsProjectPickerOpen(false)}>

                        {/* PROJECTPICKER */}
                        <ProjectPicker
                            onClose={() => setIsProjectPickerOpen(false)}
                            visible={isProjectPickerOpen}
                            onSelect={handleProjectSelect}
                        />

                    </Modal>
                    <Modal visible={isArticlePickerOpen} transparent={true} animationType='slide' onRequestClose={() => setArticlePickerOpen(false)}>
                        <ArticlePicker
                            onClose={() => setArticlePickerOpen(false)}
                            visible={isArticlePickerOpen}
                            onSelect={handleArticleSelect}

                        />
                    </Modal>

                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1 }}
                        keyboardShouldPersistTaps="handled" // Allows touchable elements to work even when the keyboard is visible
                        scrollEnabled={true}
                    >

                        <View style={styles.container}>

                            {/* PROJEKTKOD, ARTIKELKOD, TODOID INPUTS */}

                            <View style={styles.inputContainer}>
                                <View style={styles.inputChild}>
                                    <Text style={{ fontSize: 12, color: "#2C334066" }}>Projektkod</Text>

                                    <TouchableOpacity style={styles.input} onPress={ToggleProjectPicker}>
                                        <Text>
                                            {
                                                postToModify && postToModify.fieldData["!Project"]
                                                    ? postToModify.fieldData["!Project"]
                                                    : (selectedProject && selectedProject.displayValue !== ""
                                                        ? selectedProject.displayValue
                                                        : "Välj Projekt")
                                            }
                                        </Text>
                                    </TouchableOpacity>


                                </View>
                                <Text style={styles.inputResult}>
                                    {!projectNameDisplay ? "" : projectNameDisplay}
                                </Text>
                            </View>
                            <View style={styles.inputContainer}>
                                <View style={styles.inputChild}>
                                    <Text style={{ fontSize: 12, color: "#2C334066" }}>Artikelkod</Text>

                                    <TouchableOpacity style={styles.input} onPress={ToggleArticlePicker}>
                                        <Text>
                                            {
                                                postToModify && postToModify.fieldData.common_article_no
                                                    ? postToModify.fieldData.common_article_no
                                                    : (selectedArticle && selectedArticle.displayValue !== ""
                                                        ? selectedArticle.displayValue
                                                        : "Välj Artikel")
                                            }
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.inputResult}>{!articleNameDisplay ? "" : articleNameDisplay}</Text>
                            </View>
                            <View style={styles.inputContainer}>
                                <View style={styles.inputChild}>
                                    <Text style={{ fontSize: 12, color: "#2C334066" }}>ToDo ID</Text>

                                    <TextInput style={styles.input} placeholder='Ange ToDo ID' />

                                </View>
                                <Text style={styles.inputResult}>Placeholder Money</Text>
                            </View>

                            {/* TIME INPUT */}

                            <View style={styles.timeContainer}>
                                <View style={styles.timeInputContainer}>
                                    <TouchableOpacity onPress={ToggleStartTimePicker}>
                                        <Text
                                            style={styles.timeInput}
                                        >
                                            {!recordId ? formData.fieldData.time_time_start || "Start" : postToModify.fieldData.time_time_start.substring(0, 5) || "Start"}
                                        </Text>

                                    </TouchableOpacity>
                                </View>
                                <View style={styles.timeInputContainer}>

                                    <TouchableOpacity onPress={ToggleEndTimePicker}>
                                        <Text
                                            style={styles.timeInput}
                                        >
                                            {!recordId ? formData.fieldData.time_time_end || "Stopp" : postToModify.fieldData.time_time_end.substring(0, 5) || "Stopp"}
                                        </Text>

                                    </TouchableOpacity>

                                </View>
                            </View>

                            {/* DEBITERA x EJ ARBETE */}

                            <View style={styles.checkboxContainer}>
                                <View style={styles.checkBoxSubContainer}>
                                    <Text style={styles.checkboxText}>Debitera</Text><TouchableOpacity onPress={handleDebitera} style={styles.checkbox}>{isDebiterat ? (<Text style={styles.checkboxChecked}>X</Text>) : null}</TouchableOpacity>
                                </View>
                                <View style={styles.checkBoxSubContainer}>
                                    <Text style={styles.checkboxText}>Ej arbete</Text><TouchableOpacity onPress={handleEjArbete} style={styles.checkbox}>{ejArbete ? (<Text style={styles.checkboxChecked}>X</Text>) : null}</TouchableOpacity>
                                </View>
                            </View>

                            {/* KUNDKOMMENTAR INPUT FIELDS */}


                            <View style={styles.commentContainer}>
                                <View>
                                    <Text style={styles.commentHeader}>Kundkommentar</Text>
                                    <TextInput
                                        style={styles.commentTextInput}
                                        multiline={true}
                                        placeholderTextColor="gray"
                                        value={recordId ? postToModify?.fieldData?.common_comment_customer || "" : formData.fieldData.common_comment_customer}
                                        onChangeText={(text) => handleChange('common_comment_customer', text)}></TextInput>
                                </View>
                                <View>
                                    <Text style={styles.commentHeader}>Intern kommentar</Text>
                                    <TextInput style={styles.commentTextInput}
                                        multiline={true}
                                        placeholderTextColor="gray"
                                        value={recordId ? postToModify?.fieldData?.common_comment_internal || "" : formData.fieldData.common_comment_internal}
                                        onChangeText={(text) => handleChange('common_comment_internal', text)}></TextInput>
                                </View>
                            </View>
                        </View>

                    </ScrollView>

                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </GestureHandlerRootView>
    )
}

const styles = StyleSheet.create({

    // PROJEKT, ARTIKEL och ToDo VÄLJARE

    container: {
        flex: 1,
        marginTop: 20
        // flexDirection: "row"

    },
    inputContainer: {
        paddingTop: 14,
        paddingRight: 20,
        paddingBottom: 14,
        paddingLeft: 20,
        marginBottom: 15

    },
    inputChild: {
        flexDirection: "row",
        alignItems: "center",
        // height: 40,
        borderBottomWidth: 1,
        borderColor: "#2C33401A",
        paddingBottom: 10,
    },
    input: {
        position: "absolute",
        // marginLeft: 15,
        fontSize: 15,
        left: 70,
        bottom: 9

    },
    inputResult: {
        // borderColor: "red",
        // borderWidth: 1,
        paddingTop: 10,
        marginLeft: 70,
        fontWeight: "bold"
    },

    // TIDSVÄLJARE

    timeContainer: {
        // flex: 1,
        flexDirection: "row",
        justifyContent: "space-evenly",

        height: 50

    },
    timeInputContainer: {
        alignItems: "center",
        justifyContent: "center",
        height: 50,
        width: 172,
        borderRadius: 6,
        backgroundColor: "#2C33400D",

    },
    timeInput: {
        textAlign: "auto",
    },

    // DEBITERA, EJ ARBETE TOGGLES

    checkboxContainer: {
        // flex: 1,
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginTop: 5,

        // borderWidth: 1,
        // borderColor: "red",
        // borderStyle: "solid",

    },
    checkBoxSubContainer: {
        flexDirection: "row",
        // justifyContent: "center",
        alignItems: "center",
        height: 50,
        marginTop: 5
        // borderWidth: 1,
        // borderColor: "red"
    },
    checkboxText: {
        fontSize: 16,
    },
    checkbox: {
        borderWidth: 2,
        borderColor: "black",
        width: 24,
        height: 24,
        marginLeft: 6,
        textAlign: "center",
        textAlignVertical: "center",
        justifyContent: "center",
        alignContent: "center"
    },
    checkboxChecked: {
        textAlign: "center",
        fontWeight: "bold",
    },

    // KUNDKOMMENTAR & INTERN KOMMENTAR

    commentContainer: {
        // flex: 1,
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 10,
        gap: 10
        // justifyContent: "center",
        // alignItems: "center",
        // border: 1,
        // borderWidth: 1,
        // borderColor: "red",
        // borderStyle: "solid",
    },

    commentHeader: {
        paddingLeft: 10,
        paddingRight: 10,
        // paddingTop: 5,
        marginTop: 5,
        height: 30,
        color: "#2C334066"
    },

    commentTextInput: {
        paddingTop: 10,
        paddingRight: 20,
        paddingBottom: 10,
        paddingLeft: 20,
        height: 100,
        borderRadius: 12,
        backgroundColor: "#2C33400D",
        width: 353,
    },

    sparaButton: {
        width: 80,
        flexDirection: "row",
        gap: 6
    },

    item: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
})

export default RegTime