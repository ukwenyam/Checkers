<script>
    import { currUser, page } from '../Scripts/Init.js';
    import { invokeFunction } from '../Scripts/Cloud.js';
    import { fly } from 'svelte/transition';
    import { User } from '../Scripts/User.js';

    let Email, Name, Password, confirmPassword;

    let logEmail, logPassword;

    let request;

    let logPage = true;

    let popUp = false;

    let popUpText;

    function signUp() {

        if( validateSignUp() ){
            console.log("In sign up");
            loading('signup-loader');

            if(Email != null && Name != null && Password != null && confirmPassword != null && Password == confirmPassword) {

                request = {
                    func : "signUp",
                    email : Email,
                    name : Name,
                    password : Password
                }

                invokeFunction(request).then((response) => {
                    console.log(response);
                    if(response.msg == "SUCCESS") {
                        request.func = "createUser";
                        createUser();
                    } else {
                        console.log(response.err);
                        pop(response.err);
                    }
                    stopLoading('signin-loader');
                }).catch((err) => {
                    console.log(err);
                    stopLoading('signup-loader');
                });
            }
        }
    }

    function createUser() {

        invokeFunction(request).then((response) => {
            console.log(response);
            if(response.msg == "SUCCESS") {
                console.log("Verify Email");
            } else {
                console.log(response.err);
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    function signIn() {
        if( validateSigin()){

            loading('sigin-loader');

            if(logEmail != null && logPassword != null) {

                request = {
                    func : "signIn",
                    email : logEmail,
                    password : logPassword
                }

                invokeFunction(request).then((response) => {
                    if(response.msg != null && response.msg) {
                        request.func = "retrieveUser";
                        
                        retrieveUser();
                        console.log($currUser);
                    } else if(response.msg != null && !response.msg) {
                        console.log("Unverified Email");
                        pop("unverified Email")
                    } else {
                        console.log(response.err);
                        pop(response.err);
                    }
                    stopLoading('signin-loader');
                }).catch((err) => {
                    console.log(err);
                });
            }
        }
    }

    function retrieveUser() {

        invokeFunction(request).then((response) => {
            //console.log(response);
            if(response.msg != null) {
                let data = response.msg;

                data.email = logEmail;

                currUser.set(new User(data));
                console.log(data);
                Email = '', Name = '', Password = '', confirmPassword = '';
                logEmail = '', logPassword = '';
            } else {
                console.log(response.err);
                pop("Incorrect email address and/or password");
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    function matchesPassword(){
        var para = document.getElementById('matchPassword');
         if( Password != confirmPassword ){
             console.log("passwords must match");
             para.style.display = "block";
         } 
         else{
             console.log("passwords match");
             para.style.display = "none";
         }
    }

    window.$(document).ready(function() {
        document.getElementById('signin-loader').addEventListener('load', stopLoading());
    });

    function validateSigin() {
        return validateSignInEmail() && validateSignInPassword();
    }

    function validateSignUp() {
        return validateSignUpName() && validateSignUpEmail() && validateSignUppassWord() && validateSignUpconPassword();
    }

    function validateSignInEmail() {
        return logEmail != null && logEmail != '';
    }

    function validateSignInPassword() {
        return logPassword != null && logPassword != '';
    }

    function validateSignUpName() {
        return Name != null && Name != '';
    }

    function validateSignUpEmail() {
        return Email != null && Email != '';
    }

    function validateSignUppassWord() {
        return Password != null && Password != '';
    }

    function validateSignUpconPassword() {
        return confirmPassword != null && confirmPassword != '' && confirmPassword == Password;
    }

    function loading(){
        window.$('.loader-container').attr('style', 'display: flex');
    }

    function stopLoading(){
         window.$('.loader-container').attr('style', 'display: none');
    }


    function pop(value){
       popUp = true;
       popUpText = value;
       if(typeof(value) != 'string'){
           popUpText = value.message;
       }
    }

    function closePop(){
       popUp = false;
    }

</script>
<div id="background" class="background">
<div id="entry" class="container">
    <h3>Checkas.io</h3>
    {#if popUp} 
        <div transition:fly="{{ y: 100, duration: 1000 }}" id="popUp-box">
        <p id="popUp-p" >{popUpText}</p>
            <a class="close" on:click="{closePop}">Close</a>
        </div>
    {/if}
    {#if logPage}
        <div id="login-div">
        <div id="signin-loader"  class="loader-container">
                <div class="loader"></div>
            </div>
            <form id="login-form" onsubmit="return false">
                <input name="logEmail" id="logEmail" type="text" bind:value="{logEmail}" placeholder="Email" required/><br/>
                <input name="logPassword" id="logPassword" type="password" bind:value="{logPassword}" placeholder="Password" required/><br/>
                <br/><a id="forgotPassword" href="" >Forgot Password?</a>
                <h5><button class="btn btn-success" on:click="{signIn}" type="submit">Log In</button></h5>
            </form>
        </div>
        <hr style="border: 1px solid green"/>
        <div class="no-cred-sign-signup"  id="no-Acct-signup">
        <h5>Don't have an Account? <br/><button class="login-signup" id="signupBtn" on:click="{() => (logPage = !logPage)}">Sign Up</button></h5>
        </div>
    {:else}
        <div id="signup-div">
            <div id="signup-loader" onload="{stopLoading()}" class="loader-container">
                <div class="loader"></div>
            </div>
            <form onsubmit="return false">
                <input name="Name" id="Name" type="text" bind:value="{Name}" placeholder="Display Name" required/>
                <input name="Email" id="Email" type="text" bind:value="{Email}" placeholder="Email" required/>
                <input name="Password" id="Password" type="password" bind:value="{Password}" placeholder="Password" required/>
                <input name="confirmPassword" id="confirmPassword" type="password" bind:value="{confirmPassword}" on:change="{matchesPassword}" placeholder="Confirm Password" required/><p id="matchPassword" >Passwords must match</p>
                <br/><button id="signup-btn" class="btn btn-success" on:click="{signUp}" type="submit" >Sign Up</button>
            </form>
        </div>
        <hr style="border: 1px solid green"/>
        <div class="no-cred-sign-signup">
            <h5>Already have an Account? <br/><button class="login-signup" on:click="{() => (logPage = !logPage)}">Sign In</button></h5>
        </div>
    {/if}
</div>
<img id="back-image" alt="checker" src="./images/checkers.jpg"/>
</div>
<style>

    #popUp-box {
        width: 90%;
        overflow: hidden;
        background: #615c5c;
        box-shadow: 0 0 20px black;
        border-radius: 8px;
        position: absolute;
        top: 10%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 9999;
        padding: 10px;
        text-align: center;
        display: block;
    }

    #matchPassword {
        display: none;
        color: red;
    }

    #popUp-box span {
        color: #2ecc71;
        font-size: 40px;
        display: block;
        margin: 20px 0l;
    }

    #popUp-box p {
         color: white;
    }

    .close {
         outline: none;
        border: 0;
        font-size: 10px;
        color: #3587f1;
        padding: 10px 20px;
        cursor: pointer;
        background: #3587f1;
        display: block;
        border-radius: 24px;
        border: 2px solid #3587f1;
       
    }


    .loader-container {
        width: 100%;
        align-items: center;
        justify-content: center;
        display: none;
    }

    .loader {
        width: 50px;
        height: 50px;
        border: 5px solid;
        color: #3498db;
        border-radius: 50%;
        border-top-color: transparent;
        animation: loader 1.2s linear infinite;
    }

    @keyframes loader{
        25%{
            color: #2ecc71;
        }
        50%{
            color: #f1c40f;
        }
        75%{
            color: #e74c3c;
        }
        to{
            transform: rotate(360deg);
        }
    }

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

    .background {
        margin: 0;
        padding: 0;  
        font-family: sans-serif;
        background: #34495e;
        width: 100%;
        height: 100%;
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
        width:40%;
        opacity: .95;
        max-width:500px;
        padding: 40px;
        position:absolute;
        top: 50px;
        left: 30%;
        background: #191919;
        text-align: center;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        border-radius: 0.4rem;
        z-index: 99;
        overflow-y: auto;
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
    }

    #entry input[type = "text"], #entry input[type = "password"] {
        margin-top:30px;
        outline: none;
        border: 0;
        background: none;
        margin: 20px, auto;
        text-align: center;
        border: 2px solid white;
        padding: 14px 10px;
        width: 50%;
        color: white;
        border-radius: 24px;
        transition: .25s;
    
    }

    #forgotPassword {
        border: 0;
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
    }

    #entry button[type = "submit"]{
        outline: none;
        border: 0;
        background: green;
        margin: 20px, auto;
        text-align: center;
        padding: 14px 40px;
        color: white;
        border-radius: 24px;
        transition: .25s;
        cursor: pointer;
    } 

    .login-signup {
        outline: none;
        border: 0;
        background: #b88830;
        margin: 20px, auto;
        text-align: center;
        padding: 14px 40px;
        color: white;
        border-radius: 24px;
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
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        margin-top:30px;
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
            margin-left:unset;
            margin-top: unset;
            z-index:99;
            position:fixed;
            box-shadow: none;
            overflow-y: scroll;
            right:1px;
            transform: translate(-30%, -6%);
        }
        


        /* img {
            display:none;
        } */
    }
</style>