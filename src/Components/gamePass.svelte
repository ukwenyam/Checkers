<script>
    import { invokeFunction } from '../Scripts/Cloud.js';

    let gamePassword;
    
</script>

<h5>Game Password</h5>

<input bind:value="{gamePassword}" placeholder="Game Password"/>

<button class="btn btn-primary">Join</button>

<style>
    h5 {
        text-align: center;
        margin-top:20px;
    }

    input {
        border-radius:0.4rem;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        width:100%;
        margin-top:20px;
    }

    button {
        width:50%;
        margin-left:25%;
        margin-top:80px;
        border-radius:0.4rem;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }
</style>