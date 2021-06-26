seasons = [];
$(document).ready(function () {
    if (localStorage.user != null) { //if user already logged in, details saved -> auto-login
        user = JSON.parse(localStorage.user);
        console.log(user);
        //document.getElementById("welcome").innerHTML = "Hello " + user.Name + " " + user.Sername;
        $("#welcome").html("Hello " + user.Name + " " + user.Sername);
        Tv = JSON.parse(localStorage.ser);
        if (user.Mail == 'admin@control.tmdb')
            $("#nav-items-title").append('<li class="nav-item mx-0 mx-lg-1" id="admin"><a class="nav-link py-3 px-0 px-lg-3 rounded pointer" href="adminView.html">Admin Page</a></li>');
    }
    else window.location.href = "homePage.html";

    randSeasons(Tv.Id);
    init();
    //logout -> clear localStorage and return to homepage
    $("#logout").click(function () {
        localStorage.clear();
        window.location.href = "homePage.html";
    })

    rendFans(Tv.Id);

    //key from tmdb
    key = "fe72ae4f33f6eb8a2b98a62fb320f4ec";
    api_key = "api_key=" + key;

    url = "https://api.themoviedb.org/";
    imagePath = "https://image.tmdb.org/t/p/w500/";

    //https://api.themoviedb.org/3/tv/1416/season/0/episode/64467?api_key=1c107f2bd2f3fc2aee24aa4f2f8d8647&language=en-US

    $("#view").click(function () {
        window.location.href = "view.html";
    })
    $("#search").click(function () {
        window.location.href = "insert.html";
    })
});

//Global error method
function error(err) {
    console.log(err);
}

//Rand the seasons of the TV Show
function randSeasons(id) {
    //Creation of series object

    let apiTv = "https://api.themoviedb.org/3/tv/" + id + "?api_key=fe72ae4f33f6eb8a2b98a62fb320f4ec&language=en-US";
    ajaxCall("GET", apiTv, "", getSpecificTvSuccessCB, error);

}

//get specific tv show SUCCESS
function getSpecificTvSuccessCB(tv) {
    tv_show = tv; //make it global

    $("#ph-present").html('');
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ TV CARD SHOW ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //MAKE A TV_SHOW CARD
    let str = '<div id="#series-card"><div class="movie_card" id="bright"><div class="info_section"><div class="movie_header">' +
        '<img class="locandina" src="' + imagePath + tv_show.poster_path + '" />' +
        '<h1>' + tv_show.name + '</h1><h4>' + tv_show.first_air_date + '</h4>' +
        '<span class="minutes">' + tv_show.status + '</span><p class="type">' + tv_show.original_language + '</p></div >';
    str += ' <div class="movie_desc"><p class="text text-left">' + tv_show.overview + '</p></div>'
    str += '</div><div class="blur_back" style="background:url("' + imagePath + tv_show.poster_path + '")"></div></div>';
    $("#ph-present").html(str);
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ TV CARD SHOW ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    console.log("checkpoint: tv show")
    console.log(tv_show);
    number_of_seasons = tv_show.number_of_seasons;

    //POST series object
    let apiSeries = "../api/Series";
    ajaxCall("POST", apiSeries, JSON.stringify(Tv), postSeriesSuccessCB, error);
}

//Rand the Episodes of the season
function randEps(i) {
    apiSeason = "https://api.themoviedb.org/3/tv/" + tv_show.id + "/season/" + i + "?api_key=fe72ae4f33f6eb8a2b98a62fb320f4ec&language=en-US";
    ajaxCall("GET", apiSeason, "", getEpsSuccessCB, error);
}

