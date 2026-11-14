import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, ScrollView, Alert, ActivityIndicator } from 'react-native';
import CheckBox from '@react-native-community/checkbox'; // Updated import
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebase/firebase'; // Import Firestore
import { collection, addDoc } from 'firebase/firestore'; // Firestore functions
import RNHTMLtoPDF from 'react-native-html-to-pdf'; // For generating PDF labels

export default function IntakeScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [device, setDevice] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [selectedIssues, setSelectedIssues] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  const navigation = useNavigation();

  // Common issues (you can add more in the future)
  const commonIssues = [
    'Screen not working',
    'Battery not charging',
    'Water damage',
    'Speaker not working',
    'Wi-Fi connectivity issues',
    'Fader not working',
    'CD player not working',
    'Bluetooth connectivity issues',
    'USB port not working',
    'Aux port not working',
    'Headphone jack not working',
    'Microphone not working',
    'Volume control not working',
    'Power button not working',
    'Warranty repair',
    'Other',
  ];

  const handleIssueToggle = (issue) => {
    if (selectedIssues.includes(issue)) {
      setSelectedIssues(selectedIssues.filter((item) => item !== issue));
    } else {
      setSelectedIssues([...selectedIssues, issue]);
    }
  };

  const handleSubmit = async () => {
    if (!firstName || !lastName || !device || !serialNumber || selectedIssues.length === 0) {
      Alert.alert('Error', 'Please fill out all fields and select at least one issue.');
      return;
    }

    setLoading(true); // Show loading spinner

    try {
      // Save repair details to Firestore
      const repairDetails = {
        firstName,
        lastName,
        device,
        serialNumber,
        issues: selectedIssues,
        status: 'Received', // Default status
        createdAt: new Date(), // Timestamp
      };

      // Add a new document to the "repairs" collection
      const docRef = await addDoc(collection(db, 'repairs'), repairDetails);
      console.log('Repair order saved with ID:', docRef.id);

      // Generate and print labels
      await generateLabels(repairDetails);

      // Navigate to Home after submission
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error saving repair order:', error);
      Alert.alert('Error', 'Failed to save repair order. Please try again.');
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  const generateLabels = async (repairDetails) => {
    const { firstName, lastName, device, serialNumber } = repairDetails;

    // HTML template for the label
    const html = `
      <html>
        <body>
          <h1>Repair Label</h1>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Device:</strong> ${device}</p>
          <p><strong>Serial Number:</strong> ${serialNumber}</p>
        </body>
      </html>
    `;

    try {
      // Generate PDF
      const options = {
        html,
        fileName: `repair_label_${serialNumber}`,
        directory: 'Documents',
      };
      const pdf = await RNHTMLtoPDF.convert(options);
      console.log('PDF saved at:', pdf.filePath);

      // Print the PDF (you'll need a printing library or API)
      // Example: Use a thermal printer or a regular printer
      Alert.alert('Success', 'Labels generated successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to generate labels. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>New Repair Order</Text>

      {/* First Name */}
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />

      {/* Last Name */}
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />

      {/* Device */}
      <TextInput
        style={styles.input}
        placeholder="Device Name/Model"
        value={device}
        onChangeText={setDevice}
      />

      {/* Serial Number */}
      <TextInput
        style={styles.input}
        placeholder="Serial Number"
        value={serialNumber}
        onChangeText={setSerialNumber}
      />

      {/* Common Issues */}
      <Text style={styles.sectionTitle}>Common Issues</Text>
      {commonIssues.map((issue, index) => (
        <View key={index} style={styles.checkboxContainer}>
          <CheckBox
            value={selectedIssues.includes(issue)}
            onValueChange={() => handleIssueToggle(issue)}
            style={styles.checkbox}
          />
          <Text style={styles.checkboxText}>{issue}</Text>
        </View>
      ))}

      {/* Submit Button */}
      {loading ? (
        <ActivityIndicator size="large" color="#cc0000" />
      ) : (
        <Button 
          title="Submit" 
          onPress={handleSubmit}
          color="#cc0000"
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#ffe5e5'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#cc0000'
  },
  input: {
    height: 40,
    borderColor: '#cc0000',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: 'white'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    color: '#cc0000'
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxText: {
    fontWeight: 'normal',
  }
});