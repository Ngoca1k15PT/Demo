import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { getAllBooks } from '../database/DatabaseHelper';

interface Book {
  id: number;
  name: string;
}

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Load books when component mounts
    loadBooks();
  }, []);

  const loadBooks = () => {
    setLoading(true);
    // Get all books from the database
    const bookList = getAllBooks();
    setBooks(bookList);
    setLoading(false);
  };

  const renderBookItem = ({ item }: { item: Book }) => (
    <View style={styles.bookItem}>
      <Text style={styles.bookId}>{item.id}</Text>
      <Text style={styles.bookName}>{item.name}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1a2550" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book List ({books.length})</Text>
      {books.length > 0 ? (
        <FlatList
          data={books}
          renderItem={renderBookItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No books found.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f5f8',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 16,
    color: '#1a2550',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  bookItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  bookId: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 12,
    backgroundColor: '#1a2550',
    color: 'white',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 50,
    minWidth: 40,
    textAlign: 'center',
  },
  bookName: {
    fontSize: 16,
    flex: 1,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
});

export default BookList; 