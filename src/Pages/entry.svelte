<script>
    import { currUser, page, showLogin, gameTab, peer, currSocket } from '../Scripts/Init.js';
    import { invokeFunction } from '../Scripts/Cloud.js';
    import { User } from '../Scripts/User.js';
    import Loader from '../Components/loader.svelte';
    import { getUserGames, getLeagueTable, getAllChats } from '../Scripts/Functions.js';
    import env from '../env.json';

    let Email, Name, Password, confirmPassword;

    let logEmail, logPassword;

    let request;

    let logPage = true, loading = false, viewError = false;

    let errMsg;

    let screenWidth = screen.width;

    function signUp() {

        if(Email != null && Name != null && Password != null && confirmPassword != null && Password == confirmPassword) {

            loading = true;

            request = {
                func : "signUp",
                email : Email,
                name : Name,
                password : Password
            }

            console.log("Sending sign up request");

            invokeFunction(request).then((response) => {
                console.log(response);
                if(response.msg == "SUCCESS") {
                    request.func = "createUser";
                    createUser();
                    loading = false;
                    showLogin.set(false);
                } else if(response.msg == "EXIST") {
                    errMsg = "Display Name Already Exist";
                    viewError = true;
                    loading = false;
                } else {
                    errMsg = response.err;
                    viewError = true;
                    loading = false;
                }
            }).catch((err) => {
                errMsg = err;
                viewError = true;
                loading = false;
            });
        } else {
            errMsg = "All Fields Are Required";
            viewError = true;
            loading = false;
        }
    }

    function checkPasswordMatch() {

        if(Password != null && confirmPassword.length >= Password.length && confirmPassword != Password) {
            errMsg = "Passwords Do Not Match!";
            viewError = true;
        } else {
            viewError = false;
        }
    }

    function createUser() {

        invokeFunction(request).then((response) => {
            console.log(response);
            if(response.msg == "SUCCESS") {
                errMsg = "Please Check Your Email For Verification";
                viewError = true;
            } else {
                errMsg = response.err;
                viewError = true;
                loading = false;
            }
        }).catch((err) => {
            errMsg = err;
            viewError = true;
            loading = false;
        });
    }

    function signIn() {

        if(logEmail != null && logPassword != null) {

            loading = true;

            request = {
                func : "signIn",
                email : logEmail,
                password : logPassword
            }

            invokeFunction(request).then((response) => {
                if(response.msg != null && response.msg) {
                    request.func = "retrieveUser";
                    retrieveUser(); 
                } else if(response.msg != null && !response.msg) {
                    errMsg = "Please Verify Your Email";
                    viewError = true;
                    loading = false;
                } else {
                    console.log(response.err);
                    errMsg = response.err;
                    viewError = true;
                    loading = false;
                }
            }).catch((err) => {
                errMsg = err;
                console.log(err);
                viewError = true;
                loading = false;
            });
        } else {
            errMsg = "All Fields Are Required";
            viewError = true;
            loading = false;
        }
    }

    function checkNotifications() {
        if(Notification.permission == "default" || Notification.permission == "denied") 
            Notification.requestPermission();
    }

    function retrieveUser() {

        invokeFunction(request).then((response) => {
            //console.log(response);
            if(response.msg != null) {
                let data = response.msg;

                data.email = logEmail;

                currUser.set(new User(data));

                checkNotifications();
                getAllChats(); 
                getUserGames(); 
                getLeagueTable();

                Email = '', Name = '', Password = '', confirmPassword = '';
                logEmail = '', logPassword = '';

                $currSocket.emit('go-online', logEmail);
                
                loading = false;
                showLogin.set(false);

                let index = document.getElementById("index");
                index.setAttribute("style", "top:0;");

                let enter = document.getElementById("enter");
                enter.setAttribute("style", "top:-100%;");
            } else {
                errMsg = response.err;
                console.log(response.err);
                viewError = true;
                loading = false;
            }
        }).catch((err) => {
            console.log(err);
            errMsg = err;
            viewError = true;
            loading = false;
        });
    }

    function forgotPassword() {

        if(logEmail != null || logEmail != '') {

            request = {
                func: "forgotPassword",
                email: logEmail
            }

            invokeFunction(request).then((response) => {
                if(response.msg == "SUCCESS") {
                    errMsg = "Please Check Your Email For Password Reset";
                    viewError = true;
                    loading = false;
                } else {
                    errMsg = response.err;
                    viewError = true;
                    loading = false;
                }
            }).catch((err) => {
                errMsg = err;
                viewError = true;
                loading = false;
            });
        } else {
            errMsg = "Please Fill All Required Fields!";
            viewError = true;
            loading = false;
        }
    }
</script>

