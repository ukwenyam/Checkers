import { invokeFunction } from './Cloud.js';
import { allChats, currUser, userGames, leaderBoard, gameHistory, gameMoves, gameBoard, showCallee, calleeName, calleeID,
            showCallBar, currSocket, peer, onCall, showPlayer } from './Init.js';
import { Board } from './Board.js';
import { Piece } from './Piece.js';

let request, userEmail, userName;

export function getAllChats() {

    currUser.update(state => {
        userEmail = state.profile.email;
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

            allChats.update(state => {
                if(state.length > 1)
                    state = state.sort((a,b) => new Moment(a.history[a.history.length - 1].date).format("YYYYMMDD, HH:mm") - new Moment(b.history[b.history.length - 1].date).format("YYYYMMDD, HH:mm"));
                console.log(state);
                return state;
            });
        } else {
            console.log(response.err);
        }
    }).catch((error) => {
        console.log(error);
    });
}

export function getLeagueTable() {

    currUser.update(state => {
        userName = state.profile.name;
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
        userEmail = state.profile.email;
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
        }
    }).catch((error) => {
        console.log(error);
    });
}

export function normalizeState(game) {

    game = new Board(game, null);

    let state = [];
    let pieceId = [];
    let i, j;

    for(i = 0; i < 8; i++) {
        for(j = 0; j < 8; j++) {
            if(game.board[i][j] != null && game.board[i][j].side == game.otherColor && game.getStack(i, j) == 2) {
                state.push(-2);
                pieceId.push(game.board[i][j].id);
            } else if(game.board[i][j] != null && game.board[i][j].side == game.otherColor && game.getStack(i, j) == 1) {
                state.push(-1);
                pieceId.push(game.board[i][j].id);
            } else if (game.board[i][j] != null && game.board[i][j].side == game.myColor && game.getStack(i, j) == 1) {
                state.push(1)
                pieceId.push(game.board[i][j].id);
            } else if(game.board[i][j] != null && game.board[i][j].side == game.myColor && game.getStack(i, j) == 2) {
                state.push(2);
                pieceId.push(game.board[i][j].id);
            } else {
                state.push(0);
                pieceId.push(-1);
            }
        }
    }

    return { state, pieceId };
}

export function localizeState(state, ids, numMoves, flipped) {

    let myColor, otherColor;

    let myCheckers = [], otherCheckers = [];

    currUser.update(state => {
        if(flipped) {
            myColor = state.gamePreferences.otherColor;
            otherColor = state.gamePreferences.myColor;
        } else {
            myColor = state.gamePreferences.myColor;
            otherColor = state.gamePreferences.otherColor;
        }
      
        return state;
    });

    const state2d = [];
    while(state.length) state2d.push(state.splice(0,8));

    const ids2d = [];
    while(ids.length) ids2d.push(ids.splice(0,8));

    let i, j;

    let board = []

    for(i = 0; i < 8; i++) {
        board[i] = [];
        for(j = 0; j < 8; j++) {
            if(state2d[i][j] == -2) {
                board[i][j] = new Piece(i, j, otherColor, ids2d[i][j], 2);
                otherCheckers.push(ids2d[i][j]);
            } else if(state2d[i][j] == -1) {
                board[i][j] = new Piece(i, j, otherColor, ids2d[i][j], 1);
                otherCheckers.push(ids2d[i][j]);
            } else if(state2d[i][j] == 1) {
                board[i][j] = new Piece(i, j, myColor, ids2d[i][j], 1);
                myCheckers.push(ids2d[i][j]);
            } else if(state2d[i][j] == 2) {
                board[i][j] = new Piece(i, j, myColor, ids2d[i][j], 2);
                myCheckers.push(ids2d[i][j]);
            } else {
                board[i][j] = null;
            }
        }
    }

    return { board, myCheckers, otherCheckers, numMoves };
}

export function blink_text() {
    window.$('.blink').fadeOut(1000);
    window.$('.blink').fadeIn(1000);
}
