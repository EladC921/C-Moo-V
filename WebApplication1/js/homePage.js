
        // Get the modal
        var modalRe = document.getElementById('register');
        var modalLo = document.getElementById('login');

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function (event) {
            if (event.target == modalRe) {
                modalRe.style.display = "none";
            }
            if (event.target == modalLo) {
                modalLo.style.display = "none";
            }
        }

        $(document).ready(function () {
            if (localStorage.user != null) { //if a user exists in localStorage upload insert screen
                user = JSON.parse(localStorage.user);
                if (user.Mail == "admin@control.tmdb") {
                    window.location.href = "adminView.html";
                }
                else
                    window.location.href = "insert.html";

            }

            $("#pForm").submit(mySubmit);
            $("#lForm").submit(myLogin);
        });


        //Submit registration details
        function mySubmit() {
            let name = $("#nameTB").val();
            let sername = $("#sernameTB").val();
            let mail = $("#mailTB").val();
            let pass = $("#passTB").val();
            let phone = $("#phoneTB").val();

            if ($("#male").prop('checked'))
                gender = 'M';
            else if ($("#female").prop('checked'))
                gender = 'F';
            else gender = 'O';

            let birthYear = $("#birthYearTB").val();
            let genre = $("#genreTB").val();
            if (genre == "-1") genre = null;
            let address = $("#addressTB").val();

            //Creation of user object
            user = {
                Name: name,
                Sername: sername,
                Mail: mail,
                Pass: pass,
                Phone: phone,
                Gender: gender,
                BirthYear: birthYear,
                FavGenre: genre,
                Address: address
            }

            console.log(user);



            //Using POST through ajax call to add the object to the episode list
            api = "../api/Users"; //global var

            ajaxCall("POST", api, JSON.stringify(user), postUSuccessCB, postUErrorCB);

            return false;
        }

        //Post user success
        function postUSuccessCB() {
            alert("Welcome to our website, " + user.Name + "!");
            window.location.href = "homePage.html";
        }

        //Post user error
        function postUErrorCB(err) {
            console.log(err);
            alert(err.responseJSON);
        }

        //Login button methodge
        function myLogin() {
            let mail = $("#mailLogTB").val();
            let pass = $("#passLogTB").val();
            api = "../api/Users?mail=" + mail + "&password=" + pass;
            ajaxCall("GET", api, "", getULoginSuccessCB, getULoginErrorCB);
            return false;
        }

        //Login success
        function getULoginSuccessCB(user) {
            console.log(user);
            delete user.Pass;
            localStorage.user = JSON.stringify(user);
            if (user.Mail == "admin@control.tmdb") {
                window.location.href = "adminView.html";
            }
            else
                window.location.href = "insert.html";
            //add user to localStorage
        }

        //incorrect details - login failure
        function getULoginErrorCB(err) {
            alert(err.responseJSON);
            $("#passLogTB").val("");
        }

        //Show password function --> toggle between types - password and text
        function showPass() {
            var x = document.getElementById("passTB");
            if (x.type === "password") {
                x.type = "text";
            } else {
                x.type = "password";
            }
        }