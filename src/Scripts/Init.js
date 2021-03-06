import { writable, readable } from 'svelte/store';
import io from 'socket.io-client';
import { Board } from './Board.js';
import env from '../env.json';

if(localStorage.getItem('offGames') == null) {
    const allOffGames = [];
    localStorage.setItem('offGames', JSON.stringify(allOffGames));
}

export const currSocket = writable(null);

if(window.location.hostname.includes('localhost')) {
    currSocket.set(io(env.local, {transports: ['websocket'], upgrade: false}));
} else {
    currSocket.set(io(env.server, {transports: ['websocket'], upgrade: false}));
}

export const ratio = readable(screen.width / screen.height);

export const currUser = writable(null);

export const showNavBar = writable(true);

export const page = writable(0);

export const gameTab = writable(0);

export const peer = writable(null);

export const showPlayer = writable(false);

export const onCall = writable(false);

export const startTimeStamp = writable(moment().startOf("day"));

export const currentTime = writable(0);

export const showCallBar = writable(false);

export const showCallee = writable(false);

export const calleeName = writable(null);

export const calleeID = writable(null);

export const callerID = writable(null);

export const callerSignal = writable(null);

export const showCaller = writable(false);

export const callerName = writable(false);

export const userGames = writable(null);

export const leaderBoard = writable(null);

export const gameBoard = writable(null);

export const gameLevel = writable(0);

export const gameHistory = writable([]);

export const gameMoves = writable([]);

export const gamePref = writable(null);

export const allChats = writable(null);

export const smallPopUp = writable(false);

export const bigPopUp = writable(false);

export const viewCreateGame = writable(false);

export const viewJoinGame = writable(false);

export const viewGameList = writable(false);

export const showLogin = writable(false);

export const viewCallStream = writable(false);

if(navigator.onLine) {

    (async () => {
        const allOffGames = await JSON.parse(localStorage.getItem('offGames'));
        

        if(allOffGames.length > 0) {

            for(let i = 0; i < allOffGames.length; i++) {
                let request = {
                    func: "saveTrainData",
                    fullGame: allOffGames[i],
                    id: null
                }
        
                currSocket.update(state => {
                    state.emit('save-game', request);
                    return state;
                });
            }
        }

        allOffGames = [];
        localStorage.setItem('offGames', JSON.stringify(allOffGames));
    });
}

window.onbeforeunload = async function() {

    const indexes = {};

    await currUser.update(state => {
        indexes.user = state;
        return state;
    });

    await page.update(state => {
        indexes.page = state;
        return state;
    });

    await gameTab.update(state => {
        indexes.tab = state;
        return state;
    });

    await gameBoard.update(state => {
        indexes.board = state;
        return state;
    });

    await gameHistory.update(state => {
        indexes.history = state;
        return state;
    });

    await gameMoves.update(state => {
        indexes.moves = state;
        return state;
    });

    await gamePref.update(state => {
        indexes.pref = state;
        return state;
    });

    await allChats.update(state => {
        indexes.chats = state;
        return state;
    })

    await userGames.update(state => {
        indexes.games = state;
        return state;
    });

    await leaderBoard.update(state => {
        indexes.league = state;
        return state;
    });

    await sessionStorage.setItem('idx', JSON.stringify(indexes));
}

window.onload = async function() {

    if (sessionStorage.getItem('idx') != null) {

        const indexes = await JSON.parse(sessionStorage.getItem('idx'));
            
        await currUser.set(indexes.user);

        await leaderBoard.set(indexes.league);
        
        if(indexes.board == null)
            await gameBoard.set(null);
        
        if(indexes.board != null)
            await gameBoard.set(new Board(indexes.board, null));

        await gameHistory.set(indexes.history);

        await gameMoves.set(indexes.moves);

        await gamePref.set(indexes.pref);

        await allChats.set(indexes.chats);

        await userGames.set(indexes.games);

        await gameTab.set(indexes.tab);

        await page.set(indexes.page);

        sessionStorage.removeItem('idx');
    }
}