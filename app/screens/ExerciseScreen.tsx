import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const ExerciseScreen = () => {
  return (
    <View style={styles.content}>
      <View style={styles.bookChip}>
        <View style={styles.iconContainer}>
          <Text style={styles.databaseIcon}>⊙</Text>
        </View>
        <Text style={styles.bookText}>books</Text>
      </View>

      <View style={styles.mainContent}>
        <Text style={styles.title}>Our very own table</Text>
        
        <View style={styles.xpContainer}>
          <Text style={styles.xpText}>0 XP</Text>
        </View>
        
        <Text style={styles.paragraph}>
          A database has been set up for this course and the{' '}
          <Text style={styles.highlight}>books</Text> table is available here.
        </Text>
        
        <Text style={styles.paragraph}>
          Run the code provided to explore what data{' '}
          <Text style={styles.highlight}>books</Text> holds! You don't need to write anything new yet.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  bookChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 15,
    width: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    marginVertical: 10,
    marginLeft: 15,
  },
  iconContainer: {
    marginRight: 8,
  },
  databaseIcon: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  bookText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  mainContent: {
    flex:1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#222',
  },
  xpContainer: {
    position: 'absolute',
    right: 20,
    top: 20,
    backgroundColor: '#ffcc00',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  xpText: {
    fontWeight: 'bold',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  highlight: {
    backgroundColor: '#eaeaea',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
});

export default ExerciseScreen; 