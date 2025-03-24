import React, { useState,useEffect } from 'react';
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

const { width } = Dimensions.get('window');

const GoalsList = () => {
  const [activeTab, setActiveTab] = useState('Details');
  const [logoutVisible, setLogoutVisible] = useState(false);
 
  

  const [graphList, setGraphList] = useState([]);


  // var lableList = ["12/20/12", "12/21/14", "12/22/14", "12/22/50", "12/23/24"];

  // Sample data for the chart
  const chartData = {
    labels: ["12/20/12", "12/21/14", "12/22/14", "12/22/50", "12/23/24"],
    datasets: [
      {
        data:graphList,
        color: () => '#007AFF', // iOS blue color
        strokeWidth: 2
      }
    ],
  };

  const [tableData, setTableData] = useState([]);

    useEffect(() => {
      getGraphData();
    }, []);
    
    const getGraphData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        if (!storedUserData) {
          throw new Error('User data not found');
        }
    
        const userData = JSON.parse(storedUserData);
        const token = userData?.api_token;
    
        if (!token) {
          throw new Error('No token found');
        }
    
        let formData = new FormData();
        formData.append('appointment_id', '2223');
    
        let config = {
          method: 'post',
          url: 'https://therapy.kidstherapy.me/api/appointment-goals',
          headers: { 
            'Accept': 'application/json', 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data' // Set correct content type for FormData
          },
          data: formData
        };
    
        const response = await axios(config);
        console.log("Response:", response.data);

        let configs = {
          method: 'post',
          url: 'https://therapy.kidstherapy.me/api/appointment-goals',
          headers: { 
            'Accept': 'application/json', 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data' // Set correct content type for FormData
          },
          data: formData
        };

        const graphList = {
          patientGoals: response.data.patientGoals.map((goal) => ({
            ...response.data.patientGoals// Spread existing goal properties
    
          })),
        };

        setGraphList(graphList);

      console.log('vsszvszvzcVZC', graphList);
      

      const goals = response.data.patientGoals.map((goal, index) => ({
        id: index + 1,
        subDescription: goal.goal,
        description: goal.goal_category?.category || "Other",
        value: 0,
        timeCount: goal.timeCount || "",
        hasChart: false,
      }));
      setTableData(goals);
    
      } catch (error) {
        console.error("Error fetching data:", error.response ? error.response.data : error.message);
      }
    };

    

    

  const renderValueControl = (item, index) => {
    if (item.value === null) return null;


    
    const handleLogout = () => {
      setLogoutVisible(false);
      console.log("User logged out");
      // Add logout logic here (e.g., clearing auth state)
    };
    return (
      <View style={styles.valueControl}>
        <TouchableOpacity
          style={styles.minusButton}
          onPress={() => graphValueUpdate(index, 'countMinus')}
        >
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        <View style={styles.valueDisplay}>
          <Text style={styles.valueText}>{item.value}</Text>
        </View>
        <TouchableOpacity
          style={styles.minusButton}
          onPress={() => graphValueUpdate(index, 'countAdd')}
        >
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
    );
  };


  const getRandomNumber = () => Math.floor(Math.random() * 100) + 1; // Generates a random number between 1 and 100

  const graphValueUpdate = (index, type) => {
    setTableData(prevData => {
      const newData = [...prevData];
      if (type === "chartVisible") {
        newData[index] = { ...newData[index], hasChart: !newData[index].hasChart };
      } else if (type === "countAdd") {
        newData[index] = { ...newData[index], value: newData[index].value + 1 };
        setGraphList(prevGraph => [...prevGraph, getRandomNumber()]);
      } else if (type === "countMinus") {
        if (newData[index].value > 0) { // Prevents value from going below 0
          newData[index] = { ...newData[index], value: newData[index].value - 1 };
          setGraphList(prevGraph => (prevGraph.length > 0 ? prevGraph.slice(0, -1) : prevGraph));
        }
      }
      return newData;
    });
  };

  const renderActionButtons = (index) => {
    return (
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.graphButton}
          onPress={() => graphValueUpdate(index, 'chartVisible')}
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
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
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
      <View style={styles.totalTimeContainer}>
      <Text style={styles.totalTimeText}>{graphList.length}</Text>


      </View>
      <ScrollView style={styles.scrollView}>
        {/* Table Rows */}
        {tableData.map((item, index) => (
          <View key={item.id}>
            <View style={styles.tableRow}>
              <View style={{ flex: 2 }}>
                <Text style={styles.descriptionText}>{item.description}</Text>
                {item.subDescription && (
                  <Text style={styles.subDescriptionText}>{item.subDescription}</Text>
                )}
              </View>
              <View style={{ flex: 1, alignItems: 'center' }}>
                {renderValueControl(item, index)}
              </View>
              <View style={{ flex: 1.4, flexDirection: 'row', justifyContent: 'space-around' }}>
                {renderActionButtons(index)}
              </View>
            </View>
 
            {/* Chart for first item */}
            {item.hasChart && (
              <View style={styles.chartContainer}>
                <LineChart
                  data={{
                    labels: ["12/20/12", "12/21/14", "12/22/14", "12/22/50", "12/23/24"],
                    datasets: [
                      {
                        data:[graphList.patientGoals[0].id],
                        color: () => '#007AFF', // iOS blue color
                        strokeWidth: 2
                      }
                    ],
                  }}
                  width={width - 20}
                  height={220}
                  chartConfig={{
                    backgroundColor: '#f0f5ff',
                    backgroundGradientFrom: '#f0f5ff',
                    backgroundGradientTo: '#f0f5ff',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                      borderRadius: 0,
                    },
                    propsForDots: {
                      r: "6",
                      strokeWidth: "2",
                      stroke: "#007AFF"
                    },
                    propsForBackgroundLines: {
                      stroke: "#d0d0ff",
                      strokeDasharray: "5, 5"
                    },
                    useShadowColorFromDataset: false
                  }}
                  bezier
                  style={styles.chart}
                  withInnerLines={true}
                  withOuterLines={false}
                  withVerticalLines={true}
                  withHorizontalLines={true}
                  fromZero={true}
                  yAxisLabel=""
                  yAxisSuffix=""
                  yAxisInterval={20}
                  segments={5}
                />
                <View style={styles.timeCountContainer}>
                  <Text style={styles.timeCountText}>Time Count: 3 Minutes</Text>
                </View>
                <View style={styles.pagination}>
                  <TouchableOpacity style={styles.pageButton}>
                    <Text style={styles.pageButtonText}>-1</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.pageButton}>
                    <Text style={styles.pageButtonText}>1</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.pageButton}>
                    <Text style={styles.pageButtonText}>1</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.pageButton}>
                    <Text style={styles.pageButtonText}>-1</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        ))}
      </ScrollView>


      {/* Logout Confirmation Modal */}
      {/* <Modal transparent={true} visible={logoutVisible} animationType="fade">
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
      </Modal> */}
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
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  plusButton: {
    backgroundColor: '#007AFF',
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  valueDisplay: {
    backgroundColor: 'white',
    width: 23,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#007AFF',
  },
  valueText: {
    color: '#333',
    fontSize: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100',
  },
  graphButton: {
    padding: 5,
  },
  deleteButton: {
    padding: 5,
  },
  editButton: {
    padding: 5,
  },
  chartContainer: {
    backgroundColor: '#f0f5ff',
    padding: 10,
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