import React, { useContext, useState } from 'react';
import { View, StyleSheet, TextInput, FlatList, Text, TouchableOpacity } from 'react-native';
import { debounce } from 'lodash'
import { AuthContext } from '../app/Context';

const ValueListPicker = ({ onClose, onSelect }) => {

    const { articleValueList } = useContext(AuthContext);
    const [filteredArticles, setFilteredArticles] = useState(articleValueList);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = debounce((query) => {
        setFilteredArticles(
            articleValueList.filter(project =>
                project.displayValue.toLowerCase().includes(query.toLowerCase())
            )
        );
    }, 300)

    const handleChangeText = (query) => {
        setSearchQuery(query);
        handleSearch(query)
    };

    return (
        <View style={styles.Container}>
            <TextInput
                autoFocus
                value={searchQuery}
                onChangeText={handleChangeText}
                placeholder="Sök Artikel..."
                placeholderTextColor="#929292"
                style={{
                    height: 40,
                    borderColor: 'gray',
                    borderWidth: 1,
                    paddingLeft: 8,
                    marginBottom: 16,
                    backgroundColor: "white"
                }}
            />
            <FlatList
                style={styles.ListContainer}
                data={filteredArticles}
                keyExtractor={(item) => item.value.toString()}
                renderItem={({ item }) => <TouchableOpacity onPress={() => onSelect(item)}><Text style={styles.Text}>{item.displayValue}</Text></TouchableOpacity>}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
                <Text onPress={onClose} style={{ color: '#FAFFAF', margin: "auto", padding: 10, backgroundColor: "#DC4C64", borderRadius: 10, fontSize: 20 }}>Cancel</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    Container: {
        width: 350,
        margin: "auto",
        marginTop: 170,
        height: 350,
        // backgroundColor: "white",
        backgroundColor: '#2C3340',
        padding: 10,
        borderRadius: 10
    },
    ListContainer: {
        backgroundColor: "#9EA1AA",
        borderRadius: 10,
        color: "white",
        padding: 3
    },
    Text: {
        color: "white",
        padding: 3,
        fontSize: 20
    }

});





export default ValueListPicker;
