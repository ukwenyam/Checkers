<script>
    import { gameSettings } from '../Scripts/Init.js';

    let time = $gameSettings.time;
    let color = $gameSettings.color;


</script>

<h5>Game Preferences</h5>

<h6>Check Color:</h6>

<div class="form-check form-check-inline">
  <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="RED">
  <label class="form-check-label" for="inlineRadio1">RED</label>
</div>

<div class="form-check form-check-inline">
  <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="BLACK">
  <label class="form-check-label" for="inlineRadio2">BLACK</label>
</div>

<h6>Time Per Turn: {time} seconds</h6>
<input class="custom-range" bind:value="{time}" type="range" min="15" max="60" step="1">

<button class="btn btn-primary">Create</button>

<style>
    h5 {
        text-align: center;
        margin-top:20px;
    }

    h6 {
        margin-top:20px;
    }

    button {
        border-radius:0.4rem;
        width:50%;
        margin-left:25%;
        margin-top:80px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }
</style>