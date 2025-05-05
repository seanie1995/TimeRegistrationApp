import React from 'react'
import { View, StyleSheet , Text} from 'react-native'


const UserCard = ({user}) => {
    const { firstName, lastName, email, recordId} = user;

    return (
        <View style={styles.cardText}>
            <Text>{firstName} {lastName}</Text>
            <Text>{email}</Text>
            <Text>{recordId}</Text>
        </View>
    )
}

const styles = StyleSheet.create({ 
    cardText: {
        width: 350,
        height: 50,
        flex: 1,
        flexDirection: "row",
        marginTop: 10,
        justifyContent: 'space-evenly',
        alignItems: 'center',  
        borderTopColor: 'transparent',
        borderBottomColor: 'black',
        borderLeftColor: 'transparent' ,
        borderRightColor: 'transparent' ,
        borderWidth: 1,
        borderStyle: "solid"
    }
})

export default UserCard