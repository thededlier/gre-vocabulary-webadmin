// Initialize Firebase

var config = {
    apiKey: "AIzaSyD81iwuCfGQVC8_rhwNYRaJBadTfuZNDyI",
    authDomain: "gre-vocabulary-app.firebaseapp.com",
    databaseURL: "https://gre-vocabulary-app.firebaseio.com",
    storageBucket: "gre-vocabulary-app.appspot.com",
    messagingSenderId: "976263507443"
};

firebase.initializeApp(config);

function writeToDatabase(newUWord, wordDef) {
    // New word post data
    var postData = {
        word        :   newUWord,
        definition  :   wordDef
    };

    // Get a key for a new Post.
    var newPostKey = firebase.database().ref().child('wordlist').push().key;

    // Write the new words 
    var updates = {};
    updates['/wordlist/' + newPostKey] = postData;

    return firebase.database().ref().update(updates);
} 

window.addEventListener('load', function() {
    console.log('Loaded');


    var addWordForm = document.getElementById("addWord-form");
    
    addWordForm.onsubmit = function(e) {

        console.log('Submitted new word');
        var word    = document.getElementById('new_word').value;
        var wordDef = document.getElementById('word_def').value;

        if (word != '' && wordDef != '') {
            writeToDatabase(word, wordDef);
            console.log('Pushed new word');

            document.getElementById('new_word').value   = '';
            document.getElementById('word_def').value   = '';
        }
    };
}, false);