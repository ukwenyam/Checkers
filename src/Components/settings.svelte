<script>
    import { currUser, currSocket, gameTab, ratio, gameLevel } from '../Scripts/Init.js';
    import { invokeFunction } from '../Scripts/Cloud.js';
    import Loader from './loader.svelte';

    let Name = $currUser.profile.name;
    let Picture = $currUser.profile.picture;
    let authPassword;
    let oldPassword, newPassword;
    let imageLabel = 'Choose Profile Photo';

    let myColor = $currUser.gamePreferences.myColor, otherColor = $currUser.gamePreferences.otherColor;
    let compTime = $currUser.gamePreferences.compTime;
    let myOrient = $currUser.gamePreferences.orient;
    let difficulty = $gameLevel;

    let request;
    let loading = false;

    function upload() {
        if(e.target.files[0].size <= 1000000 && e.target.files[0].type == 'image/jpeg') {

            var reader = new FileReader();

            reader.onload = function (e) {
                Picture = e.target.result;

                currUser.update(state => {
                    state.picture = e.target.result;
                    return state;
                });
            }

            reader.readAsDataURL(e.target.files[0]);
            imageLabel = e.target.files[0].name;
        }
    }

    function updateProfile() {

        if(Name != null && authPassword != null) {

            loading = true;

            request = {
                func: "updateProfile",
                name: Name,
                picture: Picture.includes('adorable') ? null : Picture,
                password: authPassword,
                email: $currUser.profile.email
            }

            invokeFunction(request).then((response) => {

                if(response.msg != null && response.msg == "SUCCESS") {
                    console.log(response.msg);

                    authPassword = '';

                    currUser.update(state => {
                        state.profile.name = Name;
                        return state;
                    });

                    loading = false;
                } else {
                    loading = false;
                    console.log(response.err)
                }
                   
            }).catch((error) => {
                loading = false;
                console.log(error);
            });
        }
    }

    function resetPassword() {

        if(oldPassword != null && newPassword != null && oldPassword != newPassword) {

            loading = true;

            request = {
                func: "resetPassword",
                email: $currUser.profile.email,
                password: oldPassword,
                newPass: newPassword
            }

            invokeFunction(request).then((response) => {
                if(response.msg != null) {
                    console.log(response.msg);
                    loading = false;
                    oldPassword = '', newPassword = '';
                } else {
                    loading = false;
                    console.log(response.err);
                }
            }).catch((error) => {
                loading = false;
                console.log(error);
            });
        }
    }

    function updateGamePref() {

        if(myColor != otherColor) {

            loading = true;

            request = {
                func: "updateGamePref",
                orient: myOrient,
                compTime: compTime,
                myColor: myColor,
                otherColor: otherColor
            }

            invokeFunction(request).then((response) => {
                if(response.msg != null && response.msg == "SUCCESS") {
                    console.log(response.msg);
                    loading = false;
                    currUser.update(state => {
                        state.gamePreferences.myColor = myColor;
                        state.gamePreferences.otherColor = otherColor;
                        state.gamePreferences.compTime = compTime;
                        state.gamePreferences.orient = myOrient;
                        return state;
                    });

                    gameLevel.set(difficulty);
                } else {
                    loading = false;
                    console.log(response.err);
                }
            }).catch((error) => {
                loading = false;
                console.log(error);
            });
        } else {

            console.log("Same Color");
        }
    }

    function signOut() {
        $currSocket.emit('go-offline', $currUser.profile.email);
        currUser.set(null);
        gameTab.set(0);
    }

    function viewGamePref() {
        let profile = document.getElementById("leftSet");
        let game = document.getElementById("rightSet");

        profile.setAttribute("style", "left:-100%");
        game.setAttribute("style", "left:0");
    }

    function viewProfile() {
        let profile = document.getElementById("leftSet");
        let game = document.getElementById("rightSet");

        game.setAttribute("style", "left:100%");
        profile.setAttribute("style", "left:0");
    }
</script>

