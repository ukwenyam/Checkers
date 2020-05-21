<script>
    import { currUser } from '../Scripts/Init.js';

    let Name = $currUser.name;
    let oldPassword, newPassword;
    let imageLabel = 'Choose Profile Photo (<1MB)';



</script>

<h3>Settings</h3>

<h5>Profile</h5>

<h6>Account ID: <span>{$currUser.email}</span></h6>

<div id="propic" class="custom-file input-group">
    <input type="file" accept="image/jpeg" class="custom-file-input" id="customFile">
    <label class="custom-file-label" for="customFile">{imageLabel}</label>
</div>

<div class="input-group mb-2">
    <div class="input-group-prepend">
        <div class="input-group-text">Display Name:</div>
    </div>
    <input type="text" class="form-control" id="inlineFormInputGroup" placeholder="{Name}" bind:value="{Name}">
</div>

<button class="btn btn-success">Update Profile</button>

<h5 style="margin-top:60px;">Reset Password</h5>

<div class="input-group mb-2">
    <div class="input-group-prepend">
        <div class="input-group-text">Old Password:</div>
    </div>
    <input type="text" class="form-control" id="inlineFormInputGroup" placeholder="Old Password" bind:value="{oldPassword}">
</div>

<div class="input-group mb-2">
    <div class="input-group-prepend">
        <div class="input-group-text">New Password:</div>
    </div>
    <input type="text" class="form-control" id="inlineFormInputGroup" placeholder="New Password" bind:value="{newPassword}">
</div>

<button class="btn btn-success">Reset</button>

<style>
    h3 {
        margin-top:20px;
        text-align: center;
        opacity: 1;
    }

    #propic {
        margin-bottom: 10px;
        opacity: 1;
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
</style>