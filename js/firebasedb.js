// Initialize Firebase
var config = {
    apiKey: "AIzaSyD81iwuCfGQVC8_rhwNYRaJBadTfuZNDyI",
    authDomain: "gre-vocabulary-app.firebaseapp.com",
    databaseURL: "https://gre-vocabulary-app.firebaseio.com",
    storageBucket: "gre-vocabulary-app.appspot.com",
    messagingSenderId: "976263507443"
};

firebase.initializeApp(config);

var n1 = "Hooo";
var n2 = "Hi";

function writeToDatabase(newWord, wordDef) {
    // Todo : Fix duplicates

    // New word post data
    var postData = {
        word        :   newWord,
        definition  :   wordDef
    };

    // Get a key for a new Post.
    var newPostKey = firebase.database().ref().child('wordlist').push().key;

    // Write the new words 
    var updates = {};
    updates['/wordlist/' + newPostKey] = postData;

    return firebase.database().ref().update(updates);
} 

writeToDatabase(n1, n2);