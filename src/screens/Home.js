import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      
      <Button 
        title="New Repair Order" 
        onPress={() => navigation.navigate('Intake')}
        color="#cc0000"
      />
      
      <Button 
        title="View Orders" 
        onPress={() => navigation.navigate('Orders')}
        color="#cc0000"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  }
});