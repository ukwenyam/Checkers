<script>
    import { gameTab } from '../Scripts/Init.js';

    
    function switchTabs(tab) {
		gameTab.set(tab);
	}
</script>

<div id="sidebar-outer-mob">
    <table id="sidebar-inner-mob" cellpadding="10">
        <tr height="50">
            <td class="tabIndex" align="center" on:click="{() => switchTabs(0)}">
                <i class="fa fa-qrcode"></i>
                <span>Game</span>
            </td>
            <td class="tabIndex" align="center" on:click="{() => switchTabs(1)}">
                <i class="fa fa-comments"></i>
                <span>Chat</span>
            </td>
        </tr>
    </table>
</div>

<style>
    @media screen and (max-width: 800px) {
		#sidebar-outer-mob {
			width:100%;
			background-color:black;
			position: fixed;
			bottom:0;
			left:0;
			height:7.5%;
		}

		#sidebar-inner-mob {
			width:100%;
		}

        .fa-comments {
            font-size:27px;
			color:orange;
        }

        .fa-qrcode {
            font-size:29px;
            color:orange;
		}
		
		span {
			color: white;
			position:fixed;
			bottom:0;
			margin-right:20%;
		}
    }
</style>