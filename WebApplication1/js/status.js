$(document).ready(function () {
    if (localStorage.user != null) { //if user already logged in, details saved -> auto-login
        user = JSON.parse(localStorage.user);
    }

    ph_status = document.getElementById("ph-status");
    ph_status.innerHtml = "";
    //FireBase users status
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    usersOnline = [];
    uref = firebase.database().ref("status");
    //create a key based on user ID
    var uid = user.Id
    // Create a reference to this user's specific status node.
    // This is where we will store data about being online/offline.
    var userStatusDatabaseRef = firebase.database().ref('/status/' + uid);

    // We'll create two constants which we will write to
    // the Realtime database when this device is offline
    // or online.
    var isOfflineForDatabase = {
        state: 'offline',
        name: user.Name,
        id: user.Id,
        last_changed: firebase.database.ServerValue.TIMESTAMP,
    };

    var isOnlineForDatabase = {
        state: 'online',
        name: user.Name,
        id: user.Id,
        last_changed: firebase.database.ServerValue.TIMESTAMP,
    };

    userStatusDatabaseRef.set(isOnlineForDatabase);

    //Listen to users logging in and out
    listenToUsersConnection();
    //listenToUsersLogout();
    setInterval(() => { readParticipants(); }, 10000);

    // Create a reference to the special '.info/connected' path in
    // Realtime Database. This path returns `true` when connected
    // and `false` when disconnected.
    firebase.database().ref('.info/connected').on('value', function (snapshot) {
        // If we're not currently connected, don't do anything.
        if (snapshot.val() == false) {
            return;
        };
        console.log(snapshot);
        // If we are currently connected, then use the 'onDisconnect()'
        // method to add a set which will only trigger once this
        // client has disconnected by closing the app,
        // losing internet, or any other means.
        userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(function () {
            // The promise returned from .onDisconnect().set() will
            // resolve as soon as the server acknowledges the onDisconnect()
            // request, NOT once we've actually disconnected:
            // https://firebase.google.com/docs/reference/js/firebase.database.OnDisconnect

            // We can now safely set ourselves as 'online' knowing that the
            // server will mark us as offline once we lose connection.
            userStatusDatabaseRef.set(isOnlineForDatabase);
            console.log("checkpoint: on disconnect");
            console.log(usersOnline);
        });
    });
    console.log(uref)
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
})





// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ FIREBASE METHODS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//Update FireBase whenever user's logging in
function listenToUsersConnection() {
    uref.on("child_added", snapshot => {
        let par = {
            userStatus: snapshot.val().state,
            userName: snapshot.val().name,
            userId: snapshot.val().id
        }
        console.log(par);
        if (par.userStatus == 'online') {
            usersOnline.push(par);
            printUsersOnline(par);
        }
    })
}

//Update FireBase whenever user's logging out
function listenToUsersLogout() {
    uref.on("child_removed", snapshot => {
        usersOnline = usersOnline.filter(m => m.userId != snapshot.val().userId);
        // re-render the messages
        updateUsersOnline(usersOnline);
    })
}

//print to screen the users online list
function printUsersOnline(par) {
    console.log("checkpoint: user is online");
    //if (par.userStatus == 'online')
    ph_status.innerHTML += "<li>" + par.userName + " - online </li>";

}

//Update the users online on the screen if a user's logging out
function updateUsersOnline(usersOnline) {
    var str = "<ul class='list-group'>";
    for (let i = 0; i < usersOnline.length; i++) {
        const uOnline = usersOnline[i];
        str += "<li>" + uOnline.userName + " - online </li>";
    }
    str += "</ul>";

    ph_status.innerHTML = str;
}

function readParticipants() {
    console.log("read users online");
    parArr = [];
    uref.once("value", snapshot => {
        snapshot.forEach(element => {
            par = {
                userStatus: element.val().state,
                userName: element.val().name,
                userId: element.val().id
            }
            if (par.userStatus == 'online')
                parArr.push(par);
        });
        updateUsersOnline(parArr);
    })
}
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ /FIREBASE METHODS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
