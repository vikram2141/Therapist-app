import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions, Modal
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import FormData from 'form-data';
import Home from './HomeScreen';
import Icon from "react-native-vector-icons/MaterialIcons";

const { width } = Dimensions.get('window');


const GoalsList = ({ route }) => {
  const [logoutVisible, setLogoutVisible] = useState(false);

  const [tableData, setTableData] = useState([]);

  const [graphLists, setGraphLists] = useState([[], [], []]);
  const [pagesLists, setPagesLists] = useState([[], [], []]);

  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setGraphLists([
      [], [], []
    ]);

    setPagesLists([
      [], [], []
    ]);

    getGraphData();
  },
    []);

  const renderChart = (index) => {
    return (
      <View style={styles.chartContainer}>
        {chartDataList[index] && chartDataList[index].datasets && chartDataList[index].datasets[0].data.length > 0 ? (
          <LineChart
            data={chartDataList[index]}
            width={width - 20}
            height={220}
            chartConfig={{
              backgroundColor: "#f0f5ff",
              backgroundGradientFrom: "#f0f5ff",
              backgroundGradientTo: "#f0f5ff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              propsForDots: { r: "6", strokeWidth: "2", stroke: "#007AFF" },
              propsForBackgroundLines: { stroke: "#d0d0ff", strokeDasharray: "5, 5" },
              useShadowColorFromDataset: false,
            }}
            bezier
            style={styles.chart}
            withInnerLines
            withOuterLines={false}
            withVerticalLines
            withHorizontalLines
            fromZero
            yAxisLabel=""
            yAxisSuffix=""
            yAxisInterval={20}
            segments={5}
          />
        ) : (
          <Text style={{ textAlign: "center", fontSize: 16, color: "gray", marginTop: 20 }}>
            No Data Found
          </Text>
        )}


        {/* Time Count */}
        <View style={styles.timeCountContainer}>
          <Text style={styles.timeCountText}>Time Count: 3 Minutes</Text>
        </View>

        {/* Pagination */}
        {pagesLists[index] && (
          <View style={styles.pagination}>
            {pagesLists[index].map((page, idx) => (
              <TouchableOpacity key={idx} style={styles.pageButton}>
                <Text style={styles.pageButtonText}>{page}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };



  const chartDataList = graphLists.map((graphData, index) => ({
    labels: labels,
    datasets: [
      {
        data: graphData,
        color: () => "#007AFF",
        strokeWidth: 2,
      },
    ],
  }));

  const getGraphData = async (openValue) => {
    try {
      setGraphLists([
        [], [], []
      ]);
      const storedUserData = await AsyncStorage.getItem("userData");
      if (!storedUserData) throw new Error("User data not found");

      const userData = JSON.parse(storedUserData);
      const token = userData?.api_token;
      if (!token) throw new Error("No token found");

      let formData = new FormData();
      console.log('asdfasdfasdf  ', route.params);
      formData.append("appointment_id", `${route.params.profileData.id}`);

      console.log('asfsfsdfsd', formData);

      let config = {
        method: "post",
        url: "https://therapy.kidstherapy.me/api/appointment-goals",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      };

      const response = await axios(config);

      const patientGoals = response.data.patientGoals || [];

      const newGraphLists = patientGoals.map((goal) =>
        goal.trials.length > 0 ? goal.trials.map((trial) => trial.step_value) : []
      );
      setGraphLists(newGraphLists);


      console.log('dfaslflfksdjfasdf', newGraphLists);

      setGraphLists(newGraphLists);

      // Update table data
      const goals = patientGoals.map((goal, index) => ({
        id: index + 1,
        subDescription: goal.goal,
        description: goal.goal_category?.category || "Other",
        value: 0,
        timeCount: goal.timeCount || "",
        hasChart: openValue != null ? (openValue == index ? true : false) : false,
        type: goal.type,
        totData: goal
      }));
      setTableData(goals);
    } catch (error) {
      console.error(
        "Error fetching data:",
        error.response ? error.response.data : error.message
      );
    }
  };


  const [labels, setLabels] = useState([
    "12/20/12", "12/21/14", "12/22/14", "12/22/50", "12/23/24"
  ]);

  const handleStep = (type) => {
    if (type !== "chartVisible") {
      let newDate = new Date(); // Get current timestamp
      let formattedDate = newDate.toLocaleTimeString(); // "12:30:45 PM"

      // Purane labels ka ek shift ho jaye aur naye timestamp aaye
      setLabels(prevLabels => [...prevLabels.slice(1), formattedDate]);

      // Step value update
      let step_value = type === "countAdd" ? 10 : -10;

      // Graph data update
      setGraphLists(prevData => [...prevData, step_value]);
    }
  };

  const [stepValue, setStepValue] = useState(0);

  const graphValueUpdate = (index, type, item) => {
    setTableData((prevData) => {
      const newData = [...prevData];

      if (type === "chartVisible") {
        newData[index] = { ...newData[index], hasChart: !newData[index].hasChart };
      } else if (type === "countAdd") {
        newData[index] = { ...newData[index], value: newData[index].value + 1 };

        setPagesLists((prevPages) => {
          const updatedPages = [...prevPages];
          updatedPages[index] = [...updatedPages[index], 1]; // Add +1 to the array
          return updatedPages;
        });

        setGraphLists((prev) => {
          const updatedGraph = [...prev];
          updatedGraph[index] = [...updatedGraph[index], newData[index].value];
          return updatedGraph;
        });
      } else if (type === "countMinus" && newData[index].value > 0) {
        newData[index] = { ...newData[index], value: newData[index].value - 1 };

        setPagesLists((prevPages) => {
          const updatedPages = [...prevPages];
          updatedPages[index] = [...updatedPages[index], -1]; // Add -1 to the array
          return updatedPages;
        });


        setGraphLists((prev) => {
          const updatedGraph = [...prev];
          updatedGraph[index] = [...updatedGraph[index], newData[index].value];
          return updatedGraph;
        });


      } else if (type === "timerStart") {
        setIsRunning(!isRunning);
      } else if (type == "timerStop") {
        resetTimer();
      }

      if (type != "chartVisible") {
        const data = {
          goal_id: item.totData.id,
          type: item.totData.type || "bool",
          // value: "", // The backend will calculate this
          step: type === "countAdd" ? 1 : -1,
          step_value: type === "countAdd" ? 1.00 : -1.00,
        }
        callApi(data, index)
      }


      return newData;
    });
  };



  const callApi = async (goalData, index) => {
    console.log('Calling API... ', goalData);
    try {
      const data = new FormData();
      data.append('goal_id', goalData.goal_id);
      data.append('step', goalData.step);
      data.append('step_value', goalData.step_value);
      data.append('type', goalData.type);

      const config = {
        method: 'post',
        url: 'https://therapy.kidstherapy.me/api/add-goal-step-data',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data'
        },
        data: data
      };

      const response = await axios(config);
      await getGraphData(index);

      const updatedStepValue = response.data;

      setTableData((prevData) =>
        prevData.map((goal) => {
          if (goal.totData.id === goalData.goal_id) {
            if (goalData.type === "bool") {
              return {
                ...goal,
                stepValue: updatedStepValue.trial.step_value, // Update stepValue only
              };
            } else if (goalData.type === "percentage") {
              console.log('afafasdf', goal.stepValue);
              return {
                ...goal,
                stepValue: goal.stepValue, // Preserve the existing stepValue
                positiveValue: updatedStepValue.goal.positive_count,
                negatieVlaue: updatedStepValue.goal.negative_count,
              };
            }
          }
          return goal; // Return unchanged goal if no condition is met
        })
      );




    } catch (error) {
      console.error('API Error:', error);
    }
  };

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const hh = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const mm = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const ss = String(seconds % 60).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  };

  const resetTimer = () => {
    setTime(0);
    setIsRunning(false);
  };

  const renderValueControl = (item, index) => {
    if (item.value === null) return null;

    return (
      <View style={styles.valueControl}>
        <TouchableOpacity
          style={styles.minusButton}
          onPress={() => graphValueUpdate(index, item.type === "bool" ? "countMinus" : "timerStart", item)}
        >

          <Text style={styles.buttonText}>
            {item.type === "bool" ? "X" : item.type === "percentage" ? "-" : "▶"}
          </Text>
        </TouchableOpacity>

        {item.type == "percentage" && (
          <View style={styles.valueDisplay}>
            <Text style={styles.valueText}>{item.value}</Text>
          </View>
        )}

        {item.type == "timer" && (
          <View style={styles.valueDisplay}>
            <Text style={styles.valueText}>{formatTime(time)}</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.plusButton}
          onPress={() => graphValueUpdate(index, item.type === "bool" ? "countAdd" : "timerStop", item)}
        >
          <Text
            style={[
              styles.buttonText,
              item.type !== "bool" && item.type !== "percentage" ? { color: "black" } : {},
            ]}
          >
            {item.type === "bool" ? "✔" : item.type === "percentage" ? "+" : "⏸"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };


  const renderActionButtons = (index) => {
    return (
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.graphButton}
          onPress={() => graphValueUpdate(index, "chartVisible")}
        >
          <MaterialCommunityIcons
            name="chart-bell-curve-cumulative"
            size={24}
            color="#007AFF"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton}>
          <MaterialCommunityIcons name="close" size={20} color="#FF3B30" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.editButton}>
          <MaterialCommunityIcons name="briefcase-download-outline" size={20} color="#34C759" />
        </TouchableOpacity>
      </View>
    );
  };

  const navigation = useNavigation();

  const handleGoalsListNotesScreen = () => {
    navigation.navigate("GoalsListNotes");
  };
  const handleGoalsListDetailScreen = () => {
    navigation.navigate("GoalsListDetail");
  };

  const handleGoalsListVerify = () => {
    navigation.navigate("GoalsListVerify");
  };
  const handleLogout = () => {
    setLogoutVisible(false);
    console.log("User logged out");
    // Add logout logic here (e.g., clearing auth state)
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack(Home)}>
          <MaterialCommunityIcons name="chevron-left" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Goals List</Text>

      </View>

      {/* Tabs */}
      <View style={styles.buttonC}>
        {/* Tab Buttons */}
        <View style={styles.buttonContainer}>

          <TouchableOpacity style={styles.inactiveButton} onPress={handleGoalsListDetailScreen}>
            <Text style={styles.inactiveText}>Details</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.activeButton} onPress={handleGoalsListNotesScreen}>
            <Text style={styles.buttonText}>Notes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.inactiveButton} onPress={handleGoalsListVerify}>
            <Text style={styles.inactiveText}>Verify</Text>
          </TouchableOpacity>

        </View>
      </View>
      {/* Total Time Count */}
      <View style={styles.totalTimeContainer}>
        <Text style={styles.totalTimeText}>Total Time Count: 10 Minutes</Text>
      </View>

      {/* Table Header */}
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderText, { flex: 2 }]}>Description</Text>
        <Text style={[styles.tableHeaderText, { flex: 1 }]}>Value</Text>
        <Text style={[styles.tableHeaderText, { flex: 0.7 }]}>Graph</Text>
        <Text style={[styles.tableHeaderText, { flex: 0.7 }]}>Action</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Table Rows */}
        {tableData.map((item, index) => (
          <View key={item.id}>

            {/* Table Row */}
            <View style={styles.tableRow}>

              {/* Description Column */}
              <View style={{ flex: 2 }}>
                <Text style={styles.descriptionText}>{item.description}</Text>
                {item.subDescription && (
                  <Text style={styles.subDescriptionText}>{item.subDescription}</Text>
                )}
                <Text style={styles.Dtext}>
                  {item.type === "bool"
                    ? `${item.stepValue || 0} %`
                    : item.type === "percentage"
                      ? `(${item.positiveValue || 0}, ${item.negatieVlaue || 0})`
                      : !isRunning ? formatTime(time):"00:00:00"} second {/* Remove extra {} */}
                </Text>


              </View>

              {/* Value Column */}
              <View style={{ flex: 1, alignItems: 'center' }}>
                {renderValueControl(item, index)}
              </View>

              {/* Graph & Action Column */}
              <View style={{ flex: 1.4, flexDirection: 'row', justifyContent: 'space-around' }}>
                {renderActionButtons(index)}
              </View>
            </View>

            {/* Dynamic Graph Rendering */}
            {item.hasChart && renderChart(index)}

          </View>
        ))}
      </ScrollView>



      Logout Confirmation Modal
      <Modal transparent={true} visible={logoutVisible} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <MaterialCommunityIcons name="" size={40} color="blue" />
            <Text style={styles.modalText}>
              Are you sure you want to submit the data? Once submitted, it cannot be edited.
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setLogoutVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.yesButton} onPress={handleLogout}>
                <Text style={styles.yesText}>Submit</Text>
              </TouchableOpacity>

            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>


  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#007AFF',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  Dtext: {
    color: "red",
    fontSize:12,
  },
  backButton: {
    padding: 5,
    width: 40,
  }, pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    marginLeft: -160,
  },
  pageButton: {
    backgroundColor: "#007bff",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    margin: 5,
  },
  buttonC: {
    marginHorizontal: 20,
    top: 10,
  },
  pageButtonText: {
    color: "white",
    fontWeight: "bold",
  },

  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 23
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 1,
    marginHorizontal: 8,

  },
  activeButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 32,
    borderRadius: 20,
  },
  inactiveButton: {
    borderColor: '#007bff',
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 32,
    borderRadius: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 12,
    borderRadius: 0,
    backgroundColor: "white",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "blue",

  },
  activeTab: {
    backgroundColor: "#0080DC",
  },
  tabText: {
    color: "#0080DC",
    fontWeight: "bold",

  },
  activeTabText: {
    color: "#FFFFFF",
  },
  headerTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },

  // container: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  timerText: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
  },


  totalTimeContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    top: 18,
  },
  totalTimeText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f7',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    top: 20,
    margin: 10
  },
  tableHeaderText: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#fff",
    margin: 10,
    marginEnd: 30,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  descriptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  subDescriptionText: {
    fontSize: 14,
    color: '#666',
    marginTop: 3,
    width: 120,
  },
  valueControl: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    borderRadius: 4,
    overflow: 'hidden',
  },
  minusButton: {
    backgroundColor: '#007AFF',
    width: 35,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  buttonText: {
    width: 35,
    height: 22,
  },
  plusButton: {
    backgroundColor: '#007AFF',
    width: 35,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  valueDisplay: {
    backgroundColor: 'white',
    width: 25,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#007AFF',
  },
  valueText: {
    color: '#333',
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100',
  },
  graphButton: {
    padding: 10,

  },
  deleteButton: {
    padding: 5,
  },
  editButton: {
    padding: 2,
  },
  chartContainer: {
    backgroundColor: '#f0f5ff',
    padding: 5,
    alignItems: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 0,
  },
  timeCountContainer: {
    alignSelf: 'flex-start',
    marginLeft: 10,
    marginBottom: 5,
  },
  timeCountText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  timeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    paddingHorizontal: 50,
    marginTop: 5,
    marginBottom: 10,
  },
  timeLabel: {
    backgroundColor: '#007AFF',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeLabelText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },

  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0080DC",
    padding: 20,
    borderRadius: 60,
    margin: 20, alignItems: 'center',
  },
  logoutText: { fontSize: 16, color: "#fff", marginLeft: 10, paddingLeft: 103 },
  modalBackground: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContainer: { backgroundColor: "#FFFFFF", padding: 50, paddingHorizontal: 20, borderRadius: 30, width: 350, alignItems: "center" },
  modalText: { fontSize: 16, textAlign: "center", marginVertical: 15 },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
  cancelButton: { backgroundColor: "#E7EDFF", padding: 10, borderRadius: 35, flex: 1, alignItems: "center", marginRight: 10 },
  cancelText: { color: "black", fontWeight: "bold" },
  yesButton: { backgroundColor: "blue", padding: 10, borderRadius: 35, flex: 1, alignItems: "center" },
  yesText: { color: "white", fontWeight: "bold" },
});

export default GoalsList;

