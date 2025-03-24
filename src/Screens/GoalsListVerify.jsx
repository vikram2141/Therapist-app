import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";

const GoalsListVerify = () => {
  const [formData, setFormData] = useState({
    caregiverName: "",
    caregiverSignature: "",
    staffName: "",
    staffRole: "", // New field for dropdown
  });

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const navigation = useNavigation();

  const handleGoalsListNotesScreen = () => {
    navigation.navigate("GoalsListNotes");
  };
  const handleDataDetailScreen = () => {
    navigation.navigate("DataDetail");
  };
  const handleGoalsListVerify = () => {
    navigation.navigate("GoalsListVerify");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Goals List</Text>
      </View>

      {/* Sync Button */}
      <TouchableOpacity style={styles.syncButton}>
        <Text style={styles.syncText}>Sync</Text>
      </TouchableOpacity>

      {/* Tabs */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.inactiveButton} onPress={handleDataDetailScreen}>
          <Text style={styles.inactiveText}>Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.inactiveButton} onPress={handleGoalsListNotesScreen}>
          <Text style={styles.inactiveText}>Notes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.activeButton} onPress={handleGoalsListVerify}>
          <Text style={styles.buttonText}>Verify</Text>
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
      <TextInput
        style={styles.input}
        placeholder="Enter Name"
        value={formData.staffName}
        onChangeText={(text) => handleInputChange("staffName", text)}
      />

      {/* Dropdown for Staff Role */}
      <Text style={styles.label}>Staff Role</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.staffRole}
          onValueChange={(itemValue) => handleInputChange("staffRole", itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Role" value="" />
          <Picker.Item label="Manager" value="manager" />
          <Picker.Item label="Supervisor" value="supervisor" />
          <Picker.Item label="Staff" value="staff" />
        </Picker>
      </View>

      {/* Save Button */}
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  backButton: {
    padding: 5,
    width: 40,
  },
  headerTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  syncButton: {
    backgroundColor: "white",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 20,
    top: 5,
    width: 100,
    marginStart: 270,
    borderWidth: 1,
    borderColor: "blue",
    alignItems: "center",
  },
  syncText: {
    color: "#007AFF",
    fontWeight: "500",
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 12,
    marginHorizontal: 4,
  },
  activeButton: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 32,
    borderRadius: 20,
  },
  inactiveButton: {
    borderColor: "#007bff",
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 32,
    borderRadius: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
    marginBottom: 5,
    padding: 12,
    marginHorizontal: 20,
  },
  input: {
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 10,
    fontSize: 14,
    marginHorizontal: 20,
  },
  pickerContainer: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    marginHorizontal: 20,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  saveButton: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 60,
    alignItems: "center",
    marginTop: 40,
    margin: 20,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default GoalsListVerify;
