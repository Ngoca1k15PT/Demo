import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Book, executeQuery, QueryResult, initDatabase, populateBookTable } from '../database/DatabaseHelper';

interface ResultScreenProps {
  setActiveTab: (tab: string) => void;
  sqlQuery?: string;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ setActiveTab, sqlQuery }) => {
  const [queryResult, setQueryResult] = React.useState<QueryResult | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [initialized, setInitialized] = React.useState<boolean>(false);
  
  React.useEffect(() => {
    // Initialize database when component mounts
    if (!initialized) {
      const init = initDatabase();
      if (init) {
        populateBookTable();
        setInitialized(true);
      }
    }
  }, [initialized]);

  React.useEffect(() => {
    // Execute the query when provided
    if (sqlQuery) {
      setLoading(true);
      const result = executeQuery(sqlQuery);
      setQueryResult(result);
      setLoading(false);
    } else {
      // If no query is provided, show all books by default
      setLoading(true);
      const result = executeQuery('SELECT * FROM book');
      setQueryResult(result);
      setLoading(false);
    }
  }, [sqlQuery]);

  const renderTableHeader = () => {
    if (!queryResult?.success || !queryResult.columns || queryResult.columns.length === 0) {
      return null;
    }

    return (
      <View style={styles.tableHeader}>
        {queryResult.columns.map((column, index) => (
          <Text key={index} style={styles.headerText}>{column}</Text>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.content}>
      <View style={styles.bookChip}>
        <View style={styles.iconContainer}>
          <Text style={styles.databaseIcon}>⊙</Text>
        </View>
        <Text style={styles.bookText}>book</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1a2550" />
        </View>
      ) : (
        <>
          {sqlQuery && (
            <View style={styles.queryContainer}>
              <Text style={styles.queryLabel}>Executed Query:</Text>
              <ScrollView horizontal style={styles.queryScroll}>
                <Text style={styles.queryText}>{sqlQuery}</Text>
              </ScrollView>
            </View>
          )}

          {queryResult && !queryResult.success ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorTitle}>Error</Text>
              <Text style={styles.errorText}>{queryResult.error}</Text>
            </View>
          ) : (
            <>
              <View style={styles.resultHeader}>
                <Text style={styles.resultHeaderText}>
                  {queryResult?.data?.length 
                    ? `Showing ${queryResult.data.length} row(s)` 
                    : queryResult?.rowsAffected && queryResult.rowsAffected > 0 
                      ? `${queryResult.rowsAffected} row(s) affected` 
                      : 'No data returned'}
                </Text>
              </View>
              
              {queryResult?.data && queryResult.data.length > 0 ? (
                <ScrollView style={styles.tableContainer}>
                  {renderTableHeader()}
                  
                  {queryResult.data.map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.tableRow}>
                      {queryResult.columns?.map((column, colIndex) => (
                        <View key={colIndex} style={styles.cell}>
                          <Text style={styles.cellText}>
                            {row[column] !== null && row[column] !== undefined 
                              ? row[column].toString() 
                              : 'NULL'}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ))}
                </ScrollView>
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    {queryResult?.rowsAffected && queryResult.rowsAffected > 0 
                      ? `Operation completed successfully. ${queryResult.rowsAffected} row(s) affected.`
                      : 'No data returned from query.'}
                  </Text>
                </View>
              )}
            </>
          )}
        </>
      )}
      
      <View style={styles.backButtonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => setActiveTab('Query')}>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  queryContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 10,
  },
  queryLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  queryScroll: {
    maxHeight: 60,
  },
  queryText: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#0066cc',
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
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
  },
  headerText: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 16,
    paddingHorizontal: 10,
    color: '#333',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  cell: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#eee',
  },
  cellText: {
    fontSize: 16,
    color: '#333',
  },
  errorContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff0f0',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
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