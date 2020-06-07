require('dotenv').config()
import * as functions from 'firebase-functions';
import * as respond from './response';
const generator = require('generate-password');
const firebase = require('firebase');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb+srv://Chidelma:Tasseobi96@autocluster-cl1yh.mongodb.net/CheckasIO?retryWrites=true&w=majority';

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
//const storeRef = firebase.storage().ref();

export const signUp = functions.https.onRequest((request, response) => {

    const res:any = respond.setResponse(response);
    const evt:any = request.body;

    let names:any = [];

    db.collection("USERS").where("name", "==", evt.name)
    .get()
    .then(async function(snapshot:any) {
        
        await snapshot.forEach(function(doc:any) {
            names.push(doc);
        });

        if(names.length > 0) {
            res.send({msg: "EXIST"});
        } else {
            auth.createUserWithEmailAndPassword(evt.email, evt.password).then(() => {
        
                const user:any = auth.currentUser;
        
                user.updateProfile({
                    displayName: evt.name
                }).then(function() {
                    user.sendEmailVerification().then(function() {
                        res.send({msg: "SUCCESS"});
                    }).catch(function(error:any) {
                        res.send({err: error.message});
                    });
                }).catch(function(error:any) {
                    res.send({err: error.message});
                });
        
            }).catch(function(error:any) {
                res.send({err: error.message});
            });
        }
    })
    .catch(function(error:any) {
        res.send({err: "Error finding document"});
    });
});

export const createUser = functions.https.onRequest((request, response) => {

    const res:any = respond.setResponse(response);
    const evt:any = request.body;

    const docRef:any = db.collection("USERS").doc(evt.email);

    docRef.get().then(function(doc:any) {
        if(!doc.exists) {
            docRef.set({
                name: evt.name,
                picture: null,
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
                res.send({err: error.message});
            });
        } else {
            res.send({err: "Code 007"});
        }
    }).catch(function(error:any) {
        res.send({err: error.message});
    });

    
});

export const signIn = functions.https.onRequest((request, response) => {

    const res:any = respond.setResponse(response);
    const evt:any = request.body;

    auth.signInWithEmailAndPassword(evt.email, evt.password).then(async () => {
        const user:any = auth.currentUser;
        res.send({msg: user.emailVerified});
    }).catch(function(error:any) {
        res.send({err: error.message});
    });
});

export const retrieveUser = functions.https.onRequest((request, response) => {

    const res:any = respond.setResponse(response);
    const evt:any = request.body;

    const docRef:any = db.collection("USERS").doc(evt.email);

    docRef.get().then(function(doc:any) {
        if(doc.exists) {
            res.send({msg: doc.data()});
        } else {
            res.send({err: "Code 007"});
        }
    }).catch(function(error:any) {
        res.send({err: error.message});
    });
});

/* export const updateProfile = functions.https.onRequest((request, response) => {

    const res:any = respond.setResponse(response);
    const evt:any = request.body;

    auth.signInWithEmailAndPassword(evt.email, evt.password).then(async () => {
        
        const user:any = auth.currentUser;

        user.updateProfile({
            displayName: evt.name
        }).then(function() {

            if(evt.picture !== null) {
                const metadata = {
                    contentType: 'image/jpeg'
                };
    
                storeRef.child('profilePics/' + evt.email + '.jpg').put(evt.picture, metadata).then((snapshot:any) => {

                    snapshot.ref.getDownloadURL().then(function(imgURL:string) {
                        const docRef:any = db.collection("USERS").doc(evt.email);
    
                        docRef.update({
                            name: evt.name,
                            picture: imgURL
                        }).then(function() {
                            res.send({msg: "SUCCESS"});
                        }).catch(function(error:any) {
                            res.send({err: error});
                        });
                    }).catch(function(error:any) {
                        res.send({err: error});
                    });
                    
                }).catch(function(error:any) {
                    res.send({err: error});
                });
            } else {
                res.send({msg: "SUCCESS"});
            }

        }).catch(function(error:any) {
            res.send({err: error});
        });
    }).catch(function(error:any) {
        res.send({err: error.message});
    });
}); */

export const forgotPassword = functions.https.onRequest((request, response) => {

    const res:any = respond.setResponse(response);
    const evt:any = request.body;

    auth.sendPasswordResetEmail(evt.email).then(function() {
        res.send({msg: "SUCCESS"});
    }).catch(function(error:any) {
        res.send({err: error.message});
    });
});

export const resetPassword = functions.https.onRequest((request, response) => {

    const res:any = respond.setResponse(response);
    const evt:any = request.body;

    auth.signInWithEmailAndPassword(evt.email, evt.password).then(async () => {

        const user:any = auth.currentUser;

        user.updatePassword(evt.newPass).then(function() {
            res.send({msg: "SUCCESS"});
        }).catch(function(error:any) {
            res.send({err: error.message});
        });

    }).catch(function(error:any) {
        res.send({err: error.message});
    });
});

