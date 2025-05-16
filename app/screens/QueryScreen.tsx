import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { WebView } from 'react-native-webview';

interface QueryScreenProps {
  setActiveTab: (tab: string) => void;
  setSqlQuery: (query: string) => void;
}

const QueryScreen: React.FC<QueryScreenProps> = ({ setActiveTab, setSqlQuery }) => {
  const [query, setQuery] = React.useState<string>('');
  const webViewRef = React.useRef<WebView>(null);

  // HTML content for embedding CodeMirror in WebView
  const codeMirrorHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
        <style>
          html, body, #editor {
            // margin: 0;
            // padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            background-color:rgb(255, 255, 255);
          }
          .CodeMirror {
            // height: 100%;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            height: 100% !important;
            font-size: 22px;
            font-family: 'Courier New', Courier, monospace;
          }
          .cm-hint {
            font-size: 24px !important;
            padding: 10px 15px;
            margin: 4px;
            font-weight: bold;
          }
          .CodeMirror-hints {
            // z-index: 1000;
            max-height: 300px;
            width: auto !important;
            min-width: 250px;
            padding: 5px;
            border: 2px solid #ddd;
            border-radius: 10px !important;
            overflow-y: auto !important;
            overflow-x: hidden !important;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          }
          .CodeMirror-hints .CodeMirror-hint {
            font-size: 24px !important;
            border-top-left-radius: 10px !important;
            border-top-right-radius: 10px !important;
            padding: 8px 12px;
            font-family: 'Courier New', Courier, monospace;
          }
          textarea {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            font-size: 16px;
            font-family: 'Courier New', Courier, monospace;
            padding: 8px;
          }
          .CodeMirror-activeline-background {
            background: transparent !important;
            border: 1px solid #ccc;
          }
          .cm-keyword {
            color: #0066ff !important;
            font-weight: bold;
          }
          .cm-def {
            color: #0066ff !important;
          }
          .cm-variable {
            color: #0066ff !important;
          }
          .cm-operator {
            color: #0066ff !important;
          }
          .cm-number {
            color: #0066ff !important;
          }
          .cm-string {
            color: #0066ff !important;
          }
        </style>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.12/codemirror.min.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.12/theme/dracula.min.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.12/addon/hint/show-hint.min.css">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.12/codemirror.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.12/mode/sql/sql.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.12/addon/hint/show-hint.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.12/addon/hint/sql-hint.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.12/addon/edit/matchbrackets.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.12/addon/selection/active-line.min.js"></script>
          </head>
      <body>
        <div id="editor"></div>
        <script>
          // Sample table structure for SQL hints
          const tables = {
            book: ["id", "title", "author", "published_date", "genre", "price", "is_available"],
            authors: ["id", "name", "birth_date", "nationality", "biography"],
            genres: ["id", "name", "description"],
            publishers: ["id", "name", "address", "founded_year"]
          };

          // Simple fallback to a plain textarea if needed
          function setupPlainTextarea() {
            const textarea = document.createElement('textarea');
            textarea.placeholder = 'Enter SQL query here...';
            document.getElementById('editor').appendChild(textarea);
            
            textarea.addEventListener('input', function() {
              window.ReactNativeWebView.postMessage(
                JSON.stringify({ type: 'content', value: textarea.value })
              );
            });
            
            // Function to set textarea value from React Native
            window.setEditorValue = function(value) {
              textarea.value = value;
            };
          }

          // Try to initialize CodeMirror with textarea mode
          try {
            const editor = CodeMirror(document.getElementById('editor'), {
              mode: 'text/x-sql',
              theme: 'default',
              // lineNumbers: true,
              indentWithTabs: true,
              smartIndent: true,
              lineWrapping: true,
              matchBrackets: true,
              autofocus: true,
              viewportMargin: Infinity,
              inputStyle: 'textarea',
              styleActiveLine: true,
              hintOptions: {
                tables: tables,
                completeSingle: false,
                completeOnSingleClick: true
              }
            });
            
            // Simple extraKeys configuration
            editor.setOption("extraKeys", {
              "Ctrl-Space": "autocomplete",
              "Tab": function(cm) {
                var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
                cm.replaceSelection(spaces);
              }
            });
            
            // Enable automatic hinting
            editor.on('keyup', function(cm, event) {
              // Don't hint on these keys
              const ignoreKeys = [
                13, // Enter
                27, // Escape
                37, // Left
                38, // Up
                39, // Right
                40, // Down
                16, // Shift
                17, // Ctrl
                18, // Alt
                91, // Command
                9 , // Tab
                8, // Backspace
                46, // Delete
                33, // Page Up
                34, // Page Down
                35, // End
                36, // Home
                116, // Refresh
                114, // Reload
              ];
              
              if (!cm.state.completionActive && 
                  !ignoreKeys.includes(event.keyCode)) {
                // Only show hints if there's some text to match against
                const cursor = cm.getCursor();
                const token = cm.getTokenAt(cursor);
                
                if (token.string && token.string.length > 0 && token.string !== ' ') {
                  CodeMirror.commands.autocomplete(cm);
                }
              }
            });

            // Send editor content to React Native on change
            editor.on('change', function() {
              window.ReactNativeWebView.postMessage(
                JSON.stringify({ type: 'content', value: editor.getValue() })
              );
            });
            
            // Function to set editor content from React Native
            window.setEditorValue = function(value) {
              editor.setValue(value);
            };
          } catch (e) {
            console.error('Failed to initialize CodeMirror:', e);
            setupPlainTextarea();
          }
        </script>
      </body>
    </html>
  `;

  // Handle messages from WebView
  const handleWebViewMessage = (event: any) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      if (message.type === 'content') {
        setQuery(message.value);
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  // Execute query
  const handleRunQuery = () => {
    console.log('Running query:', query);
    // Set the query and navigate to the result screen
    setSqlQuery(query);
    setActiveTab('Result');
  };

  // Submit query
  const handleSubmitQuery = () => {
    if (query.trim() === '') {
      // If query is empty, show a default query
      const defaultQuery = 'SELECT * FROM book';
      setSqlQuery(defaultQuery);
    } else {
      setSqlQuery(query);
    }
    setActiveTab('Result');
  };

  return (
    <View style={styles.content}>
      <View style={styles.bookChip}>
        <View style={styles.iconContainer}>
          <Text style={styles.databaseIcon}>⊙</Text>
        </View>
        <Text style={styles.bookText}>book</Text>
      </View>
      
      <View style={styles.queryEditorContainer}>
          <WebView
            ref={webViewRef}
            originWhitelist={['*']}
            source={{ html: codeMirrorHtml }}
            onMessage={handleWebViewMessage}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            keyboardDisplayRequiresUserAction={false}
            startInLoadingState={true}
            scrollEnabled={false}
            style={styles.webView}
          />
      </View>
      
      <View style={styles.bottomContainer}>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.helpButton}>
            <Text style={styles.helpButtonText}>?</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.runButton}
            onPress={handleRunQuery}
          >
            <Text style={styles.runButtonText}>Run</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmitQuery}>
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
  toggleButton: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    marginHorizontal: 16,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 8,
  },
  toggleButtonText: {
    fontSize: 14,
    color: '#333',
  },
  queryEditorContainer: {
    flex: 1,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  webView: {
    flex: 1,
    backgroundColor: 'white',
  },
  nativeTextarea: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    textAlignVertical: 'top',
    fontSize: 16,
    fontFamily: 'monospace',
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