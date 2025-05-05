import React, { useEffect } from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { useNavigation } from 'expo-router';

const ToDoCard = ({ project }) => {

    if (!project || !project.fieldData) {
        return <Text>Loading...</Text>; 
    }
    const {
        time_time_start,
        time_time_end,
        common_article_no,
        common_comment_customer,
        common_comment_internal,
        time_employee_id,
        recordId
    } = project.fieldData;

    const projectName = project.fieldData['!Project'];

    const navigation = useNavigation();
    const formattedStartTime = time_time_start ? time_time_start.slice(0, 5) : ''
    const formattedEndTime = time_time_end ? time_time_end.slice(0, 5) : ''

    const goToRegTime = (recordId) => {
        navigation.navigate("Regga Tid", { recordId })
    }

    function CalculateHours(startTime, endTime) {

        const start = new Date(`1970-01-01T${startTime}`);
        const end = new Date(`1970-01-01T${endTime}`);

        const diffMs = end - start;
        const diffHours = diffMs / (1000 * 60 * 60);

        return diffHours;
    }

    const diffHours = CalculateHours(time_time_start, time_time_end)

    return (
        <View style={styles.cardContainer}>
            <View style={styles.cardText}>

                <View style={styles.time}>
                    <Text style={styles.startTime}>{formattedStartTime}</Text>
                    <Text style={styles.text}>{formattedEndTime}</Text>
                </View>

                <View style={styles.hour}>
                    <Text style={styles.textDiffHours}>{diffHours}</Text>
                </View>

                <TouchableOpacity onPress={() => goToRegTime(recordId)} style={styles.postInfo}>
                    <Text style={styles.projectName}>{common_article_no}</Text>
                    <Text numberOfLines={1} ellipsizeMode='tail' style={styles.text}>{common_comment_customer}</Text>
                </TouchableOpacity>

                <View>
                    <Text style={styles.text}></Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        fontFamily: "SilkaRegular"
    },
    cardText: {
        // marginTop: 400,
        margin: "auto",
        flex: 1,
        flexDirection: "row",
        width: 373,
        height: 60,
        minHeight: 60,
        // justifyContent: "center",
        alignItems: 'center',
        // borderWidth: 1,
        // borderColor: "red",
        // borderStyle: "dotted",
        paddingLeft: 10,
        paddingRight: 10,
        borderBottomWidth: 2,
        borderColor: "#2C33401A",
        justifyContent: "space-between"
    },
    time: {
        marginRight: 14,

    },
    hour: {
        width: 40,
        paddingRight: 24,
        // borderColor: "red",
        // borderWidth: 1,
        // borderStyle: "red",

    },
    postInfo: {
        // borderColor: "red",
        // borderWidth: 1,
        // borderStyle: "red",
        width: 246
    },
    project: {
        marginRight: 14
    },
    checkMark: {
    },
    text: {
        fontFamily: "SilkaRegular",
        fontSize: 12
    },
    textDiffHours: {
        fontFamily: "SilkaRegular",
        fontSize: 12,
        width: 30,
        textAlign: "center"
    },
    startTime: {
        fontWeight: "bold",
        fontSize: 12,
    },
    projectName: {
        // fontFamily: "SilkaRegular",
        fontWeight: "bold",
        color: "#6E8EFF",
    }
})

export default ToDoCard