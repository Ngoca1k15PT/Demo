import { open } from 'react-native-nitro-sqlite';

// Book interface
export interface Book {
  id: number;
  name: string;
}

// QueryResult interface to handle both successful results and errors
export interface QueryResult {
  success: boolean;
  data?: any[];
  error?: string;
  rowsAffected?: number;
  columns?: string[];
}

// Database name
const DB_NAME = 'demo.db';
let db: any = null;

// Initialize database
export const initDatabase = (): boolean => {
  try {
    // Open or create database
    db = open({ name: DB_NAME });
    
    // Create book table if it doesn't exist
    db.execute(
      'CREATE TABLE IF NOT EXISTS book (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL);'
    );
    
    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
};

// Execute a custom SQL query
export const executeQuery = (query: string): QueryResult => {
  if (!db) {
    initDatabase();
    if (!db) {
      return {
        success: false,
        error: 'Database not initialized'
      };
    }
  }
  
  try {
    // Execute the query
    const result = db.execute(query);
    
    // Extract column names from the first row if available
    let columns: string[] = [];
    if (result.rows && result.rows.length > 0) {
      const firstRow = result.rows.item(0);
      columns = Object.keys(firstRow);
    }
    
    // Convert rows to array for easier handling
    const data = [];
    if (result.rows) {
      const len = result.rows.length;
      for (let i = 0; i < len; i++) {
        data.push(result.rows.item(i));
      }
    }
    
    return {
      success: true,
      data,
      rowsAffected: result.rowsAffected || 0,
      columns
    };
  } catch (error: any) {
    console.error('Error executing query:', error);
    return {
      success: false,
      error: error.message || 'Unknown error executing query'
    };
  }
};

// Populate book table with 100 book names
export const populateBookTable = (): boolean => {
  try {
    // First check if table already has data
    const result = db.execute(
      'SELECT COUNT(*) as count FROM book;'
    );
    
    const count = result.rows.item(0).count;
    
    // Only populate if table is empty
    if (count === 0) {
      // Generate 100 book names and insert them
      const bookNames = generateBookNames();
      
      // Use a transaction for better performance
      db.execute('BEGIN TRANSACTION;');
      
      bookNames.forEach((bookName) => {
        db.execute(
          'INSERT INTO book (name) VALUES (?);',
          [bookName]
        );
      });
      
      db.execute('COMMIT;');
      console.log('Book table populated with 100 book records');
    } else {
      console.log('Book table already has data, skipping population');
    }
    
    return true;
  } catch (error) {
    console.error('Error populating book table:', error);
    // Try to rollback transaction if error occurs
    try {
      db.execute('ROLLBACK;');
    } catch (rollbackError) {
      console.error('Error rolling back transaction:', rollbackError);
    }
    return false;
  }
};

// Get all books from the database
export const getAllBooks = (): Book[] => {
  try {
    const result = db.execute(
      'SELECT * FROM book;'
    );
    
    const books: Book[] = [];
    const len = result.rows.length;
    
    for (let i = 0; i < len; i++) {
      books.push(result.rows.item(i) as Book);
    }
    
    return books;
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
};

// Close the database
export const closeDatabase = (): boolean => {
  try {
    if (db) {
      db.close();
      db = null;
      console.log('Database closed successfully');
    }
    return true;
  } catch (error) {
    console.error('Error closing database:', error);
    return false;
  }
};

// Helper function to generate 100 book names
const generateBookNames = (): string[] => {
  const bookPrefixes = [
    'The Art of', 'A History of', 'Introduction to', 'Advanced', 'Mastering',
    'Complete Guide to', 'Principles of', 'Exploring', 'Understanding', 'Essential'
  ];
  
  const bookSubjects = [
    'Programming', 'Data Science', 'Machine Learning', 'Web Development', 'Mobile Apps',
    'Algorithms', 'Database Design', 'Network Security', 'Artificial Intelligence', 'Cloud Computing'
  ];
  
  const bookAdjectives = [
    'Modern', 'Practical', 'Theoretical', 'Professional', 'Comprehensive',
    'Strategic', 'Interactive', 'Creative', 'Innovative', 'Fundamental'
  ];
  
  const books: string[] = [];
  
  // Generate 100 unique book names
  for (let i = 1; i <= 100; i++) {
    const prefixIndex = i % 10;
    const subjectIndex = Math.floor(i / 10) % 10;
    const adjectiveIndex = Math.floor(i / 20) % 5;
    
    let bookName = `${bookPrefixes[prefixIndex]} ${bookAdjectives[adjectiveIndex]} ${bookSubjects[subjectIndex]}`;
    
    // Add volume number for some books to ensure uniqueness
    if (i > 50) {
      bookName += ` Vol. ${Math.floor((i - 50) / 10) + 1}`;
    }
    
    books.push(bookName);
  }
  
  return books;
}; 