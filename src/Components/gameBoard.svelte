<script>
	import Peer from './peerPlay.svelte';
	import Single from './singlePlay.svelte';
	import { gamePref } from '../Scripts/Init.js';

	setInterval(function() {
		gamePref.set($gamePref);
	}, 1000);
</script>

{#if $gamePref != null}
	<Peer/>
{:else if $gamePref == null}
	<Single/>
{/if}