{#if $ratio > 1}
    <h3>Settings</h3>
{/if}

<div id="leftSet" class="container-fluid">
    {#if $ratio < 1}
        <button class="btn btn-dark" style="float:right;margin-top:12.5px;" on:click="{viewGamePref}">Game Prefernces <i class="fa fa-arrow-right"></i></button>
    {/if}

    <h5 style="text-align:center">Profile</h5>

    <h6 style="text-align:center;">Account ID: <span>{$currUser.profile.email}</span></h6>

    <img alt="propic" src="{Picture}"/>

    <div id="propic" class="custom-file input-group">
        <input type="file" accept="image/jpeg" class="custom-file-input" id="customFile" on:change="{upload}">
        <label class="custom-file-label" for="customFile">{imageLabel}</label>
    </div>

    <p style="text-align:center">Image size should be less than 1MB</p>

    <input type="text" id="inlineFormInputGroup" placeholder="Display Name" bind:value="{Name}">

    <input id="authPass" type="password" placeholder="Account Password" bind:value="{authPassword}"/>

    {#if !loading}
        <button class="btn btn-success middle" on:click="{updateProfile}">Update Profile</button>
    {:else}
        <Loader/>
    {/if}

    <h5 style="margin-top:60px;text-align:center">Reset Password</h5>

    <input type="password" placeholder="Account Password" bind:value="{oldPassword}">

    <input type="password" placeholder="New Password" bind:value="{newPassword}">

    {#if !loading}
        <button class="btn btn-success middle" on:click="{resetPassword}">Reset</button>
    {:else}
        <Loader/>
    {/if}

    {#if $ratio < 1}
        <button class="btn btn-danger middle" on:click="{signOut}">Logout ({$currUser.profile.name}) <i class="fa fa-sign-out"></i></button>
    {/if}
</div>

<div id="rightSet" class="container-fluid">
    {#if $ratio < 1}
        <button class="btn btn-dark" style="float:left;margin-top:12.5px;" on:click="{viewProfile}"><i class="fa fa-arrow-left"></i> Profile</button>
    {/if}

    <h5 style="text-align:center;margin-bottom:20px;">Game Preferences</h5>

    <h6>My Checker Color:
        <input type="color" bind:value="{myColor}"/>
    </h6>

    <h6 style="margin-top:20px;">Other Player's Checker Color: 
        <input type="color" bind:value="{otherColor}" />
    </h6>

    <h6 style="width:100%;text-align:center;margin-top:20px;">{compTime} seconds</h6>
    <input class="custom-range" bind:value="{compTime}" type="range" min="15" max="60" step="1">

    <hr/>

    <h6 style="width:100%;">Default Board Orientation:
        <div class="form-check form-check-inline">
            <input on:change="{() => (myOrient = 2)}" class="form-check-input" type="radio" name="inlineRadio" id="inlineRadio4">
            <label class="form-check-label" for="inlineRadio2">2D</label>
        </div>

        <div class="form-check form-check-inline">
            <input on:change="{() => (myOrient = 3)}" class="form-check-input" type="radio" name="inlineRadio" id="inlineRadio5">
            <label class="form-check-label" for="inlineRadio3">3D</label>
        </div>
    </h6>

    <hr/>

    <h6 style="width:100%;">Difficulty Level versus Computer:
        {#if $ratio < 1}
            <br/><br/>
        {/if}
        <div class="form-check form-check-inline oda-check">
            <input on:change="{() => (difficulty = 0)}" class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio6">
            <label class="form-check-label" for="inlineRadio1">Easy</label>
        </div>

        <div class="form-check form-check-inline oda-check">
            <input on:change="{() => (difficulty = 1)}" class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio7">
            <label class="form-check-label" for="inlineRadio2">Medium</label>
        </div>

        <div class="form-check form-check-inline oda-check">
            <input on:change="{() => (difficulty = 2)}" class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio8">
            <label class="form-check-label" for="inlineRadio3">Hard</label>
        </div>

        <div class="form-check form-check-inline oda-check">
            <input on:change="{() => (difficulty = 3)}" class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio9">
            <label class="form-check-label" for="inlineRadio3">World Class</label>
        </div>
    </h6>

    <hr/>

    {#if !loading}
        <button id="saveBtn" class="btn btn-primary middle" on:click="{updateGamePref}">Save Preferences</button>
    {:else}
        <Loader/>
    {/if}
</div>

<style>
    #leftSet {
        width:33.33%;
        float:left;
        color:white;
        flex: 1 1 auto;
        overflow-y: auto;
    }

    hr {
        background:white;
        margin-top:20px;
        margin-bottom:20px;
        width:100%;
    }

    #rightSet {
        width:66.66%;
        float:right;
        color:white;
        border-left: 1px solid white;
        flex: 1 1 auto;
        overflow-y: auto;
        height:100%;
    }

    #saveBtn {
        width:50%;
        margin-left:25%;
        margin-top:20px;
    }

    .form-check {
        margin-left:5%;
    }

    .oda-check {
        margin-left:10px;
    }

    img {
        width:100px;
        height:100px;
        border-radius:0.4rem;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        margin-bottom:10px;
        margin-left: calc((100% - 100px) / 2);
    }

    h3 {
        margin-top:10px;
        text-align: center;
        color:white;
    }

    #propic {
        width:100%;
    }

    #leftSet input {
        color: white;
        background: black;
        outline:none;
        border:none;
        margin-bottom:10px;
        width:100%;
        border-radius:0.4rem;
    }

    #propic {
        opacity: 1;
        border-radius:0.4rem;
    }

    .middle {
        margin-top:10px;
        opacity: 1;
        width:50%;
        margin-left:25%;
    }

    #authPass {
        width:100%;
        border-radius:0.4rem;
    }

    @media screen and (max-width: 800px) {

        #leftSet {
            width:100%;
            float:unset;
            border-right: none;
            position:fixed;
            top:0;
            left:0;
            transition: ease-in-out 1s;
        }

        #leftSet h5 {
            text-align:left;
            width:100%;
            margin-top:16%;
        }

        #rightSet h5 {
            text-align:right;
            width:100%;
            margin-top:16%;
        }

        #rightSet {
            width:100%;
            float:unset;
            border-left:none;
            position:fixed;
            top:0;
            left:100%;
            transition: ease-in-out 1s;
        }

        .btn-danger {
            width: 50%;
            margin-left:25%;
            margin-top:20px;
            margin-bottom:100px;
        }

    }
</style>