import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { db } from '../firebase/firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';

export default function OrdersScreen() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch repair orders from Firestore
    const q = query(collection(db, 'repairs'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const ordersData = [];
      querySnapshot.forEach((doc) => {
        ordersData.push({ id: doc.id, ...doc.data() });
      });
      setOrders(ordersData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Repair Orders</Text>
      
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.orderItem}>
            <Text style={styles.device}>{item.device}</Text>
            <Text style={styles.issue}>{item.issues.join(', ')}</Text>
            <Text style={styles.status}>{item.status}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  orderItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10
  },
  device: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#cc0000'
  },
  issue: {
    fontSize: 16,
    color: '#333'
  },
  status: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic'
  }
});