//Get the season success - generate episodes
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ EPISODES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function getEpsSuccessCB(_season) {
    console.log("checkpoint: season");
    console.log(_season);
    season = _season
    number_of_eps = season.episodes.length;
    let str = '<div id="#series-card"><div class="movie_card" id="bright"><div class="info_section"><div class="movie_header">' +
        '<img class="locandina" src="' + imagePath + _season.poster_path + '" />' +
        '<h1>' + _season.name + '</h1><h4>' + _season.air_date + '</h4>' + '</div >';
    str += ' <div class="movie_desc"><p class="text">' + _season.overview + '</p></div>'
    str += '</div><div class="blur_back" style="background:url("' + imagePath + _season.poster_path + '")"></div></div>';
    $("#ph-present1").html(str);

    $("#ph-eps").html('');

    let str1 = "<section class='page-section mb-0'><div class='container'><div class='row card_row rounded d-flex flex-row flex-nowrap overflow-auto shadow'>";
    for (var i = 0; i < number_of_eps; i++) {
        id = season.episodes[i].id;
        str1 += "<div class='card card-block mx-2' style='width: 19rem; background-color: rgba(255, 255, 255, 0.8);'>";
        str1 += "<div class='movie-image' id=" + id + " style='overflow: hidden;'>";

        if (season.episodes[i].still_path == null) str1 += "<img src='https://photos-alleuro.s3.us-east-2.amazonaws.com/No-Photo.jpg' class='card-img-top item' alt='' /> ";//if there's no photo then put a generic one
        else str1 += "<img src='" + imagePath + season.episodes[i].still_path + "' onclick='rendChat(" + i + ")'" + " class='card-img-top img-hover'  alt=''/> ";


        str1 += "<h4 class='card-title text-center'>" + season.episodes[i].episode_number + ". " + season.episodes[i].name + "</h4>"; //episode name
        str1 += "<div class='card-body'>";
        str1 += "<button class='bg-but text-white btn btn-xl btn-outline-secondary' value=" + i + " onclick='insert(this.value)'>Add to My List!</button>"; //insert episode button
        str1 += "</div></div></div>";
    }
    str1 += '</div></div></section>';
    $("#ph-eps").html(str1);
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ EPISODES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//Specific episode card with chat option
function rendChat(index) {
    let str = '<div id="#series-card"><div class="movie_card" id="bright"><div class="info_section"><div class="movie_header">' +
        '<img class="locandina" src="' + imagePath + season.episodes[index].still_path + '" />' +
        '<h1>' + season.episodes[index].name + '</h1>' + '</span><p class="type">' + season.episodes[index].overview + '</p></div >';
    str += "<button class='bg-but text-white btn btn-xl btn-outline-secondary' value=" + index + " onclick='insert(this.value)'>Chat!</button>";
    str += ' <div class="movie_desc"><p class="text text-left">' + '</p></div>'
    str += '</div><div class="blur_back" style="background:url("' + imagePath + season.episodes[index].still_path + '")"></div></div>';

    $("#ph-spd").html(str);
}

//Insert button handler
function insert(index) {
    i = index // make it global

    //Creation of episode object
    ep = {
        Id: season.episodes[i].id,
        Id_user: user.Id, //For preference table
        EpName: season.episodes[i].name,
        Id_ser: tv_show.id,
        SerName: tv_show.name,
        SeasonNum: season.season_number,
        Img: imagePath + season.episodes[i].still_path,
        Description: season.episodes[i].overview + "\nAir Date: " + season.episodes[i].air_date
    }

    console.log("checkpoint: Episode Object to Insert");
    console.log(ep);

    let apiEps = "../api/Episodes";
    ajaxCall("POST", apiEps, JSON.stringify(ep), postEpsSuccessCB, error);
}

//Post series Success
function postSeriesSuccessCB() {
    console.log("Breakpoint: SERIES POST SUCCESS")
    //using POST through ajax call to add the object to the episode list

    //Put the actors
    apiCredits = "https://api.themoviedb.org/3/tv/" + tv_show.id + "/credits?api_key=fe72ae4f33f6eb8a2b98a62fb320f4ec&language=en-US";
    ajaxCall("GET", apiCredits, "", getCreditsSuccessCB, error);

    console.log("checkpoint");
}


//Post Episode Success
function postEpsSuccessCB(msg) {
    if (msg == -1)
        console.log("episode already exists in sql table therefore wasn't added once again")
    alert("Episode inserted");
}

//GET Credits and cast Success
function getCreditsSuccessCB(credits) {
    console.log("checkpoint: credits")
    console.log(credits);
    let gender = "";
    actors = [];

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ ACTORS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    let str = "<section class='page-section mb-0'><div class='container'><div class='row card_row rounded d-flex flex-row flex-nowrap overflow-auto shadow'>";
    for (var i = 0; i < credits.cast.length; i++) {
        str += "<div class='card card-block mx-2' style='width: 20rem; background-color:rgba(255, 255, 255, 0.8);'>";
        str += "<div class='movie-image' id=" + credits.cast[i].id + " style='overflow: hidden;'>";
        if (credits.cast[i].profile_path == null) str += "<img src='https://photos-alleuro.s3.us-east-2.amazonaws.com/No-Photo.jpg' class='card-img-top item' alt=''/> ";
        else str += "<img src='" + imagePath + credits.cast[i].profile_path + "' class='card-img-top img-hover' alt=''/> "; //make a clickable img of the Season, if there's no photo then put a generic one
        str += "<h4 class='card-title text-center'>" + credits.cast[i].name + "</h4>"; //episode name
        str += "<h5 class='text-center'>" + credits.cast[i].character + "</h5>"; //character name
        str += "</div></div>";

        //Gender is 1 or 2 or null then changing it accordingly
        if (credits.cast[i].gender == 1) gender = 'F';
        else if (credits.cast[i].gender == 2) gender = 'M';
        else gender = 'U';
        //Create a list of actors in a tv show to put in the DB
        actors[i] = {
            Id: credits.cast[i].id,
            Ser_id: tv_show.id,
            Name: credits.cast[i].name,
            Gender: gender,
            Profile_path: credits.cast[i].profile_path
        }
    }
    str += '</div></div></section>';
    $("#ph-actors").append(str);


    apiAc = "../api/Actors";
    ajaxCall("POST", apiAc, JSON.stringify(actors), postActorsSuccessCB, error);
}

//Post actors Success
function postActorsSuccessCB() {
    console.log("actors has been inserted to DB");
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ ACTORS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    $("#ph-seasons").html('');
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ SEASONS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //rand to page
    let str = "<section class='page-section mb-0'><div class='container'><div class='row card_row rounded d-flex flex-row flex-nowrap overflow-auto shadow'>";
    for (var i = 0; i < number_of_seasons; i++) {
        id = tv_show.seasons[i].id;
        str += "<div class='card card-block mx-2' style='width: 20rem; background-color:rgba(255, 255, 255, 0.8);'>";
        str += "<div class='movie-image' id=" + id + " style='overflow: hidden;'>";
        if (tv_show.seasons[i].poster_path == null) str += "<img src='https://photos-alleuro.s3.us-east-2.amazonaws.com/No-Photo.jpg' onclick='randEps(" + tv_show.seasons[i].season_number + ")' class='card-img-top item' alt=''/> ";
        else str += "<img src='" + imagePath + tv_show.seasons[i].poster_path + "' onclick='randEps(" + tv_show.seasons[i].season_number + ")' class='card-img-top img-hover' alt=''/> "; //make a clickable img of the Season, if there's no photo then put a generic one
        str += "<h4 class='card-title text-center'>" + tv_show.seasons[i].season_number + ". " + tv_show.seasons[i].name + "</h4>"; //episode name
        str += "</div></div>";
    }
    str += '</div></div></section>';
    $("#ph-seasons").html(str);
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ SEASONS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
}

//rendering the fans of the series
function rendFans() {
    let apiFans = "../api/Users/fans/" + Tv.Id;
    ajaxCall("GET", apiFans, "", getFansSuccessCB, error);
}

//Get fans Success
function getFansSuccessCB(uL) {
    str = "<ul><b>FANS<b>";
    for (var i = 0; i < uL.length; i++) {
        str += "<li>" + uL[i].Name + " " + uL[i].Sername + "</li>";
    }
    str += "</ul>";
    $("#ph-fans").html(str);
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ FIRE BASE WORKAROUND ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//Initating the firebase and listeners
function init() {
    msgArr = [];
    console.log(Tv.Name);
    tvNameRegex = Tv.Name.replace(/[^a-zA-Z ]/g, "");
    console.log("check -" + tvNameRegex);
    ref = firebase.database().ref(tvNameRegex);
    refer = firebase.database().ref('/' + tvNameRegex + ' /' + 'comment');
    repl = firebase.database().ref('/' + tvNameRegex + ' /' + 'reply');
    lke = firebase.database().ref('/' + tvNameRegex + ' /' + 'like');
    dlke = firebase.database().ref('/' + tvNameRegex + ' /' + 'dislike');
    // listen to incoming messages
    listenToNewMessages();
    // listen to new comments
    listenToNewComments();
    // listen to new replies
    listenToNewReplies();
    // listen to new likes
    listenToNewLikes();
    // listen to new disslikes
    listenToNewDissLikes();

}

//Listen for new likes added
function listenToNewLikes() {
    // child_changed will be evoked for every child that was changed
    // on the first entry, it will bring all the childs
    refer.on("child_changed", snapshot => {
        cmnt = {
            name: snapshot.val().name,
            content: snapshot.val().comment,
            id: snapshot.val().id,
            likes: snapshot.val().likes,
            disslikes: snapshot.val().disslikes
        }
        printLike(cmnt);
    })
}

//Listen for new disslikes added
function listenToNewDissLikes() {
    // child_changed will be evoked for every child that was changed
    // on the first entry, it will bring all the childs
    refer.on("child_changed", snapshot => {
        cmnt = {
            name: snapshot.val().name,
            content: snapshot.val().comment,
            id: snapshot.val().id,
            likes: snapshot.val().likes,
            disslikes: snapshot.val().disslikes
        }
        console.log(cmnt.disslikes);
        printDissLike(cmnt);
    })
}

//Listen for new chat messages
function listenToNewMessages() {
    // child_added will be evoked for every child that was added
    // on the first entry, it will bring all the childs
    ref.on("child_added", snapshot => {
        msg = {
            name: snapshot.val().name,
            content: snapshot.val().msg,
        }
        printMessage(msg);
    })
}

//Listen for new posts
function listenToNewComments() {
    // child_added will be evoked for every child that was added
    // on the first entry, it will bring all the childs
    refer.on("child_added", snapshot => {
        cmnt = {
            name: snapshot.val().name,
            content: snapshot.val().comment,
            id: snapshot.val().id,
            likes: snapshot.val().likes,
            disslikes: snapshot.val().disslikes
        }
        printComment(cmnt);
    })
}

//Listening to new replies for posts
function listenToNewReplies() {
    // child_added will be evoked for every child that was added
    // on the first entry, it will bring all the childs
    repl.on("child_added", snapshot => {
        replay = {
            name: snapshot.val().name,
            reply: snapshot.val().reply,
            id: snapshot.val().id
        }
        console.log("=============");
        console.log(replay.id);
        printReply(replay);
    })
}

//Printing the updated disslike
function printDissLike(cmnt) {
    $("#disslikenum").html(cmnt.disslikes);
}
//Printing the updated like
function printLike(cmnt) {
    $("#likenum").html(cmnt.likes);
}

//Printing the chat messages
function printMessage(msg) {
    let str = '<li class="right clearfix">' +
        '<span class="chat-img pull-right">' +
        '<img src="http://placehold.it/50/FA6F57/fff&text=' + msg.name + '" alt="User Avatar" class="img-circle" />' +
        '</span>' + ' <div class="chat-body clearfix">' + '<div class="header">' +
        ' <strong class="pull-right primary-font"></strong>' + ' </div>' +
        '<p id="messageCont">' + msg.content + '</p>' + '</div></li>';

    newChat.innerHTML += str;
}

//Prints the replies for posts

function printReply(replay) {

    let str = "";
    str += '  <div class="post-comment form-control">\n' +
        '                    <img src="https://cdn.discordapp.com/attachments/727187267788996640/854969393481646090/sacred-cow.png" alt="" class="profile-photo-sm">\n' +
        '                    <p><a class="profile-link">' + replay.name + " :" + '</a>' + replay.reply + ' </p>\n' +
        '                  </div>';

    $('#' + replay.id + ' #usercommentsinsert').append(str);
}

//Prints the posts
function printComment(cmnt) {
    console.log(cmnt.disslikes);
    id1 = "'" + cmnt.id + "'";
    let str = "";
    str = ' </div>\n' +
        '<div class="container">\n' +
        '<div class="row">\n' +
        '<div class="col-md-8">\n' +
        '<div class="post-content">\n' +
        '\n' +
        '<div class="post-container">\n' +
        '<img src="https://cdn.discordapp.com/attachments/727187267788996640/854969393481646090/sacred-cow.png" alt="user" class="profile-photo-md pull-left">\n' +
        '<div id="' + cmnt.id + '" class="post-detail">\n' +
        '<div class="user-info">\n' +
        '<h5 class="profile-link">' + cmnt.name + '</h5>\n' +
        '\n' +
        '</div>\n' +
        '<div id="react"  class="reaction">\n' +

        '<a id="liking" onclick="AddLike(' + cmnt.likes + ',' + id1 + ')" class="btn text-green"><i class="fa fa-thumbs-up"></i><div id="likenum" style="float:right ">' + cmnt.likes + '</div></a>\n' +
        '<a id="dissliking" onclick="AddDissLike(' + cmnt.disslikes + ',' + id1 + ')" class="btn text-red"><i class="fa fa-thumbs-down"></i><div id="disslikenum" style="float:right ">' + cmnt.disslikes + '</div></a>\n' +
        '</div>\n' +
        '<div class="line-divider"></div>\n' +
        '<div class="post-text">\n' +
        '<p>' + cmnt.content + '<i class="em em-anguished"></i> <i class="em em-anguished"></i> <i class="em em-anguished"></i></p>\n' +
        '</div>\n' +
        '<div class="line-divider"></div>\n' +
        '<div id="usercommentsinsert">\n' +

        '\n' +
        '</div>\n' +
        '<div class="post-comment">\n' +
        '<img src="https://cdn.discordapp.com/attachments/727187267788996640/854969393481646090/sacred-cow.png" alt="" class="profile-photo-sm">\n' +
        '<input type="text" id="pReply' + cmnt.id + '" class="form-control" placeholder="Post a comment">\n' +
        '<button class="btn btn-primary btn-xl enabled" id="submitButton" onClick="AddReply(' + id1 + ')" type="submit">Send</button>\n' +
        '</div>\n' +
        '</div>\n' +
        '</div>\n' +
        '</div>\n' +
        '</div>\n' +
        '</div>\n' +
        '</div>\n' +
        '';
    $("#ph-sss").append(str);

}

//Pushes the posts and initiating the data to firebase
function AddPost() {
    var myRef = refer.push();
    keyto = myRef.getKey();
    var one = 0;
    var newData = {
        id: keyto,
        comment: document.getElementById("pComment").value,
        name: user.Name,
        likes: one,
        disslikes: one,
    }
    refer.child(keyto).update(newData);

}

//Pushes the chats and initiating the data to firebase
function AddMSG() {
    let apiCheck = "../api/Series/checkPref/" + user.Id + "/" + Tv.Id;
    ajaxCall("GET", apiCheck, "", getUprefSerSuccessCB, error);
}

//Get series of user Success
function getUprefSerSuccessCB(tmp) {
    if (tmp == 1) {
        let msg = document.getElementById("message").value;
        document.getElementById("message").value = "";
        let name = user.Name;
        console.log(name);
        console.log(msg);
        ref.push().set({ "msg": msg, "name": name });
    }
    else {
        alert("You must add at least 1 episode to your list to be a fan!");
        $("#message").val("");
    }
}

//Pushes the replies and initiating the data to firebase
function AddReply(id) {
    console.log(id);
    let msg = document.getElementById("pReply" + id).value;
    let name = user.Name;
    repl.push().set({ "reply": msg, "name": name, "id": id });
}
//Updates the likes with +1 after user clicked and initiating the data to firebase
function AddLike(likes, id) {
    console.log(id);

    refer.child(id).update({ "likes": likes + 1 });

}
//Updates the disslikes with +1 after user clicked and initiating the data to firebase
function AddDissLike(disslikes, id) {
    console.log(id);

    refer.child(id).update({ "disslikes": disslikes + 1 });

}
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ /FIRE BASE WORKAROUND END ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

