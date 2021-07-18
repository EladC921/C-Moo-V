
$(document).ready(function () {
    if (localStorage.user != null) { //if user already logged in, details saved -> auto-login
        user = JSON.parse(localStorage.user);
        console.log(user);
        //document.getElementById("welcome").innerHTML = "Hello " + user.Name + " " + user.Sername;
        $("#welcome").html("Hello " + user.Name + " " + user.Sername);
        if (user.Mail == 'admin@control.tmdb')
            $("#nav-items-title").append('<li class="nav-item mx-0 mx-lg-1" id="admin"><a class="nav-link py-3 px-0 px-lg-3 rounded pointer" href="adminView.html">Admin Page</a></li>');
        getSer();
    }
    else window.location.href = "homePage.html";

    //logout -> clear localStorage and return to homepage
    $("#logout").click(function () {
        localStorage.clear();
        window.location.href = "homePage.html";
    })

    //loadUsersOnline();



    //key from tmdb
    key = "fe72ae4f33f6eb8a2b98a62fb320f4ec";
    api_key = "api_key=" + key;

    url = "https://api.themoviedb.org/";
    imagePath = "https://image.tmdb.org/t/p/w500/";

    //https://api.themoviedb.org/3/tv/1416/season/0/episode/64467?api_key=1c107f2bd2f3fc2aee24aa4f2f8d8647&language=en-US

    $("#view").click(function () {
        window.location.href = "insert.html";
    })
});

function error(err) {
    console.log(err);
}

function getSer() {
    let api = "../api/Series?uId=" + user.Id + "&type=pref";
    ajaxCall("GET", api, "", getSerSuccessCB, getSerErrorCB)
}

//get episodes - SUCCESS
function getSerSuccessCB(seriesList) {
    let scroll = "";
    for (var i = 0; i < seriesList.length; i++) {
        scroll += "<option value='" + seriesList[i].Id + "'>" + seriesList[i].Name + "</option>";
    }
    $("#ser").append(scroll);
}

function getSerErrorCB(err) {
    console.log(err);
}
//get episodes - ERROR
function getEpisodesErrorCB(err) {
    console.log(err);
}

//Ajax call to Episodes by user id preferences
function renderEpsBySer(option) {
    console.log(option);
    opt = option; //make it global
    let api = "../api/Episodes?uId=" + user.Id + "&sId=" + opt;
    ajaxCall("GET", api, "", getEpisodesBySerSuccessCB, error)
}

//Get episodes of series Success
function getEpisodesBySerSuccessCB(eps) {
    console.log(eps)
    let str = "<section class='page-section mb-0'><div class='container'><div class='row card_row rounded d-flex flex-row flex-nowrap overflow-auto shadow'>";
    for (var i = 0; i < eps.length; i++) {
        id = eps[i].Id;
        str += "<div class='card card-block mx-2' style='width:18rem; background-color:rgba(255, 255, 255, 0.8);'>";
        str += "<div class='movie-image' id=" + id + " style='overflow: hidden;'>";
        if (eps[i].Img == "https://image.tmdb.org/t/p/w500/null")
            str += "<image src='https://photos-alleuro.s3.us-east-2.amazonaws.com/No-Photo.jpg'" + ">"
        else
            str += "<image class='card-img-top img-hover' src=" + eps[i].Img + ">";
        str += "<h3 class='card-title text-center'>" + eps[i].SerName + "</h3>";
        str += "<h5 class='card-title text-center'>" + "Season " + eps[i].SeasonNum + "</h5>";
        str += "<h5 class='card-text text-center'>" + eps[i].EpName + "</h5>";

        str += "<div class='card-body'><button class='bg-but text-white btn btn-xl btn-outline-secondary' onclick='removeEp(" + id + ")'>Remove</button>"; //insert episode button
        str += "</div></div></div>";
    }

    $("#ph").html(str);
}

//CB error
function error(err) {
    console.log(err);
}

//Remove episode from list
function removeEp(eId) {
    console.log(eId);
    let api = "../api/Episodes?uId=" + user.Id + "&eId=" + eId;
    ajaxCall("DELETE", api, "", deleteEpSuccessCB, error)
}

//Delete success
function deleteEpSuccessCB() {
    renderEpsBySer(opt); //re-rendering eps
}