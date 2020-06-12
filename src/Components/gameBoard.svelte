<script>
	import Peer from './peerPlay.svelte';
	import Single from './singlePlay.svelte';
	import { gamePref, currSocket, currUser } from '../Scripts/Init.js';

	if($currUser != null && currUser.isAuth)
		$currSocket.emit('go-online', $currUser.email);
</script>

{#if $gamePref != null}
	<Peer/>
{:else}
	<Single/>
{/if}