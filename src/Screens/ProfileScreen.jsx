import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Modal, ScrollView, Alert } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons"; 
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const ProfileScreen = () => {
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [profile, setProfile] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get("https://api.example.com/profile");
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      Alert.alert("Error", "Failed to load profile data");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("https://api.example.com/logout");
      setLogoutVisible(false);
      Alert.alert("Success", "You have been logged out.");
      navigation.replace("Login");
    } catch (error) {
      console.error("Logout failed:", error);
      Alert.alert("Error", "Logout failed. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView>
        {profile && (
          <View style={styles.profileContainer}>
            <Image source={{ uri: profile.image }} style={styles.profileImage} />
            <Text style={styles.profileName}>{profile.name}</Text>
          </View>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput style={styles.input} value={profile?.name} editable={false} />
          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} value={profile?.email} editable={false} />
          <Text style={styles.label}>Phone Number</Text>
          <TextInput style={styles.input} value={profile?.phone} editable={false} />
          <Text style={styles.label}>Address</Text>
          <TextInput style={styles.input} value={profile?.address} editable={false} />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={() => setLogoutVisible(true)}>
          <MaterialCommunityIcons name="logout" size={20} color="blue" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal transparent visible={logoutVisible} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <MaterialCommunityIcons name="logout" size={40} color="blue" />
            <Text style={styles.modalText}>Are you sure you want to Logout?</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setLogoutVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.yesButton} onPress={handleLogout}>
                <Text style={styles.yesText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#0080DC", paddingVertical: 35, paddingHorizontal: 20 },
  headerTitle: { fontSize: 22, color: "white", fontWeight: "bold" },
  profileContainer: { alignItems: "center", marginTop: 20 },
  profileImage: { width: 90, height: 90, borderRadius: 50 },
  profileName: { fontSize: 18, fontWeight: "bold", marginTop: 10 },
  inputContainer: { paddingHorizontal: 20, marginTop: 20 },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  input: { backgroundColor: "#E7EDFF", padding: 15, borderRadius: 10, marginBottom: 15 },
  logoutButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#E7EDFF", padding: 20, borderRadius: 10, margin: 20 },
  logoutText: { fontSize: 16, color: "blue", marginLeft: 10 },
  modalBackground: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContainer: { backgroundColor: "#FFFFFF", padding: 50, paddingHorizontal: 20, borderRadius: 30, width: 350, alignItems: "center" },
  modalText: { fontSize: 16, textAlign: "center", marginVertical: 15 },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
  cancelButton: { backgroundColor: "#E7EDFF", padding: 10, borderRadius: 35, flex: 1, alignItems: "center", marginRight: 10 },
  cancelText: { color: "black", fontWeight: "bold" },
  yesButton: { backgroundColor: "blue", padding: 10, borderRadius: 35, flex: 1, alignItems: "center" },
  yesText: { color: "white", fontWeight: "bold" }
});

export default ProfileScreen;
