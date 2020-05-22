 <script>
    import { currSocket, currUser, page } from '../Scripts/Init.js';
    import io from 'socket.io-client';

    let room = "initRoom";
    let myMsg = "";
    
    let socket;

    currSocket.update(state => {
      console.log('about to send chat');
      console.log(state);
      socket = state;
      return state;
    });

    window.$('#userInfoSpan').val(room);

    socket.emit('join-room', room);

    window.$(function () {
    window.$('form').submit(function(e){
      e.preventDefault(); // prevents page reloading

      console.log('sending message');
      socket.emit('chat message', window.$('#m').val(), room);

      myMsg = window.$('#m').val();
      window.$('#m').val('');
      return false;
    });

    let className = window.$('#messages').attr('class');

      socket.on('chat message', function(msg){
            console.log("Received message: "+msg);
            if(myMsg == msg){
              window.$('#messages').append(window.$('<li>').attr('id', 'messagelim').attr('class', className).text(msg));
            }
            else{
              window.$('#messages').append(window.$('<li>').attr('id', 'messageli').attr('class', className).text(msg));
            }
     });
  });

// function joinRoom(){
//       console.log("joingin a room");
      
// }

 </script>

 <div id="chat" >
    <div id='window-outline'>
        <div id='topBar'>
            <div id="userInfo">
                <h3 id='userInfoSpan'>{room}</h3>
            </div>
        </div>
        <div id='message-box'>
        <div id='leftBar'></div>
        <div id='rightBar'></div>
        <ul id="messages"><li id='messageli'></li><li id='messagelim'></li></ul>
        </div>
            <form id='form'>
              <input id="m" autocomplete="off" /><button>Send</button>
            </form>
    </div>
   
    
 </div>

 <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      form { background: #000; padding: 3px; position: fixed; bottom: 0; width: 100%; }
      form input { border: 0; padding: 10px; width: 90%; margin-right: 0.5%; }
      form button { width: 9%; background: rgb(130, 224, 255); border: none; padding: 10px; }
      #messages { list-style-type: none;  }
      #messageli { margin-bottom: 10px; margin-left: 10px; }
      #messagelim { margin-bottom: 10px; margin-left: 10px;  background: rgb(212, 205, 205); text-align: right}
      /* #messageli:nth-child(even) { background: rgb(212, 205, 205); float: right; } */
      #userInfo {width: 80%; height: 100px;  margin-right: 10%; background: rgb(91, 82, 218)}
      #userInfoSpan {width: 100%; height: 80%;}
      #window-outline {height: 100%; background: rgb(255, 255, 255)}
      #chat { width: 100%; height: 100%; border-width: 30px; border-color: brown; font: 13px Helvetica, Arial; }
      #leftBar { width: 20px; height: 100%; float: left; background: rgb(49, 86, 104) }
      #rightBar { width: 20px; height: 100%; float: right; background: rgb(49, 86, 104) }
      #topBar { height: 100px; background: rgb(70, 145, 231)  }
      #message-box {height: 80%; width: 100%;}
    </style>