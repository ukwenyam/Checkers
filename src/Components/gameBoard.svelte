<script>
	import Peer from './peerPlay.svelte';
	import Single from './singlePlay.svelte';
	import { gamePref } from '../Scripts/Init.js';
</script>

{#if $gamePref != null}
	<Peer/>
{:else}
	<Single/>
{/if}