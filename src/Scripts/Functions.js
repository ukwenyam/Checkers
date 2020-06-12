import { invokeFunction } from './Cloud.js';
import { allChats, currUser, userGames, leaderBoard, showCallee, calleeName, calleeID,
            showCallBar, currSocket, peer, onCall, showPlayer } from './Init.js';

let request, userEmail, userName;

export function getAllChats() {

    currUser.update(state => {
        userEmail = state.email;
        return state;
    });

    request = {
        func: "retrieveUserChats",
        email: userEmail
    }

    invokeFunction(request).then((response) => {
        console.log(response);
        if(response.msg != null) {
            allChats.set(response.msg);
        } else {
            console.log(response.err);
            loading = false;
        }
    }).catch((error) => {
        console.log(error);
        loading = false;
    });
}

export function getLeagueTable() {

    currUser.update(state => {
        userName = state.name;
        return state;
    });

    request = {
        func: "checkersLeague",
        name: userName
    }

    invokeFunction(request).then((response) => {
        console.log(response);
        if(response.msg != null) {
            leaderBoard.set(response.msg.arr);

            currUser.update(state => {
                state.position = response.msg.pos;
                return state;
            });
        } else {
            console.log(response.err);
        }
    }).catch((err) => {
        console.log(err);
    });
}

export function getUserGames() {

    currUser.update(state => {
        userEmail = state.email;
        return state;
    });

    request = {
        func: "retrieveUserGames",
        email: userEmail
    }

    invokeFunction(request).then((response) => {
        console.log(response);
        if(response.msg != null) {

            let games = response.msg;
            
            userGames.update(state => {
                state = [];
                for(let i = 0; i < games.length; i++) {
                    if(games[i].finished)
                        state.push(games[i]);
                    else
                        state.unshift(games[i]);
                }
                return state;
            });
            
        } else {
            console.log(response.err);
            loading = false;
        }
    }).catch((error) => {
        console.log(error);
        loading = false;
    });
}

export function blink_text() {
    window.$('.blink').fadeOut(1000);
    window.$('.blink').fadeIn(1000);
}