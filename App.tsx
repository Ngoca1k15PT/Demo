import * as React from 'react';
import { StyleSheet, SafeAreaView, Text, View, TouchableOpacity, Image, StatusBar, Platform, TextInput, ScrollView } from 'react-native';
import ExerciseScreen from './app/screens/ExerciseScreen';
import QueryScreen from './app/screens/QueryScreen';
import ResultScreen from './app/screens/ResultScreen';

const App = () => {
  const [activeTab, setActiveTab] = React.useState('Exercise');

  // Hiển thị màn hình dựa trên tab đang active
  const renderScreen = () => {
    switch(activeTab) {
      case 'Exercise':
        return <ExerciseScreen />;
      case 'Query':
        return <QueryScreen />;
      case 'Result':
        return <ResultScreen />;
      default:
        return <ExerciseScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#f4f5f8" barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuIcon}>≡</Text>
        </TouchableOpacity>
        
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'Exercise' && styles.activeTab]} 
            onPress={() => setActiveTab('Exercise')}
          >
            <Text style={[styles.tabText, activeTab === 'Exercise' && styles.activeTabText]}>Exercise</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'Query' && styles.activeTab]} 
            onPress={() => setActiveTab('Query')}
          >
            <Text style={[styles.tabText, activeTab === 'Query' && styles.activeTabText]}>Query</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'Result' && styles.activeTab]} 
            onPress={() => setActiveTab('Result')}
          >
            <Text style={[styles.tabText, activeTab === 'Result' && styles.activeTabText]}>Result</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.homeButton}>
          <Text style={styles.homeIcon}>⌂</Text>
        </TouchableOpacity>
      </View>

      {/* Hiển thị màn hình tương ứng với tab đang chọn */}
      {renderScreen()}

      {activeTab === 'Exercise' && (
        <TouchableOpacity style={styles.continueButton}>
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f5f8',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  menuButton: {
    paddingHorizontal: 10,
  },
  menuIcon: {
    fontSize: 24,
  },
  homeButton: {
    paddingHorizontal: 10,
  },
  homeIcon: {
    fontSize: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    flex: 1,
    maxWidth: 344,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#1a2550',
    overflow: 'hidden',
    marginHorizontal: 25
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  activeTab: {
    backgroundColor: '#1a2550',
  },
  tabText: {
    color: '#333',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
  },
  continueButton: {
    backgroundColor: '#00d374',
    paddingVertical: 16,
    alignItems: 'center',
    margin: 16,
    borderRadius: 8,
  },
  continueText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});