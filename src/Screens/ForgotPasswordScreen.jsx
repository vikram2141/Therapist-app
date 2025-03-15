import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    Keyboard.dismiss();

    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://therapy.kidstherapy.me/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        Alert.alert('Success', data.message || 'OTP sent to your email.');
        navigation.navigate('OTPVerification', { email });
      } else {
        Alert.alert('Error', data.message || 'Failed to send OTP. Try again.');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Network error. Please try again later.');
      console.error('Forgot Password Error:', error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.logoButton}>
            <Text style={styles.logoText}>Logo Here</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>Enter your email for verification. We will send a 6-digit code to your email.</Text>
          
          <Text style={styles.label}>Enter Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Your Email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TouchableOpacity style={styles.sendButton} onPress={handleSendCode} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.sendButtonText}>Send Code</Text>}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerContainer: { alignItems: 'center', marginBottom: 30, backgroundColor: '#0073e6', padding: 40, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  logoButton: { backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 5, borderRadius: 6 },
  logoText: { fontSize: 14, fontWeight: 'bold', color: '#090D4D' },
  formContainer: { flex: 1, paddingHorizontal: 20, paddingTop: 30 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#090D4D' },
  subtitle: { fontSize: 14, color: '#090D4D', marginBottom: 20 },
  label: { fontSize: 14, fontWeight: 'bold', marginTop: 10, color: '#090D4D', paddingBottom: 10 },
  input: { backgroundColor: '#E7EDFF', borderRadius: 4, paddingHorizontal: 15, paddingVertical: 12, fontSize: 16, color: '#090D4DB2', marginBottom: 15 },
  sendButton: { backgroundColor: '#007bff', borderRadius: 60, paddingVertical: 12, alignItems: 'center', marginHorizontal: 20, marginTop: 20 },
  sendButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
