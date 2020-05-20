require('dotenv').config()
import * as functions from 'firebase-functions';
import * as respond from './response';

const generator = require('generate-password');
const firebase = require('firebase');

firebase.initializeApp({
    "apiKey" : "AIzaSyBSStZGTofCfLQDJeGFYnZgYs1sUIW0GhU",
    "authDomain" : "checker-io.firebaseapp.com",
    "databaseURL" : "https://checker-io.firebaseio.com",
    "projectId" : "checker-io",
    "storageBucket" : "checker-io.appspot.com",
    "messagingSenderId" : "119022070241",
    "appId" : "1:119022070241:web:4cab5ec53a70bf508f0aa0",
    "measurementId" : "G-Y4XHBBVNC5"
});

const auth = firebase.auth();
const db = firebase.firestore();

export const signUp = functions.https.onRequest((request, response) => {

    const res:any = respond.setResponse(response);
    const evt:any = request.body;

    auth.createUserWithEmailAndPassword(evt.email, evt.password).then(() => {
        
        const user:any = auth.currentUser;

        user.updateProfile({
            displayName: evt.name
        }).then(function() {
            res.send({msg: "SUCCESS"});
        }).catch(function(error:any) {
            res.send({err: error});
        });

    }).catch(function(error:any) {
        res.send({err: error});
    });
});

export const createUser = functions.https.onRequest((request, response) => {

    const res:any = respond.setResponse(response);
    const evt:any = request.body;

    db.collection("USERS").doc(evt.email).set({
        name: evt.name,
        wins: 0,
        draws: 0,
        losses: 0,
        gamesPlayed: 0,
        leastMoves: 0,
        mostMoves: 0,
        totalMoves: 0,
        avgMovesPerGame: 0,
        leastTimePlayed: 0,
        mostTimePlayed: 0,
        totalTimePlayed: 0,
        avgTimePlayPerGame: 0,
        totalPoints: 0
    }).then(function() {
        res.send({msg: "SUCCESS"});
    }).catch(function(error:any) {
        res.send({err: error});
    });
});

export const signIn = functions.https.onRequest((request, response) => {

    const res:any = respond.setResponse(response);
    const evt:any = request.body;

    auth.signInWithEmailAndPassword(evt.email, evt.password).then(async () => {
        res.send({msg: "SUCCESS"});
    }).catch(function(error:any) {
        res.send({err: error.message});
    });
});

export const retrieveUser = functions.https.onRequest((request, response) => {

    const res:any = respond.setResponse(response);
    const evt:any = request.body;

    const docRef:any = db.collection("USERS").doc(evt.email);

    docRef.get().then(function(doc:any) {
        res.send({msg: doc.data()});
    }).catch(function(error:any) {
        res.send({err: error});
    });
});

export const createGame = functions.https.onRequest((request, response) => {

    const res:any = respond.setResponse(response);
    const evt:any = request.body;

    let gameID:string = generator.generate({
        length: 10,
        numbers: true
    });

    let doc:any = db.collection("GAMES").doc(gameID).get();

    while(doc.exist) {
        gameID = generator.generate({
            length: 10,
            numbers: true
        });

        doc = db.collection("GAMES").doc(gameID).get();
    }

    db.collection("GAMES").doc(gameID).set({
        priPlayer: evt.name,
        secPlayer: null,
        gameHistory: evt.gameHistory,
        date: evt.date,
        minutesPlayed: 0,
        finished: false,
        chatHistory: []
    }).then(function() {
        res.send({msg: gameID});
    }).catch(function(error:any) {
        res.send({err: error});
    });
});

export const joinGame = functions.https.onRequest((request, response) => {

    const res:any = respond.setResponse(response);
    const evt:any = request.body;

    const docRef:any = db.collection("GAMES").doc(evt.gameID);

    docRef.update({
        secPlayer: evt.name
    }).then(function() {
        res.send({msg: docRef.get().data()});
    }).catch(function(error:any) {
        res.send({err: error});
    });
});

export const saveGame = functions.https.onRequest((request, response) => {

    const res:any = respond.setResponse(response);
    const evt:any = request.body;

    const docRef:any = db.collection("GAMES").doc(evt.gameID);

    docRef.update({
        gameHistory: evt.gameHistory,
        minutesPlayed: evt.minutes,
        chatHistory: evt.chatHistory
    }).then(function() {
        res.send({msg: "SUCCESS"});
    }).catch(function(error:any) {
        res.send({err: error});
    });
});

export const resumeGame = functions.https.onRequest((request, response) => {

    const res:any = respond.setResponse(response);
    const evt:any = request.body;

    const doc:any = db.collection("GAMES").doc(evt.gameID).get();

    res.send({msg: doc.data()});
});

export const finishGame = functions.https.onRequest((request, response) => {

    const res:any = respond.setResponse(response);
    const evt:any = request.body;

    const docRef:any = db.collection("GAMES").doc(evt.gameID);

    docRef.update({
        gameHistory: evt.gameHistory,
        minutesPlayed: evt.minutes,
        chatHistory: evt.chatHistory,
        finished: true
    }).then(function() {
        res.send({msg: "SUCCESS"});
    }).catch(function(error:any) {
        res.send({err: error});
    });
});

export const updateUsersStats = functions.https.onRequest((request, response) => {

    const res:any = respond.setResponse(response);
    const evt:any = request.body;

    const docRef:any = db.collection("USERS").doc(evt.email);

    docRef.update({
        wins: evt.wins,
        draws: evt.draws,
        losses: evt.losses,
        gamesPlayed: evt.gamesPlayed,
        leastMoves: evt.leastMoves,
        mostMoves: evt.mostMoves,
        totalMoves: evt.totalMoves,
        avgMovesPerGame: evt.avgMovesPerGame,
        leastTimePlayed: evt.leastTimePlayed,
        mostTimePlayed: evt.mostTimePlayed,
        totalTimePlayed: evt.totalTimePlayed,
        avgTimePlayPerGame: evt.avgMovesPerGame,
        totalPoints: evt.totalPoints
    }).then(function() {
        res({msg: "SUCCESS"});
    }).catch(function(error:any) {
        res.send({err: error});
    });
});

export const retrieveUserGames = functions.https.onRequest((request, response) => {

    const res:any = respond.setResponse(response);
    const evt:any = request.body;

    const games:any = [], gamesDb:any = db.collection("GAMES");

    gamesDb.where("priPlayer", "==", evt.name)
    .get()
    .then(function(querySnapshot:any) {
        querySnapshot.forEach(function(doc:any) {
            const data = doc.data();
            data.id = doc.id;
            games.push(data);
        });
    })
    .catch(function(error:any) {
        res.send({err:error});
    });

    gamesDb.where("secPlayer", "==", evt.name)
    .get()
    .then(function(querySnapshot:any) {
        querySnapshot.forEach(function(doc:any) {
            const data = doc.data();
            data.id = doc.id;
            games.push(data);
        });
    })
    .catch(function(error:any) {
        res.send({err:error});
    });

    res.send({msg: games});
});