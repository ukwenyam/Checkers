<script>
    import { fly, fade } from 'svelte/transition';
</script>

<div class="container-fluid" transition:fade></div>

<style>
    .container-fluid {
		left:0;
		top:0;
        width: 100%;
        height: 100%;
        z-index:50;
        position:fixed;
        box-shadow: 0 0 1rem 0 rgba(0, 0, 0, .2);   
        border-radius: 5px;
        background-color: rgba(255, 255, 255, .15);
        backdrop-filter: blur(5px);
	}
</style>