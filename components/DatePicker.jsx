import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { AuthContext } from '../app/Context';

const DatePicker = ({ onClose, onConfirm }) => {
  const { todaysDateUS, chosenDate, setChosenDate, chosenDateNormal, setChosenDateNormal, formatterUS, formatterNormal } = useContext(AuthContext); // Expected format: MM/DD/YYYY


  // Parse today's date
  const currentMonth = todaysDateUS.substring(0, 2);
  const currentDay = todaysDateUS.substring(3, 5);
  const currentYear = todaysDateUS.substring(6, 10);

  // Set default states to today's date
  const [selectedDay, setSelectedDay] = useState(currentDay);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const generateDays = () => {
    const days = [];
    for (let d = 1; d <= 31; d++) {
      days.push(d.toString().padStart(2, '0'));
    }
    return days;
  };

  const generateMonths = () => {
    const months = [];
    for (let m = 1; m <= 12; m++) {
      months.push(m.toString().padStart(2, '0'));
    }
    return months;
  };

  const generateYears = () => {
    const years = [];
    const yearNum = Number(currentYear);
    for (let y = yearNum - 1; y <= yearNum + 2; y++) {
      years.push(y.toString());
    }
    return years;
  };

  const colorScheme = useColorScheme()

  const dynamicStyles = StyleSheet.create({
    mainContainer: {
      backgroundColor: colorScheme === "dark" ? '#2C3340' : "#FAFAFF",
      width: 350,
      marginTop: 250,
      height: 350,
      padding: 10,
      borderRadius: 10,
      alignSelf: 'center'
    },
    // You can also move other conditional styles here if needed
  });

  const getMonthName = (monthNumber) => {
    const monthNames = [
      "januari", "februari", "mars", "april", "maj", "juni",
      "juli", "augusti", "september", "oktober", "november", "december"
    ];


    return monthNames[monthNumber - 1]
  }

  const monthNames = [
    "januari", "februari", "mars", "april", "maj", "juni",
    "juli", "augusti", "september", "oktober", "november", "december"
  ];

  const handleConfirm = () => {
    const dateUS = `${selectedMonth}/${selectedDay}/${selectedYear}`;
    const dateNormal = `${selectedDay} ${getMonthName(selectedMonth)} ${selectedYear}`;

    onConfirm({ dateUS, dateNormal });
    onClose();
  };

  const handleCancel = () => {
    // If you want to close a modal or trigger a parent handler, add props and call onClose()
    console.log("Cancelled");
    onClose();
  };

  return (
    <View style={dynamicStyles.mainContainer} >
      <View style={styles.container}>
        <Picker
          selectedValue={selectedDay}
          onValueChange={(value) => setSelectedDay(value)}
          style={styles.timeContainer}

        >
          {generateDays().map((day) => (
            <Picker.Item key={day} label={day} value={day} />
          ))}
        </Picker>
        <Picker
          selectedValue={selectedMonth}
          onValueChange={(value) => setSelectedMonth(value)}
          style={styles.timeContainer}
        >
          {generateMonths().map((month) => (
            <Picker.Item key={month} label={month} value={month} />
          ))}
        </Picker>
        <Picker
          selectedValue={selectedYear}
          onValueChange={(value) => setSelectedYear(value)}
          style={styles.yearContainer}
        >
          {generateYears().map((year) => (
            <Picker.Item key={year} label={year} value={year} />
          ))}
        </Picker>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleConfirm}>
          <Text style={styles.confirmButton}>Confirm</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCancel}>
          <Text style={styles.cancelButton}>Avbryt</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    flexDirection: "row",
    justifyContent: "center"
  },
  timeContainer: {
    width: 90,

  },
  yearContainer: {
    width: 120
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    padding: 20
  },
  confirmButton: {
    color: '#FAFFAF',
    padding: 10,
    backgroundColor: "#9EA1AA",
    borderRadius: 10
  },
  cancelButton: {
    color: '#FAFFAF',
    padding: 10,
    backgroundColor: "#DC4C64",
    borderRadius: 10
  }
});

export default DatePicker;
