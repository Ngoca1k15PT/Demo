import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';

const ResultScreen = () => {
  const bookData = [
    { id: 3, title: "12 Rules for Life: An Antidote to Chaos" },
    { id: 4, title: "1984 (Signet Classics)" },
    { id: 5, title: "5,000 Awesome Facts (About Everything!)" },
    { id: 6, title: "A Dance with Dragons (A Song of Ice and Fire)" },
    { id: 7, title: "A Game of Thrones / A Clash of Kings / A Storm" },
    { id: 8, title: "A Gentleman in Moscow: A Novel" },
    { id: 9, title: "A Higher Loyalty: Truth, Lies, and Leadership" },
    { id: 10, title: "A Man Called Ove: A Novel" },
    { id: 11, title: "A Patriot's History of the United States: From" },
    { id: 12, title: "A Stolen Life: A Memoir" },
    { id: 13, title: "A Wrinkle in Time (Time Quintet)" },
    { id: 14, title: "Act Like a Lady, Think Like a Man: What Men" },
    { id: 15, title: "Adult Coloring Book Designs: Stress Relief C" },
    { id: 16, title: "Adult Coloring Book: Stress Relieving 'Anima" },
  ];

  return (
    <View style={styles.content}>
      <View style={styles.bookChip}>
        <View style={styles.iconContainer}>
          <Text style={styles.databaseIcon}>⊙</Text>
        </View>
        <Text style={styles.bookText}>books</Text>
      </View>
      
      <View style={styles.resultHeader}>
        <Text style={styles.resultHeaderText}>Showing 100 out of 350 rows</Text>
      </View>
      
      <ScrollView style={styles.tableContainer}>
        {bookData.map((book) => (
          <View key={book.id} style={styles.tableRow}>
            <View style={styles.idCell}>
              <Text style={styles.idText}>{book.id}</Text>
            </View>
            <View style={styles.titleCell}>
              <Text style={styles.titleText}>{book.title}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      
      <View style={styles.backButtonContainer}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backButtonText}>Back to Code</Text>
        </TouchableOpacity>
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
  resultHeader: {
    backgroundColor: '#15213a',
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultHeaderText: {
    color: 'white',
    fontSize: 18,
  },
  tableContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingLeft: 10
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  idCell: {
    width: 50,
    padding: 16,
    justifyContent: 'center',
  },
  idText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  titleCell: {
    flex: 1,
    padding: 16,
    borderLeftWidth: 1,
    borderColor: '#eee',
  },
  titleText: {
    fontSize: 16,
    color: '#333',
  },
  backButtonContainer: {
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: 'white',
  },
  backButton: {
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: 'white',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ResultScreen; 