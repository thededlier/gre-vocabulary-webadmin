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

function newWordAdd(key, word, definition) {
    var html    =   
        '<div class="container" id="container-' + key + '">' +
            '<div class="row">' +
                '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" id="wordlist-' + word + '">' +
                    '<h3 id="' + word + '">' + word + '</h3>' +
                    '<p id="' + word + '-def"> Definition : ' + definition + '</p>' +
                '</div>' +
            '</div>' +
        '</div>'
    ;

    var div = document.createElement('div');
    div.innerHTML = html;
    var element = div.firstChild;

    document.body.insertBefore(div, document.getElementById('end'));
}

function updateWord(key, wordD, wordDef) {
    var wordListRef = firebase.database().ref('/');
    
    var postData = {
        word        :   wordD,
        definition  :   wordDef
    };
    
    var updates = {};
    updates['/wordlist/' + key] = postData;

    return firebase.database().ref().update(updates);
}

function deleteWord(key) {
    firebase.database().ref('/wordlist/').child(key).remove();
}

function searchWord(word) {
    var wordListRef = firebase.database().ref('/');
    var wordKey;

    wordListRef.child('wordlist').orderByChild('word').equalTo(word).on('child_added', function(data) {
        wordKey = data.key;
    });

    return wordKey;

}

// On page load
window.addEventListener('load', function() {
    console.log('Loaded');

    var wordListRef =   firebase.database().ref('/wordlist/');
    var addWordForm =   document.getElementById('addWord-form');
    var updateWordForm  =   document.getElementById('updateWord-form');
    var deleteWordForm  =   document.getElementById('deleteWord-form');

    // Listen for changes and update
    wordListRef.on('child_added', function(data) {
        newWordAdd(data.key, data.val().word, data.val().definition);
    });

    wordListRef.on('child_changed', function(data) {
        var wordDef = document.getElementById(data.val().word + '-def');
        wordDef.innerHTML = data.val().definition;
    });

    wordListRef.on('child_removed', function(data) {
        var wordContainer = document.getElementById('container-' + data.key);
        wordContainer.innerHTML = '';
    });

    // Write word to wordlist
    addWordForm.onsubmit = function(e) {

        console.log('Attempting to submit new word');
        var word    = document.getElementById('new_word').value;
        var wordDef = document.getElementById('word_def').value;

        if (word != '' && wordDef != '') {
            writeToDatabase(word, wordDef);
            console.log('Pushed new word');

            document.getElementById('new_word').value   = '';
            document.getElementById('word_def').value   = '';
        }
    };

    updateWordForm.onsubmit = function(e) {

        console.log('Attempting to update word');
        var word    =   document.getElementById('update-word');
        var wordDef =   document.getElementById('update-word-def');
        
        if (word != '' && wordDef != '') {
            
            var key = searchWord(word.value);
            console.log('Key : ' + key);
            
            updateWord(key, word.value, wordDef.value);
            document.getElementById('update-word').value   = '';
            document.getElementById('update-word-def').value   = '';

            console.log('Pushed word changes');
        }
    };

    deleteWordForm.onsubmit = function(e) {
        console.log('Attempting to delete word');
        var word    =   document.getElementById('delete-word');
        if (word != '') {
            var key = searchWord(word.value);
            console.log('Key : ' + key);

            deleteWord(key);
            document.getElementById('delete-word').value    = '';
            console.log('Deleted word');
        }
    };
}, false);