export const createGame = functions.https.onRequest(async (request, response) => {

    const res:any = respond.setResponse(response);
    const evt:any = request.body;

    const user:any = await db.collection("USERS").doc(evt.email).get();

    if(user.exists) {

        const gameID:any = generator.generate({
            length: 10,
            numbers: true,
            excludeSimilarCharacters: true
        });

        MongoClient.connect(url, async function(err:any, client:any) {
            assert.equal(null, err);

            const collection:any = client.db("CheckasIO").collection("GAMES");

            const currPlayer:string = Math.floor(Math.random() * 2) == 0 ? "red" : "black";
            
            collection.insertOne({ 
                _id: gameID,
                gameHistory: [],
                priPlayer: evt.name,
                priEmail: evt.email,
                secPlayer: null,
                secEmail: null,
                priMoves: 0,
                secMoves: 0,
                time: Number(evt.time),
                date: evt.date,
                minutesPlayed: 0,
                finished: false,
                currPlayer: currPlayer
            }).then(function(result:any) {
                res.send({msg: { gameID: gameID, currPlayer: currPlayer }});
            }).catch(function(error:any) {
                res.send({err: error})
            });

            client.close();
        });
    } else {
        res.send({err: "Code 007"});
    }
});

export const joinGame = functions.https.onRequest(async (request, response) => {

    const res:any = respond.setResponse(response);
    const evt:any = request.body;

    const user:any = await db.collection("USERS").doc(evt.email).get();

    if(user.exists) {

        MongoClient.connect(url, async function(err:any, client:any) {

            assert.equal(null, err);

            const collection:any = client.db("CheckasIO").collection("GAMES");
            
            collection.updateOne({ _id: evt.gameID },
                { $set: { "secPlayer": evt.name, "secEmail": evt.email }
            }).then(async function(result:any) {

                const cursor:any = collection.find({ _id: evt.gameID });

                let game:any = null;

                await cursor.forEach(function(doc:any) {
                    game = doc;
                });

                let gameChat:any = null;

                let querySnapshot:any = await db.collection("CHATS").where("priEmail", "==", game.priEmail).where("secEmail", "==", evt.email).get();

                await querySnapshot.forEach(function(chat:any) {
                    gameChat = chat.data();
                    gameChat.id = chat.id;
                });

                querySnapshot = await db.collection("CHATS").where("priEmail", "==", evt.email).where("secEmail", "==", game.priEmail).get();

                await querySnapshot.forEach(function(chat:any) {
                    gameChat = chat.data();
                    gameChat.id = chat.id;
                });

                if(gameChat == null) {

                    const chatID:any = generator.generate({
                        length: 10,
                        numbers: true,
                        excludeSimilarCharacters: true
                    });

                    db.collection("CHATS").doc(chatID).set({
                        priName: game.priPlayer,
                        priEmail: game.priEmail,
                        secName: evt.name,
                        secEmail: evt.email,
                        history: []
                    }).then(async function() {
                        const newChat:any = await db.collection("CHATS").doc(chatID).get();
                        const chatData:any = newChat.data(); chatData.id = chatID;
                        res.send({msg: {chat: chatData, game: game}});
                    }).catch(function(error:any) {
                        res.send({err: error.message});
                    });

                } else {
                    res.send({msg: {chat: gameChat, game: game}});
                }

                client.close();
                
            }).catch(function() {
                client.close();
                res.send({err: "Error occured"});
            });
        });
    } else {
        res.send({err: "Code 007"});
    }
});

export const deleteGame = functions.https.onRequest((request, response) => {

    const res:any = respond.setResponse(response);
    const evt:any = request.body;

    let docRef:any = db.collection("USERS").doc(evt.id);

    docRef.get().then(function(doc:any) {
        if(doc.exists) {
            db.collection("GAMES").doc(evt.gameID).delete().then(function() {
                db.collection("CHATS").doc(evt.chatID).delete().then(function() {
                    res.send({msg: "SUCCESS"});
                }).catch(function(error:any) {
                    res.send({err: error.message});
                });
            }).catch(function(error:any) {
                res.send({err: error.message});
            });
        } else {
            res.send({err: "Code 007"});
        }
    }).catch(function(error:any) {
        res.send({err: error.message});
    });
})

export const saveGame = functions.https.onRequest(async (request, response) => {

    const res:any = respond.setResponse(response);
    const evt:any = request.body;

    const user:any = await db.collection("USERS").doc(evt.id).get();

    if(user.exists) {

        MongoClient.connect(url, async function(err:any, client:any) {

            assert.equal(null, err);

            const collection:any = client.db("CheckasIO").collection("GAMES");
            
            collection.updateOne({ _id: evt.gameID },
                { $set: { 
                    "gameHistory": evt.gameHistory, 
                    "minutesPlayed": Number(evt.minutes),
                    "currPlayer": evt.currPlayer,
                    "priMoves": evt.priMoves,
                    "secMoves": evt.secMoves
                }
            }).then(function(result:any) {
                res.send({msg: "SUCCESS"});
            }).catch(function(error:any) {
                res.send({err: error});
            });

            client.close();
        });

    } else {
        res.send({err: "Code 007"});
    }
});

