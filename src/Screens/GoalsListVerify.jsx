import React, { useState, useEffect } from "react";

import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from "@react-navigation/native";
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import HomeScreen from "./HomeScreen";


const GoalsListVerify = () => {
  const [formData, setFormData] = useState({
    caregiverName: "",
    caregiverSignature: "",
    staffName: "",
   
  });

  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  // Fetch therapist list from API
  useEffect(() => {
    const fetchTherapists = async () => {
      try {

        const storedUserData = await AsyncStorage.getItem("userData");
        if (!storedUserData) throw new Error("User data not found");
    
        const userData = JSON.parse(storedUserData);
        const token = userData?.api_token;
        if (!token) throw new Error("No token found");
        
        const response = await axios.get("https://therapy.kidstherapy.me/api/therapist-list", {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        }});

        if (response.data && Array.isArray(response.data)) {
          const formattedData = response.data.map((therapist) => ({
            label: therapist.name,
            value: therapist.id.toString(),
          }));
          setStaffList(formattedData);
        }
      } catch (error) {
        console.error("Error fetching therapists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTherapists();
  }, []);



  
  const handleGoalsListDetailScreen = () => {
    navigation.navigate("GoalsListDetail");
  };

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack(HomeScreen)}>
          <Icon name="chevron-left" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Goals List</Text>
      </View>
    
  <TouchableOpacity style={styles.syncButton}>
        <Text style={styles.syncText}>Sync</Text>
      </TouchableOpacity>

      {/* Tab Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.inactiveButton} onPress={handleGoalsListDetailScreen}>
                   <Text style={styles.inactiveText}>Details</Text>
                 </TouchableOpacity>
        <TouchableOpacity style={styles.inactiveButton} onPress={() => navigation.navigate("GoalsListNotes")}>
          <Text style={styles.inactiveText}>Notes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.inactiveButton} onPress={() => navigation.navigate("GoalsListVerify")}>
          <Text style={styles.inactiveText}>Verify</Text>
        </TouchableOpacity>
      </View>


      {/* Form Inputs */}
      <Text style={styles.label}>Parent/Caregiver</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Name"
        value={formData.caregiverName}
        onChangeText={(text) => handleInputChange("caregiverName", text)}
      />

      <Text style={styles.label}>Parent/Caregiver Signature</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Signature"
        value={formData.caregiverSignature}
        onChangeText={(text) => handleInputChange("caregiverSignature", text)}
      />

      <Text style={styles.label}>Name of Staff</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={staffList}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Select Staff"
          searchPlaceholder="Search..."
          value={formData.staffName}
          onChange={(item) => handleInputChange("staffName", item.value)}
          renderLeftIcon={() => <AntDesign style={styles.icon} color="black" name="Safety" size={20} />}
        />
      )}

      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};


// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    backgroundColor: "#007BFF",
    padding: 40,
    alignItems: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  }, header: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    backgroundColor: '#007AFF', borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 5,
    width: 40,
  },
  
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding:23,
  }, buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 12,
    marginHorizontal:4,
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
    borderColor: "#0080DC",
    
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
  syncButton: {
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 20,
    top:5,
    width: 100,
    marginStart:270,
    borderWidth:1,
    borderColor:"blue",
    alignItems: 'center',
  },
  syncText: {
    color: '#007AFF',
    fontWeight: '500',
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 5,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    color: '#007AFF',
    fontWeight: '500',
    fontSize: 16,
  },
  activeTabText: {
    color: 'black',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  buttonOutline: {
    borderWidth: 1,
    borderColor: "#007BFF",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  buttonTextOutline: {
    color: "#007BFF",
    fontWeight: "bold",
  },
  buttonPrimary: {
    backgroundColor: "#007BFF",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  buttonDisabled: {
    backgroundColor: "#E0E0E0",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginLeft:250,
    marginRight:20,
  },
  buttonTextDisabled: {
    color: "#A0A0A0",
    fontWeight: "bold",
    alignItems:"center",
    
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
    marginBottom: 5,
    padding:12,
    marginHorizontal:20,


  },
  input: {
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 10,
    fontSize: 14,
    marginHorizontal:20,
  },
  saveButton: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 60,
    alignItems: "center",
    marginTop: 40,
    margin:20,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },dropdown: { marginHorizontal: 20, backgroundColor: "#F5F5F5", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8 },
  placeholderStyle: { fontSize: 14, color: "#A0A0A0" },
  selectedTextStyle: { fontSize: 14, color: "#000" },
  inputSearchStyle: { fontSize: 14, color: "#000" },
  iconStyle: { marginRight: 10 },
  icon: { marginRight: 10 },
});

export default GoalsListVerify;
