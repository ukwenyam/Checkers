require('dotenv').config()
import * as functions from 'firebase-functions';
import * as respond from './response';
const generator = require('generate-password');
const firebase = require('firebase');
//const storage = require('@google-cloud/storage')

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

export const createGame = functions.https.onRequest((request, response) => {

    const res:any = respond.setResponse(response);
    const evt:any = request.body;

    const docRef:any = db.collection("USERS").doc(evt.email);

    docRef.get().then(function(doc:any) {
        if(doc.exists) {
            const gameID:any = generator.generate({
                length: 10,
                numbers: true,
                excludeSimilarCharacters: true
            });
        
            db.collection("GAMES").doc(gameID).set({
                priPlayer: evt.name,
                priEmail: evt.email,
                secPlayer: null,
                chatID:null,
                secEmail: null,
                priGameHistory: [],
                secGameHistory: [],
                time: Number(evt.time),
                date: evt.date,
                minutesPlayed: 0,
                finished: false,
                currPlayer: null
            }).then(function() {
                res.send({msg: gameID});
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

export const joinGame = functions.https.onRequest((request, response) => {

    const res:any = respond.setResponse(response);
    const evt:any = request.body;

    const userRef:any = db.collection("USERS").doc(evt.email);

    userRef.get().then(function(user:any) {
        if(user.exists) {

            const gameRef:any = db.collection("GAMES").doc(evt.gameID);

            gameRef.update({
                secPlayer: evt.name,
                secEmail: evt.email
            }).then(function() {

                db.collection("GAMES").doc(evt.gameID).get().then(function(gameDoc:any) {

                    const priEmail:string = gameDoc.data().priEmail;
                    const priName:string = gameDoc.data().priPlayer;

                    db.collection("CHATS").where("priEmail", "==", priEmail).where("secEmail", "==", evt.email)
                    .get()
                    .then(async function(querySnapshot:any) {

                        let gameChat:any = null;

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
                                priName: priName,
                                priEmail: priEmail,
                                secName: evt.name,
                                secEmail: evt.email,
                                history: []
                            }).then(function() {
                                db.collection("CHATS").doc(chatID).get().then(function(newChat:any) {
                                    const chatData:any = newChat.data(); chatData.id = chatID;
                                    res.send({msg: {chat: chatData, game: gameDoc.data()}});
                                }).catch(function(error:any) {
                                    res.send({err: error.message});
                                });
                            }).catch(function(error:any) {
                                res.send({err: error.message});
                            });

                        } else {
                            res.send({msg: {chat: gameChat, game: gameDoc.data()}});
                        }
                    }).catch(function(error:any) {
                        res.send({err: error.message});
                    });
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

export const saveGame = functions.https.onRequest((request, response) => {

    const res:any = respond.setResponse(response);
    const evt:any = request.body;

    let docRef:any = db.collection("USERS").doc(evt.id);

    docRef.get().then(function(doc:any) {
        if(doc.exists) {
            docRef = db.collection("GAMES").doc(evt.gameID);

            if(evt.pri) {

                docRef.update({
                    priGameHistory: evt.gameHistory,
                    minutesPlayed: Number(evt.minutes),
                    chatHistory: evt.chatHistory,
                    currPlayer: evt.currPlayer
                }).then(function() {
                    res.send({msg: "SUCCESS"});
                }).catch(function(error:any) {
                    res.send({err: error.message});
                });
            }

            if(evt.sec) {

                docRef.update({
                    secGameHistory: evt.gameHistory,
                    minutesPlayed: Number(evt.minutes),
                    chatHistory: evt.chatHistory,
                    currPlayer: evt.currPlayer
                }).then(function() {
                    res.send({msg: "SUCCESS"});
                }).catch(function(error:any) {
                    res.send({err: error.message});
                });
            }
        } else {
            res.send({err: "Code 007"});
        }
    }).catch(function(error:any) {
        res.send({err: error.message});
    });
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

export const retrieveUserGames = functions.https.onRequest((request, response) => {

    const res:any = respond.setResponse(response);
    const evt:any = request.body;

    const docRef:any = db.collection("USERS").doc(evt.email);

    docRef.get().then(function(doc:any) {
        if(doc.exists) {
            const games:any = [];

            db.collection("GAMES").where("priEmail", "==", evt.email)
            .get()
            .then(async function(querySnapshot:any) {

                await querySnapshot.forEach(function(docu:any) {
                    const data = docu.data();
                    data.id = doc.id;
                    games.push(data);
                });
            })
            .catch(function(error:any) {
                res.send({err: error.message});
            });

            db.collection("GAMES").where("secEmail", "==", evt.email)
            .get()
            .then(async function(querySnapshot:any) {
                
                await querySnapshot.forEach(function(dou:any) {
                    const data = dou.data();
                    data.id = dou.id;
                    games.push(data);
                });

                res.send({msg: games});
            })
            .catch(function(error:any) {
                res.send({err: error.message});
            });
        } else {
            res.send({err: "Code 007"});
        }
    }).catch(function(error:any) {
        res.send({err: error.message});
    });
});