export const saveChat = functions.https.onRequest((request, response) => {

    const res:any = respond.setResponse(response);
    const evt:any = request.body;

    let docRef:any = db.collection("USERS").doc(evt.id);

    docRef.get().then(function(doc:any) {
        if(doc.exists) {
            docRef = db.collection("CHATS").doc(evt.chatID);

            docRef.update({
                history: evt.history
            }).then(function() {
                res.send({msg: "SUCCESS"});
            }).catch(function(error:any) {
                res.send({err: error.message});
            });
        } else {
            res.send({err: "Code 007"});
        }
    }).catch(function(error:any) {
        res.send({err: error.message});
    });
});

export const checkersLeague = functions.https.onRequest((request, response) => {

    const res:any = respond.setResponse(response);
    const evt:any = request.body;

    const docRef:any = db.collection("USERS").doc(evt.id);

    docRef.get().then(function(doc:any) {
        if(doc.exists) {
            let users:any = [], i:number = 0, position:number = 0;

            db.collection("USERS").orderBy("totalPoints", "desc")
            .get()
            .then(async function(snapshot:any) {
                await snapshot.forEach(function(docu:any) {
                    i++;
                    if(docu.data().name == evt.name) {
                        position = i; return;
                    }
                });

                db.collection("USERS").orderBy("totalPoints", "desc").limit(50)
                .get()
                .then(async function(querySnapshot:any) {
                    await querySnapshot.forEach(function(dou:any) {
                        users.push(dou.data());
                    });

                    res.send({msg: {arr: users, pos: position}});
                }).catch(function(error:any) {
                    res.send({err: error.message});
                });
            }).catch(function(error:any) {
                res.send({err: error.message});
            });
        } else {
            res.send({err: "Code 007"});
        }
    }).catch(function(error:any) {
        res.send({err: error.message});
    });
});

export const finishGame = functions.https.onRequest((request, response) => {

    const res:any = respond.setResponse(response);
    const evt:any = request.body;

    let docRef:any = db.collection("USERS").doc(evt.id);

    docRef.get().then(function(doc:any) {
        if(doc.exists) {
            docRef = db.collection("GAMES").doc(evt.gameID);

            docRef.update({
                gameHistory: evt.gameHistory,
                minutesPlayed: Number(evt.minutes),
                chatHistory: evt.chatHistory,
                finished: true
            }).then(function() {
                res.send({msg: "SUCCESS"});
            }).catch(function(error:any) {
                res.send({err: error.message});
            });
        } else {
            res.send({err: "Code 007"});
        }
    }).catch(function(error:any) {
        res.send({err: error.message});
    });
});

export const updateUsersStats = functions.https.onRequest((request, response) => {

    const res:any = respond.setResponse(response);
    const evt:any = request.body;

    const docRef:any = db.collection("USERS").doc(evt.email);

    docRef.get().then(function(doc:any) {
        if(doc.exists) {
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
                res.send({err: error.message});
            });
        } else {
            res.send({err: "Code 007"});
        }
    }).catch(function(error:any) {
        res.send({err: error.message});
    });
});

export const retrieveUserChats = functions.https.onRequest((request, response) => {

    const res:any = respond.setResponse(response);
    const evt:any = request.body;

    const docRef:any = db.collection("USERS").doc(evt.email);

    docRef.get().then(function(doc:any) {
        if(doc.exists) {
            const chats:any = [];

            db.collection("CHATS").where("priEmail", "==", evt.email)
            .get()
            .then(async function(querySnapshot:any) {

                await querySnapshot.forEach(function(docu:any) {
                    const data = docu.data();
                    data.id = docu.id;
                    chats.push(data);
                });
            })
            .catch(function(error:any) {
                res.send({err: error.message});
            });

            db.collection("CHATS").where("secEmail", "==", evt.email)
            .get()
            .then(async function(querySnapshot:any) {
                
                await querySnapshot.forEach(function(dou:any) {
                    const data = dou.data();
                    data.id = dou.id;
                    chats.push(data);
                });

                res.send({msg: chats});
            })
            .catch(function(error:any) {
                res.send({err: error.message});
            });
        } else {
            res.send({err: "Code 007"});
        }
    });
});

export const retrieveUserGames = functions.https.onRequest(async (request, response) => {

    const res:any = respond.setResponse(response);
    const evt:any = request.body;

    const user:any = await db.collection("USERS").doc(evt.email).get();

    if(user.exists) {

        const games:any = [];

        MongoClient.connect(url, async function(err:any, client:any) {
            
            assert.equal(null, err);

            const collection:any = client.db("CheckasIO").collection("GAMES");
            
            const cursor:any = collection.find({ 
                $or: [ { priEmail: evt.email }, { secEmail: evt.email } ]
            });

            await cursor.forEach(function(doc:any) {
                if(doc.finished) {
                    games.push(doc);
                } else {
                    const game:any = doc;
                    game.numMoves = game.gameHistory.length > 0 ? game.gameHistory.length - 1 : 0;
                    game.gameHistory = game.gameHistory.length > 0 ? game.gameHistory[game.gameHistory.length - 1]: [];
                    games.push(game);
                }
            });

            res.send({msg: games});

            client.close();
        });
    } else {
        res.send({err: "Code 007"});
    }
});