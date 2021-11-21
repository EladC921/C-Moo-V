$(document).ready(function () {
    $("#logout").click(function () {
        localStorage.clear();
        window.location.href = "homePage.html";
    })
    userTbl = "";
    epTbl = "";
    loadUserTable();
    loadEpTable();
    loadSerTable();
    //key from tmdb
    key = "fe72ae4f33f6eb8a2b98a62fb320f4ec";
    api_key = "api_key=" + key;

    url = "https://api.themoviedb.org/";
    imagePath = "https://image.tmdb.org/t/p/w500/";

    $("#view").click(function () {
        window.location.href = "insert.html";
    })
});

//AJAX to load users table
function loadUserTable() {
    let api = "../api/Users";
    ajaxCall("GET", api, "", getUserSuccessCB, error);
}

//AJAX to load episodes table
function loadEpTable() {
    let api = "../api/Preferences?type=Episodes";
    ajaxCall("GET", api, "", getEpSuccessCB, error);
}

//AJAX to load seriess table
function loadSerTable() {
    let api = "../api/Preferences?type=Series";
    ajaxCall("GET", api, "", getSerSuccessCB, error);
}

//Global Error function
function error(err) {
    console.log(err);
}

//Get Users List Success
function getUserSuccessCB(userList) {
    console.log(userList);

    try {
        userTbl = $('#usersTable').DataTable({
            data: userList,
            pageLength: 5,
            columns: [

                { data: "Id" },
                { data: "Name" },
                { data: "Sername" },
                { data: "Mail" },
                { data: "Phone" },
                { data: "Gender" },
                { data: "BirthYear" },
                { data: "FavGenre" },
                { data: "Address" },
            ],
        });
    }
    catch (err) {
        alert(err);
    }
}

//Get Episode List Success
function getEpSuccessCB(epList) {
    console.log(epList);
    try {
        epTbl = $('#epTable').DataTable({
            data: epList,
            pageLength: 5,
            columns: [
                { data: "SerName" },
                { data: "EpName" },
                { data: "NumOfUsers" },
            ],
        });
    }
    catch (err) {
        alert(err);
    }
}

//Get Series List Success
function getSerSuccessCB(serList) {
    console.log(serList);
    try {
        serTbl = $('#serTable').DataTable({
            data: serList,
            pageLength: 5,
            columns: [
                { data: "SerName" },
                { data: "NumOfUsers" },
            ],
        });
    }
    catch (err) {
        alert(err);
    }
}
