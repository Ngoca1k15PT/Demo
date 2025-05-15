import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList } from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';

const QueryScreen = () => {
  const [query, setQuery] = React.useState<string>('');
  const [suggestions, setSuggestions] = React.useState<string[]>([]);

  // SQL Keywords for autocompletion
  const sqlKeywords = [
    'SELECT', 'FROM', 'WHERE', 'GROUP BY', 'ORDER BY', 'HAVING', 
    'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'LIMIT',
    'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM',
    'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE', 'INDEX', 'VIEW',
    'AND', 'OR', 'NOT', 'NULL', 'IS NULL', 'IS NOT NULL',
    'COUNT', 'AVG', 'SUM', 'MIN', 'MAX', 'DISTINCT',
    'AS', 'IN', 'BETWEEN', 'LIKE', 'DESC', 'ASC'
  ];

  // Function to filter suggestions based on current query
  const getSuggestions = (text: string): string[] => {
    const lastWord = text.split(' ').pop()?.toUpperCase() || '';
    if (lastWord.length > 0) {
      return sqlKeywords.filter(keyword => 
        keyword.startsWith(lastWord) && keyword !== lastWord
      );
    }
    return [];
  };

  // Handle text change and update suggestions
  const handleQueryChange = (text: string): void => {
    setQuery(text);
    setSuggestions(getSuggestions(text));
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion: string): void => {
    const words = query.split(' ');
    words.pop();
    const newQuery = [...words, suggestion, ''].join(' ');
    setQuery(newQuery);
    setSuggestions([]);
  };

  return (
    <View style={styles.content}>
      <View style={styles.bookChip}>
        <View style={styles.iconContainer}>
          <Text style={styles.databaseIcon}>⊙</Text>
        </View>
        <Text style={styles.bookText}>books</Text>
      </View>
      
      <View style={styles.queryEditorContainer}>
        <View style={styles.autocompleteContainer}>
          <Autocomplete
            data={suggestions}
            defaultValue={query}
            onChangeText={handleQueryChange}
            placeholder="Type your SQL query here..."
            placeholderTextColor="#2196f3"
            flatListProps={{
              keyboardShouldPersistTaps: 'always',
              keyExtractor: (item) => item,
              renderItem: ({ item }) => (
                <TouchableOpacity 
                  style={styles.suggestionItem} 
                  onPress={() => handleSelectSuggestion(item)}
                >
                  <Text style={styles.suggestionText}>{item}</Text>
                </TouchableOpacity>
              ),
            }}
            inputContainerStyle={styles.inputContainerStyle}
            containerStyle={styles.autocompleteContainerStyle}
            style={styles.sqlInput}
          />
        </View>
      </View>
      
      <View style={styles.bottomContainer}>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.helpButton}>
            <Text style={styles.helpButtonText}>?</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.runButton}>
            <Text style={styles.runButtonText}>Run</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
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
  queryEditorContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  autocompleteContainer: {
    flex: 1,
    position: 'relative',
    zIndex: 1,
  },
  autocompleteContainerStyle: {
    flex: 1,
  },
  inputContainerStyle: {
    borderWidth: 0,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#f8f8f8',
  },
  suggestionText: {
    fontSize: 16,
    color: '#2196f3',
  },
  sqlLine: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  sqlKeyword: {
    color: '#2196f3',
    fontSize: 18,
    fontWeight: '500',
  },
  sqlOperator: {
    fontSize: 18,
  },
  sqlText: {
    fontSize: 18,
    color: '#333',
  },
  sqlInput: {
    fontSize: 18,
    paddingVertical: 4,
    color: '#2196f3',
    width: '100%',
  },
  bottomContainer: {
    padding: 16,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  helpButton: {
    width: 60,
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: 'white',
  },
  helpButtonText: {
    fontSize: 24,
    color: '#666',
  },
  runButton: {
    width: 90,
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: 'white',
    marginHorizontal: 8,
  },
  runButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  submitButton: {
    flex: 1,
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00d374',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default QueryScreen;