<script>
    import { currUser } from '../Scripts/Init.js';
    import { invokeFunction } from '../Scripts/Cloud.js';

    let Name = $currUser.name;
    let Picture = $currUser.picture;
    let authPassword;
    let oldPassword, newPassword;
    let imageLabel = 'Choose Profile Photo';

    let request;

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
                } else {
                    console.log(response.err)
                }
                   
            }).catch((error) => {
                console.log(error);
            });
        }
    }

    function resetPassword() {

        if(oldPassword != null && newPassword != null && oldPassword != newPassword) {

            request = {
                func: "resetPassword",
                email: $currUser.email,
                password: oldPassword,
                newPass: newPassword
            }

            invokeFunction(request).then((response) => {
                if(response.msg != null) {
                    console.log(response.msg);

                    oldPassword = '', newPassword = '';
                } else {
                    console.log(response.err);
                }
            }).catch((error) => {
                console.log(error);
            });
        }
    }
</script>

<h3>Settings</h3>

<h5>Profile</h5>

<h6 style="text-align:center;">Account ID: <span>{$currUser.email}</span></h6>

<img style="float:left" alt="propic" src="{Picture}"/>

<div id="propic" class="custom-file input-group">
    <input type="file" accept="image/jpeg" class="custom-file-input" id="customFile" on:change="{upload}">
    <label class="custom-file-label" for="customFile">{imageLabel}</label>
</div>

<p style="float:right">Image size should be less than 1MB</p>

<div class="input-group mb-2">
    <div class="input-group-prepend">
        <div class="input-group-text">Display Name:</div>
    </div>
    <input type="text" class="form-control" id="inlineFormInputGroup" placeholder="{Name}" bind:value="{Name}">
</div>

<input id="authPass" type="password" placeholder="Account Password" bind:value="{authPassword}"/>

<button class="btn btn-success" on:click="{updateProfile}">Update Profile</button>

<h5 style="margin-top:60px;">Reset Password</h5>

<div class="input-group mb-2">
    <div class="input-group-prepend">
        <div class="input-group-text">Old Password:</div>
    </div>
    <input type="password" class="form-control" id="inlineFormInputGroup" placeholder="Account Password" bind:value="{oldPassword}">
</div>

<div class="input-group mb-2">
    <div class="input-group-prepend">
        <div class="input-group-text">New Password:</div>
    </div>
    <input type="password" class="form-control" id="inlineFormInputGroup" placeholder="New Password" bind:value="{newPassword}">
</div>

<button class="btn btn-success" on:click="{resetPassword}">Reset</button>

<style>
    img {
        width:100px;
        height:100px;
        border-radius:0.4rem;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        margin-bottom:10px;
    }

    h3 {
        margin-top:20px;
        text-align: center;
        opacity: 1;
    }

    #propic {
        opacity: 1;
        float:right;
        width:66%;
    }

    .mb-2, #propic {
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        opacity: 1;
        border-radius:0.4rem;
    }

    button {
        margin-top:10px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        opacity: 1;
        width:50%;
        margin-left:25%;
    }

    #authPass {
        width:100%;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        border-radius:0.4rem;
    }
</style>