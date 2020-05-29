import { writable } from 'svelte/store';
import io from 'socket.io-client';
import { Board } from './Board.js';

window.onload = async function() {

    if (sessionStorage.getItem('idx') != null) {

        const indexes = await JSON.parse(sessionStorage.getItem('idx'));
        
        await currUser.set(indexes.user);

        await gameBoard.set(new Board(indexes.board.board, null));

        await gameHistory.set(indexes.history);

        await gamePref.set(indexes.pref);

        await gameChat.set(indexes.chat);

        await gameTab.set(indexes.tab);

        await userGames.set(indexes.games);

        await page.set(indexes.page);

        sessionStorage.removeItem('idx');
    }
}

export const currSocket = writable(io("https://checkerio-server.herokuapp.com/"));

export const currUser = writable(null);

export const page = writable(0);

export const gameTab = writable(0);

export const userGames = writable([]);

export const leaderBoard = writable(null);

export const gameBoard = writable(null);

export const gameHistory = writable([]);

export const gamePref = writable(null);

export const gameChat = writable([]);

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

    await gamePref.update(state => {
        indexes.pref = state;
        return state;
    });

    await gameChat.update(state => {
        indexes.chat = state;
        return state;
    });

    await userGames.update(state => {
        indexes.games = state;
        return state;
    });

    await sessionStorage.setItem('idx', JSON.stringify(indexes));
}

