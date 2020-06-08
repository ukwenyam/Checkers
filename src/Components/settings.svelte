<script>
    import { currUser } from '../Scripts/Init.js';
    import { invokeFunction } from '../Scripts/Cloud.js';
    import Loader from './loader.svelte';

    let Name = $currUser.name;
    let Picture = $currUser.picture;
    let authPassword;
    let oldPassword, newPassword;
    let imageLabel = 'Choose Profile Photo';

    let screenWidth = screen.width;

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
                picture: Picture.includes('unsplash') ? null : Picture,
                password: authPassword,
                email: $currUser.email
            }

            invokeFunction(request).then((response) => {

                if(response.msg != null) {
                    console.log(response.msg);

                    authPassword = '';

                    currUser.update(state => {
                        state.name = Name;
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
                email: $currUser.email,
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
</script>

<h3>Settings</h3>

<div id="leftSet" class="container-fluid">
    <h5 style="text-align:center">Profile</h5>

    <h6 style="text-align:center;">Account ID: <span>{$currUser.email}</span></h6>

    <img alt="propic" src="{Picture}"/>

    <div id="propic" class="custom-file input-group">
        <input type="file" accept="image/jpeg" class="custom-file-input" id="customFile" on:change="{upload}">
        <label class="custom-file-label" for="customFile">{imageLabel}</label>
    </div>

    <p style="text-align:center">Image size should be less than 1MB</p>

    <input type="text" id="inlineFormInputGroup" placeholder="Display Name" bind:value="{Name}">

    <input id="authPass" type="password" placeholder="Account Password" bind:value="{authPassword}"/>

    {#if !loading}
        <button class="btn btn-success" on:click="{updateProfile}">Update Profile</button>
    {:else}
        <Loader/>
    {/if}

    <h5 style="margin-top:60px;text-align:center">Reset Password</h5>

    <input type="password" placeholder="Account Password" bind:value="{oldPassword}">

    <input type="password" placeholder="New Password" bind:value="{newPassword}">

    {#if !loading}
        <button class="btn btn-success" on:click="{resetPassword}">Reset</button>
    {:else}
        <Loader/>
    {/if}

    {#if screenWidth <= 800}
        <button class="btn btn-danger">Logout ({$currUser.name}) <i class="fa fa-sign-out"></i></button>
    {/if}
</div>

<div id="rightSet" class="container-fluid">

</div>

<style>
    #leftSet {
        width:33.33%;
        float:left;
        color:white;
        border-right: 1px solid white;
        flex: 1 1 auto;
        overflow-y: auto;
    }

    #rightSet {
        width:66.66%;
        float:right;
        color:white;
        border-left: 1px solid white;
        flex: 1 1 auto;
        overflow-y: auto;
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

    input {
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

    button {
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
        }

        #rightSet {
            width:100%;
            float:unset;
            border-left:none;
        }

        .btn-danger {
            width: 50%;
            margin-left:25%;
            margin-top:20px;
            margin-bottom:100px;
        }
    }
</style>