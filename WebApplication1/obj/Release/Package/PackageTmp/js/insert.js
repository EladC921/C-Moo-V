
seasons = [];
$(document).ready(function () {
    if (localStorage.user != null) { //if user already logged in, details saved -> auto-login
        user = JSON.parse(localStorage.user);
        console.log(user);
        $("#welcome").html("Hello " + user.Name + " " + user.Sername);

        if (user.Mail == 'admin@control.tmdb') //if admin -> add go to admin page on navigation bar
            $("#nav-items-title").append('<li class="nav-item mx-0 mx-lg-1" id="admin"><a class="nav-link py-3 px-0 px-lg-3 rounded pointer" href="adminView.html">Admin Page</a></li>');
    }
    else window.location.href = "homePage.html";

    //logout -> clear localStorage and return to homepage
    $("#logout").click(function () {
        localStorage.clear();
        window.location.href = "homePage.html";
    });


    //render tv shows (of website, without searching)
    renRecom();
    renAirToday();
    renDis();

    $("#getTV").click(getTV); //search button

    //key from tmdb
    key = "fe72ae4f33f6eb8a2b98a62fb320f4ec";
    api_key = "api_key=" + key;

    url = "https://api.themoviedb.org/";
    imagePath = "https://image.tmdb.org/t/p/w500/";

    $("#view").click(function () { //go to 'view.html'
        window.location.href = "view.html";
    })
});


//Global error method
function error(err) {
    console.log(err);
}

//Global get print str of rendering
function getPrint(obj) {
    console.log("To Print:")
    console.log(obj);
    let str = "<section class='page-section mb-0'><div class='container'><div class='row card_row rounded d-flex flex-row flex-nowrap overflow-auto shadow'>";
    for (var i = 0; i < obj.length; i++) {
        str += "<div class='card card-block mx-2' style='width:18rem; background-color:rgba(255, 255, 255, 0.8);'>";
        str += "<div class='movie-image' id=" + obj[i].id + " style='overflow: hidden;'>";
        if (obj[i].poster_path == null) str += "<img src='https://photos-alleuro.s3.us-east-2.amazonaws.com/No-Photo.jpg' class='card-img-top item w-100' alt='' /> ";
        else str += "<img src='" + imagePath + obj[i].poster_path + "' onclick='randSeasons(" + obj[i].id + ")' class='card-img-top img-hover w-100' alt='' /> "; //make a clickable img of the TV Show, if there's no photo then put a generic one
        str += "<h4 class='card-title text-center'>" + obj[i].name + "</h4>";
        str += "</div></div>";
    }
    str += '</div></div></section>';
    return str;
}

//ajax call to render on air today
function renAirToday() {
    let api = "https://api.themoviedb.org/3/tv/airing_today?api_key=fe72ae4f33f6eb8a2b98a62fb320f4ec&language=en-US&page=1";
    ajaxCall("GET", api, "", getAirCB, error);
}

//ajax call to render recommendations
function renRecom() {
    api = "../api/Series?uId=" + user.Id + "&type='recom'";
    ajaxCall("GET", api, "", getRecomCB, error);
}

//render the "recommendations" tv shows
function getRecomCB(obj) {
    console.log("checkpoint: recommended:");
    console.log(obj);
    let str = "";
    if (obj.length == 0) str = "<p class='info-in'>There are no recommendations yet, Try adding more episodes to your list.</p>";
    else str = getPrintRec(obj);
    $("#ph0").html(str);
}

//print Recommended objects --> different field names (Name ? name)
function getPrintRec(obj) {
    console.log("To Print:")
    console.log(obj);
    let str = "<section class='page-section mb-0'><div class='container'> <div class='row card_row rounded d-flex flex-row flex-nowrap overflow-auto shadow'>";
    for (var i = 0; i < obj.length; i++) {
        str += "<div class='card card-block mx-2' style='width:18rem; background-color:rgba(255, 255, 255, 0.8);'>";
        str += "<div class='movie-image' id=" + obj[i].Id + " style='overflow: hidden;'>";
        if (obj[i].Poster_path == null) str += "<img src='https://photos-alleuro.s3.us-east-2.amazonaws.com/No-Photo.jpg' class='card-img-top item w-100' alt='' /> ";
        else str += "<img src='" + imagePath + obj[i].Poster_path + "' onclick='randSeasons(" + obj[i].Id + ")' class='card-img-top img-hover w-100' alt='' /> "; //make a clickable img of the TV Show, if there's no photo then put a generic one
        str += "<h4 class='card-title text-center'>" + obj[i].Name + "</h4>";
        str += "</div></div>";
    }
    str += '</div></div></section>';
    return str;
}


//render the "air today" tv shows
function getAirCB(obj) {
    //~~~~~~~~~~~~~~~~~~~~~~~~~ ON AIR TODAY ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    let str = getPrint(obj.results);
    $("#ph").html(str);
    //~~~~~~~~~~~~~~~~~~~~~~~~~ /ON AIR TODAY ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
}

//render the "top rated" tv shows
function renDis() {
    let api = "https://api.themoviedb.org/3/tv/top_rated?api_key=fe72ae4f33f6eb8a2b98a62fb320f4ec&language=en-US&page=1";
    ajaxCall("GET", api, "", getDisCB, error);
}

//render the TOP RATED tv shows
function getDisCB(obj) {
    //~~~~~~~~~~~~~~~~~~~~~~~~~ /TOP RATED ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    let str = getPrint(obj.results);
    $("#ph1").html(str);
    //~~~~~~~~~~~~~~~~~~~~~~~~~ /TOP RATED ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
}

//Global error method
function error(err) {
    console.log(err);
}

//Search TV Show
function getTV() {
    let name = $("#tvShowName").val();
    let method = "3/search/tv?";
    let moreParams = "&language=en-US&page=1&include_adult=false&";
    let query = "query=" + encodeURIComponent(name);

    let apiCall = url + method + api_key + moreParams + query;
    ajaxCall("GET", apiCall, "", getTVSuccessCB, error);
}

// TV Search Success
function getTVSuccessCB(tv) {
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ TV SEARCH RESAULTS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    $("#ph-search").html('');
    let str = getPrint(tv.results)
    console.log("Results:")
    console.log(tv.results)
    $("#ph-search").html(str);
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ /TV SEARCH RESAULTS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
}

//put the ID of the show in local storage to use in 'seriesses.html'
function randSeasons(id) {
    let ser = {
        Id: id
    }
    localStorage.ser = JSON.stringify(ser);
    window.location.href = "serieses.html";
}