<div id="entry" class="container">
    <img src="images/LOGO-192.png" alt="Logo" style="height:80px;"/>
    <h3>Checkas.io</h3>
    {#if viewError}
        <h6 style="text-align:center;color:red;margin-top:20px;">{errMsg}</h6>
    {/if}

    {#if logPage == true}
        <div id="login-div">
            <input id="logEmail" type="text" bind:value="{logEmail}" placeholder="Email" required autocomplete="off"/><br/>
            <input id="logPassword" type="password" bind:value="{logPassword}" placeholder="Password" on:keydown="{event => event.which === 13 && signIn()}" required autocomplete="off"/><br/>
            <br/><a id="forgotPassword" on:click="{() => (logPage = null)}">Forgot Password?</a>
            {#if !loading}
                <h5><button class="btn btn-success" on:click="{signIn}" type="submit">Log In</button></h5>
            {:else}
                <Loader/>
            {/if}
        </div>
        <hr style="border: 1px solid green"/>
        <div class="no-cred-sign-signup" id="no-Acct-signup">
            <h5>Don't have an Account? <br/><button class="login-signup" id="signupBtn" on:click="{() => (logPage = !logPage)}">Sign Up</button></h5>
        </div>
    {:else if logPage == false}
        <div id="signup-div">
            <input id="Name" type="text" bind:value="{Name}" placeholder="Display Name" required autocomplete="off"/>
            <input id="Email" type="text" bind:value="{Email}" placeholder="Email" required autocomplete="off"/>
            <input id="Password" type="password" bind:value="{Password}" placeholder="Password" required/>
            <input id="confirmPassword" type="password" bind:value="{confirmPassword}" on:keyup="{checkPasswordMatch}" placeholder="Confirm Password" on:keydown="{event => event.which === 13 && signUp()}" required/>
            {#if !loading}
                <br/><button class="btn btn-success" on:click="{signUp}" type="submit">Sign Up</button>
            {:else}
                <Loader/>
            {/if}
        </div>
        <hr style="border: 1px solid green"/>
        <div class="no-cred-sign-signup">
            <h5>Already have an Account? <br/><button class="login-signup" on:click="{() => (logPage = !logPage) }">Sign In</button></h5>
        </div>
    {:else if logPage == null}
        <div id="signup-div">
            <input id="Email" type="text" bind:value="{logEmail}" placeholder="Email" required autocomplete="off"/>
            {#if !loading}
                <br/><button class="btn btn-success" style="margin-bottom:30px;" on:click="{forgotPassword}" type="submit">Reset Password</button>
            {:else}
                <Loader/>
            {/if}
            <br/><a id="forgotPassword" on:click="{() => (logPage = true)}">Back To Login</a>
        </div>
    {/if}
</div>

<style>
    #entry label {
        color: #212529;
        display: inline-block;
        display: block;
        color: red;
    }

    span.arrow {
        color: white;
        display: block;
    }

    #login-div #login-form{
        width: 100%;
        height: 100%;
        text-align: center;
    }

    .no-cred-sign-signup {
        width: 100%;
        height: 100%;
        text-align: center;
    }

    #entry {
        width:500px;
        height:800px;
        padding: 40px;
        position:absolute;
        top: calc((100% - 800px) / 2);;
        left: calc((100% - 500px) / 2);
        background: #343a40;
        text-align: center;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        border-radius:0.4rem;
        z-index:99;
        overflow-y: auto;
    }

    ::-webkit-scrollbar {
        width:0px;
    }

    #entry h3{
        color: white;
        text-transform: uppercase;
        font-weight: 500;
    }

    #entry h5 {
        color: white;
        margin-top: 30px;
    }

    #back-image {
        width:100%;
        height:100%;
        position: fixed;
        left:0;
        top:0;
    }

    #entry input[type = "text"], #entry input[type = "password"] {
        /* box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); */
        margin-top:30px;
        /* border-radius: 0.4rem; */
        outline: none;
        border: 0;
        background: none;
        /* display: block; */
        margin: 20px, auto;
        text-align: center;
        border-bottom: 2px solid white;
        padding: 14px 10px;
        width: 70%;
        color: white;
        transition: .25s;
    }

    #forgotPassword {
        color: white;
        /* margin: 30px; */
        /* outline: none; */
        border: 0;
       
        /* background: none; */
        /* display: block; */
        margin: 20px, auto;
        text-align: center;
        padding: 14px 10px;
        width: 200px;
        color: #b88830;
        margin-top: 50px;
    }

    #forgotPassword:hover{
        color:green;
    }


    #entry input[type = "text"]:focus, #entry input[type = "password"]:focus{
        width: 100%;
        border-color: #2ecc71;
        background: black;
    }

    #entry button[type = "submit"]{
        outline: none;
        border: 0;
        background: green;
        /* display: block; */
        margin: 20px, auto;
        text-align: center;
        /* border: 2px solid #2ecc71; */
        padding: 14px 40px;
        color: white;
        transition: .25s;
        cursor: pointer;
    } 

    .login-signup {
        outline: none;
        border: 0;
        background: #b88830;
        /* display: block; */
        margin: 20px, auto;
        text-align: center;
        /* border: 2px solid #d4a82e; */
        padding: 14px 40px;
        color: white;
        transition: .25s;
        cursor: pointer;
    }

    button.login-signup:hover{
        background: #d4a82e;
    }

    #entry button[type = "submit"]:hover {
        background: #2ecc71;
    }

    button {
        /* width:100%; */
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        margin-top:30px;
        /* border-radius:0.4rem; */
    }

    h3 {
        text-align:center;
        margin-top:30px; 
    }

    span {
        color:blue;
        cursor: pointer;
    }

    @media screen and (max-width: 800px) {

		#entry {
            width:100%;
            height:100%;
            top:0;
            left:0;
            z-index:89;
            box-shadow: none;
            overflow-y: scroll;
            border-radius:0px;
            padding:10px;
        }

        #entry input[type = "text"], #entry input[type = "password"] {
            width: 90%;
        }

    }
</style>