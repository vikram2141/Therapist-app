import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

export default function GoalsListScreen({ route }) {
  const [activeTab, setActiveTab] = useState("Details");
  const [profileData, setProfileData] = useState(null);
  const [user, setUser] = useState(null);
  const navigation = useNavigation();
  const { appointment } = route.params;

  useEffect(() => {
    setProfileData(appointment);
  }, [appointment]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("https://therapy.kidstherapy.me/api/profile", {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${appointment?.user?.api_token}`, // Ensure userData is correctly referenced
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.back}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={25} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.logoText}>Goals List</Text>
      </View>

      {/* Sync Button */}
      <TouchableOpacity style={styles.syncButton}>
        <Text style={styles.syncText}>Sync</Text>
      </TouchableOpacity>

      {/* Tab Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.activeButton}>
          <Text style={styles.buttonText}>Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.inactiveButton} onPress={() => navigation.navigate("GoalsListNotes")}>
          <Text style={styles.inactiveText}>Notes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.inactiveButton} onPress={() => navigation.navigate("GoalsListVerify")}>
          <Text style={styles.inactiveText}>Verify</Text>
        </TouchableOpacity>
      </View>

      {/* Content Section */}
      <ScrollView style={styles.contentContainer}>
        <View style={styles.infoBox}>
          {profileData ? (
            <>
              <View style={styles.row}>
                <Text style={styles.label}>Patient name:</Text>
                <Text style={styles.value}>{profileData.user?.name || "N/A"}</Text>
              </View>

              
              <View style={styles.row}>
                <Text style={styles.label}>Doctor name:</Text>
                <Text style={styles.value}>{user?.name || "Pallavi Nathani"}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Therapy:</Text>
                <Text style={styles.value}>{profileData.appointment_status?.name || "N/A"}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Date:</Text>
                <Text style={styles.value}>{profileData.appointment_date || "N/A"}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Time:</Text>
                <Text style={styles.value}>
                  {profileData.start_time && profileData.end_time
                    ? `${profileData.start_time} To ${profileData.end_time}`
                    : "N/A"}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Supervisor:</Text>
                <Text style={styles.value}>{profileData.supervisor_therapist || "N"}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Notes:</Text>
                <Text style={styles.value}>{profileData.problem || "null"}</Text>
              </View>
            </>
          ) : (
            <Text>Loading...</Text>
          )}
        </View>
      </ScrollView>

      {/* Collect Data Button */}
      <TouchableOpacity style={styles.collectButton}>
        <Text style={styles.collectButtonText}>Collect Data</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FD",
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
    backgroundColor: "#0073e6",
    padding: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  back: {
    position: "absolute",
    left: 20,
    top: 20,
  },
  logoText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  syncButton: {
    alignSelf: "flex-end",
    backgroundColor: "#E7EDFF",
    borderWidth: 1,
    borderColor: "#0080DC",
    paddingVertical: 8,
    paddingHorizontal: 32,
    borderRadius: 50,
    marginRight: 20,
  },
  syncText: {
    color: "#0080DC",
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  activeButton: {
    backgroundColor: "#0080DC",
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
  inactiveText: {
    color: "#007bff",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  infoBox: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    margin: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
  value: {
    fontSize: 16,
    color: "#555",
  },
  collectButton: {
    backgroundColor: "#0080DC",
    paddingVertical: 12,
    borderRadius: 60,
    alignItems: "center",
    marginVertical: 15,
    margin: 20,
  },
  collectButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
