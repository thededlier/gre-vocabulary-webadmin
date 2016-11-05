// Initialize Firebase

var config = {
    apiKey: "AIzaSyD81iwuCfGQVC8_rhwNYRaJBadTfuZNDyI",
    authDomain: "gre-vocabulary-app.firebaseapp.com",
    databaseURL: "https://gre-vocabulary-app.firebaseio.com",
    storageBucket: "gre-vocabulary-app.appspot.com",
    messagingSenderId: "976263507443"
};

firebase.initializeApp(config);

//  write new word to database
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

function newWordAdd(word, definition) {
    var html    =   
        '<div class="container">' +
            '<div class="row">' +
                '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">' +
                    '<h3>' + word + '</h3>' +
                    '<p> Definition : ' + definition + '</p>' +
                '</div>' +
            '</div>' +
        '</div>'
    ;

    var div = document.createElement('div');
    div.innerHTML = html;
    var element = div.firstChild;

    document.body.insertBefore(div, document.getElementById('end'));
}

// On page load
window.addEventListener('load', function() {
    console.log('Loaded');

    var wordListRef =   firebase.database().ref('/wordlist/');
    var addWordForm =   document.getElementById("addWord-form");

    // Listen for changes and update
    wordListRef.on('child_added', function(data) {
        console.log(data);
        newWordAdd(data.val().word, data.val().definition);
    });

    wordListRef.on('child_changed', function(data) {

    });

    wordListRef.on('child_removed', function(data) {

    });

    // Write word to wordlist
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