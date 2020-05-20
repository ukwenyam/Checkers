<script>
    import { currUser } from '../Scripts/Init.js';


</script>

<div id="backpurple">

    <h1>Dashboard</h1>

    <div class="circles">
        Create Game
    </div>

    <div class="circles">
        Join Game
    </div>

    <div class="circles">
        View Games
    </div>

    <div class="circles">
        Leadership Board 
    </div>

    <div class="circles">
        Tutorial 
    </div>

    <div class="circles">
        Settings
    </div>
</div>

<style>
    h1 {
        text-align: center;
        top:50px;
        left:42.5%;
        position:fixed;
    }

    #backpurple {
        background-color: purple;
        width: 100%;
        height: 100%; 
    }

    .circles {
        border-radius: 50%;
        width:200px;
        height:200px;
        float:left;
        margin-left:14%;
        margin-top:10%;
        background-color: white;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        line-height: 200px;
        text-align: center;
        font-size: 25px;
        cursor: pointer;
    }

    @media screen and (max-width: 800px) {

        h1 {
            text-align: center;
            top:25px;
            left:25%;
            position:fixed;
        }

		.circles {
            width:30%;
            height:15%;
            font-size: 22.5px;
            line-height: 50px;
            border-radius: 0.4rem;
            margin-top:30%;
        }
    }
</style>