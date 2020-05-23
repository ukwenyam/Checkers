import { writable } from 'svelte/store';

import io from 'socket.io-client'

export const currSocket = writable(io('http://localhost:4000'));

export const currUser = writable(null);

export const page = writable(0);

export const userGames = writable(null);

export const leaderBoard = writable(null);

export const gameBoard = writable(null);

export const gameHistory = writable([]);

export const gamePref = writable(null);

window.onbeforeunload = async function() {

    const indexes = {};

    await currUser.update(state => {
        indexes.user = state;
        return state;
    });

    sessionStorage.setItem('idx', JSON.stringify(indexes));
}

window.onload = async function() {
    if (sessionStorage.getItem('idx') != null) {

        const indexes = await JSON.parse(sessionStorage.getItem('idx'));
        
        await currUser.set(indexes.user);

        sessionStorage.removeItem('idx');
    }
}