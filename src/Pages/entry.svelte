<script>
    import { currSocket, currUser, page } from '../Scripts/Init.js';
    import { invokeFunction } from '../Scripts/Cloud.js'
    import io from 'socket.io-client';
    
   

    let Email, Name, Password, confirmPassword;

    let logEmail, logPassword;

    let request;

    let logPage = true;

    let socket;

    function signUp() {

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
                }
            }).catch((err) => {
                console.log(err);
            });
        }
    }

    function createUser() {

        invokeFunction(request).then((response) => {
            console.log(response);
            if(response.msg == "SUCCESS") {
                request.func = "retrieveUser";
                retrieveUser();
            } else {
                console.log(response.err);
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    function signIn() {

        console.log("Signing in user");

        if(logEmail != null && logPassword != null) {

            request = {
                func : "signIn",
                email : logEmail,
                password : logPassword
            }
 
            invokeFunction(request).then((response) => {
                if(response.msg == "SUCCESS") {
                    request.func = "retrieveUser";
                    retrieveUser();
                } else {
                    console.log(response.err);
                }
            }).catch((err) => {
                console.log(err);
            });
        }
    }

    function retrieveUser() {

        invokeFunction(request).then((response) => {
            //console.log(response);
            if(response.msg != null) {
                let data = response.msg;

                data.email = logEmail != null ? logEmail : Email;

                currUser.update(state => {
                    state.setProfile(data);
                    return state;
                });
               
               let socket;
                
                currSocket.update(state => {
                    // console.log(state);
                    socket = state;
                    return state;
               });

               socket.emit('set-username', data.name);
               
                // confirmPassword.log("user connected!");               
                
                Email = '', Name = '', Password = '', confirmPassword = '';
                logEmail = '', logPassword = '';

            } else {
                console.log(response.err);
            }
        }).catch((err) => {
            console.log(err);
        });
    }
</script>

<div id="entry" class="container">
    <h3>Welcome To Checkers.io</h3>
    {#if logPage}
        <input id="logEmail" bind:value="{logEmail}" placeholder="Email"/>
        <input id="logPassword" bind:value="{logPassword}" placeholder="Password"/>
        <button class="btn btn-success" on:click="{signIn}">Log In</button>

        <h5>Don't have an Account? <span on:click="{() => (logPage = !logPage)}">Sign Up</span></h5>
        <hr/>
    {:else}
        <input id="Name" bind:value="{Name}" placeholder="Display Name"/>
        <input id="Email" bind:value="{Email}" placeholder="Email"/>
        <input id="Password" bind:value="{Password}" placeholder="Password"/>
        <input id="confirmPassword" bind:value="{confirmPassword}" placeholder="Confirm Password"/>
        <button class="btn btn-success" on:click="{signUp}">Sign Up</button>

        <h5>Already have an Account? <span on:click="{() => (logPage = !logPage)}">Sign In</span></h5>
    {/if}
</div>
<img id="back-image" alt="checker" src="./images/checkers.jpg"/>

<style>
    #entry {
        width:30%;
        height:500px;
        margin-left:35%;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        border-radius:0.4rem;
        margin-top: 100px;
        z-index:99;
        position:fixed;
        background:white;
        overflow-y: auto;
    }

    #back-image {
        width:100%;
        height:100%;
    }

    input {
        width:100%;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        margin-top:30px;
        border-radius:0.4rem;
        outline:none;
    }

    button {
        width:100%;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        margin-top:30px;
        border-radius:0.4rem;
    }

    h5 {
        text-align:center;
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
        }

        img {
            display:none;
        }
    }
</style>