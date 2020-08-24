require('dotenv').config()
import * as functions from 'firebase-functions';
import * as respond from './response';
const generator = require('generate-password');
const firebase = require('firebase');
const { Storage } = require('@google-cloud/storage');
const stream = require('stream');

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

const storage = new Storage({ projectId: "checker-io", keyFilename: './serviceAccount.json' });

const auth = firebase.auth();
const db = firebase.firestore();

export const signUp = functions.https.onRequest(async (request, response) => {

    const res:any = respond.setResponse(response);
    const evt:any = request.body;

    const names:any = [];

    const snapshot:any = await db.collection("USERS").where("name", "==", evt.name).get();
        
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
});

export const createUser = functions.https.onRequest(async (request, response) => {

    const res:any = respond.setResponse(response);
    const evt:any = request.body;

    const docRef:any = db.collection("USERS").doc(evt.email);

    const user:any = await docRef.get();

    if(!user.exists) {
        docRef.set({
            profile : {
                name: evt.name,
                picture: 'https://api.adorable.io/avatars/285/' + evt.email + '.png'
            },
            stats : {
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
            },
            gamePreferences : {
                myColor: "#ffffff",
                otherColor: "#000000",
                compTime: 60,
                orient: 2
            },
            lastGame: []
        }).then(function() {
            res.send({msg: "SUCCESS"});
        }).catch(function(error:any) {
            res.send({err: error.message});
        });
    } else {
        res.send({err: "Code 007"});
    }
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

export const retrieveUser = functions.https.onRequest(async (request, response) => {

    const res:any = respond.setResponse(response);
    const evt:any = request.body;

    const user:any = await db.collection("USERS").doc(evt.email).get();

    if(user.exists) {
        res.send({msg: user.data()});
    } else {
        res.send({err: "Code 007"});
    }
});

export const updateProfile = functions.https.onRequest((request, response) => {

    const res:any = respond.setResponse(response);
    const evt:any = request.body;

    auth.signInWithEmailAndPassword(evt.email, evt.password).then(async () => {
        
        const user:any = auth.currentUser;
        const bucket = await storage.bucket('gs://checker-io.appspot.com');

        user.updateProfile({
            displayName: evt.name
        }).then(async function() {
            if(evt.picture != null) {

                const image:any = evt.picture;
                const mimeType:any = image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)[1];
                const fileName:string = evt.email + '.jpeg';

                const base64EncodedImageString:any = image.replace(/^data:image\/\w+;base64,/, '');

                const imageBuffer:any = Buffer.from(base64EncodedImageString, 'base64');

                const bufferStream:any = new stream.PassThrough();

                bufferStream.end(imageBuffer);

                const file:any = bucket.file('profilePics/' + fileName);

                bufferStream.pipe(file.createWriteStream({
                    metadata: {
                    contentType: mimeType
                    },
                    public: true,
                    validation: "md5"
                }))
                .on('error', function (err:any) {
                    console.log('error from image upload', err);
                })
                .on('finish', async function () {
                    // The file upload is complete.
                    const signedUrls:any = await file.getSignedUrl({
                                                action: 'read',
                                                expires: '03-09-2491'
                                            });

                    db.collection("USERS").doc(evt.email).update({
                        profile: {
                            picture: signedUrls[0],
                            name: evt.name
                        }
                    }).then(function() {
                        res.send({msg: "SUCCESS"});
                    }).catch(function(error:any) {
                        res.send({err: error.message});
                    });
                });
            } else {
                db.collection("USERS").doc(evt.email).update({
                    profile: {
                        name: evt.name,
                        picture: 'https://api.adorable.io/avatars/285/' + evt.email + '.png'
                    }
                }).then(function() {
                    res.send({msg: "SUCCESS"});
                }).catch(function(error:any) {
                    res.send({err: error.message});
                });
            }
        }).catch(function(error:any) {
            res.send({err: error});
        });
    }).catch(function(error:any) {
        res.send({err: error.message});
    });
});

export const updateGamePref = functions.https.onRequest(async (request, response) => {

    const res:any = respond.setResponse(response);
    const evt:any = request.body;

    const user:any = await db.collection("USERS").doc(evt.id).get();

    if(user.exists) {
        db.collection("USERS").doc(evt.id).update({
            gamePreferences: {
                myColor: evt.myColor,
                otherColor: evt.otherColor,
                orient: evt.orient,
                compTime: evt.compTime
            }
        }).then(function() {
            res.send({msg: "SUCCESS"});
        }).catch(function(error:any) {
            res.send({err: error.message});
        });
    } else {
        res.send({err: "Code 007"});
    }
});

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

        const docRef:any = db.collection("GAMES").doc(gameID);

        const currPlayer:number = Math.floor(Math.random() * 2) === 0 ? 0 : 1;

        const game:any = { 
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
            currPlayer: currPlayer,
            winner: null
        }

        docRef.set(game).then(function() {
            game.id = gameID;
            res.send({msg: game});
        }).catch(function(error:any) {
            res.send({err: error})
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

        db.collection("GAMES").doc(evt.gameID).update({
            secPlayer: evt.name,
            secEmail: evt.email
        }).then(async function() {

            const game:any = await db.collection("GAMES").doc(evt.gameID).get();

            let gameChat:any = null;

            let querySnapshot:any = await db.collection("CHATS").where("priEmail", "==", game.data().priEmail).where("secEmail", "==", evt.email).get();

            await querySnapshot.forEach(function(chat:any) {
                gameChat = chat.data();
                gameChat.id = chat.id;
            });

            querySnapshot = await db.collection("CHATS").where("priEmail", "==", evt.email).where("secEmail", "==", game.data().priEmail).get();

            await querySnapshot.forEach(function(chat:any) {
                gameChat = chat.data();
                gameChat.id = chat.id;
            });

            if(gameChat === null) {

                const chatID:any = generator.generate({
                    length: 10,
                    numbers: true,
                    excludeSimilarCharacters: true
                });

                db.collection("CHATS").doc(chatID).set({
                    priName: game.data().priPlayer,
                    priEmail: game.data().priEmail,
                    secName: evt.name,
                    secEmail: evt.email,
                    history: []
                }).then(async function() {
                    res.send({msg: game.data()});
                }).catch(function(error:any) {
                    res.send({err: error.message});
                });

            } else {
                res.send({msg: game.data()});
            }
        }).catch(function(error:any) {
            res.send({err: error.message});
        });
    } else {
        res.send({err: "Code 007"});
    }
});

export const deleteGame = functions.https.onRequest(async (request, response) => {

    const res:any = respond.setResponse(response);
    const evt:any = request.body;

    const user:any = await db.collection("USERS").doc(evt.id).get();
    const game:any = await db.collection("GAMES").doc(evt.gameID).get();
    const chat:any = await db.collection("CHATS").doc(evt.chatID).get();

    if(user.exists && game.exists && chat.exists) {
        await db.collection("GAMES").doc(evt.gameID).delete();
        await db.collection("CHATS").doc(evt.chatID).delete();
        res.send({msg: "SUCCESS"});
    } else {
        res.send({err: "Code 007"});
    }
})

export const saveGame = functions.https.onRequest(async (request, response) => {

    const res:any = respond.setResponse(response);
    const evt:any = request.body;

    const user:any = await db.collection("USERS").doc(evt.id).get();

    if(user.exists) {

        if(evt.initiator) {
            db.collection("GAMES").doc(evt.gameID).update({
                gameHistory: evt.gameHistory,
                minutesPlayed: Number(evt.minutes),
                currPlayer: evt.currPlayer,
                priMoves: evt.myMoves
            }).then(function() {
                res.send({msg: "SUCCESS"});
            }).catch(function(error:any) {
                res.send({err: error.message});
            });
        } else {
            db.collection("GAMES").doc(evt.gameID).update({
                gameHistory: evt.gameHistory,
                minutesPlayed: Number(evt.minutes),
                currPlayer: evt.currPlayer,
                secMoves: evt.myMoves
            }).then(function() {
                res.send({msg: "SUCCESS"});
            }).catch(function(error:any) {
                res.send({err: error.message});
            });
        }
    } else {
        res.send({err: "Code 007"});
    }
});

export const saveUserGame = functions.https.onRequest(async (request, response) => {

    const res:any = respond.setResponse(response);
    const evt:any = request.body;

    const user:any = await db.collection("USERS").doc(evt.id).get();

    if (user.exists) {

        db.collection("USERS").doc(evt.id).update({
            lastGame: evt.lastGame
        }).then(function() {
            res.send({msg: "SUCCESS"});
        }).catch(function(error:any) {
            res.send({err: error.message});
        });

    } else {
        res.send({err: "Code 007"});
    }
});

export const saveChat = functions.https.onRequest(async (request, response) => {

    const res:any = respond.setResponse(response);
    const evt:any = request.body;

    const user:any = await db.collection("USERS").doc(evt.id).get();

    if(user.exists) {

        db.collection("CHATS").doc(evt.chatID).update({
            history: firebase.firestore.FieldValue.arrayUnion(evt.msg)
        }).then(function() {
            res.send({msg: "SUCCESS"});
        }).catch(function(error:any) {
            res.send({err: error.message});
        });
    } else {
        res.send({err: "Code 007"});
    }
});

export const checkersLeague = functions.https.onRequest(async (request, response) => {

    const res:any = respond.setResponse(response);
    const evt:any = request.body;

    const user:any = await db.collection("USERS").doc(evt.id).get();

    if(user.exists) {
        const users:any = []; 

        let i:number = 0, position:number = 0;

        let snapShot:any = await db.collection("USERS").orderBy("stats.totalPoints", "desc").get();

        await snapShot.forEach(function(docu:any) {
            i++;
            if(docu.data().profile.name === evt.name) {
                position = i; return;
            }
        });

        snapShot = await db.collection("USERS").orderBy("stats.totalPoints", "desc").limit(50).get();

        await snapShot.forEach(function(dou:any) {
            users.push(dou.data());
        });

        res.send({msg: {arr: users, pos: position}});
    } else {
        res.send({err: "Code 007"});
    }
});

export const finishGame = functions.https.onRequest(async (request, response) => {

    const res:any = respond.setResponse(response);
    const evt:any = request.body;

    const user:any = await db.collection("USERS").doc(evt.id).get();

    if(user.exists) {

        if(evt.gameHistory == null) {
            db.collection("GAMES").doc(evt.gameID).update({
                priMoves: evt.myMoves,
            }).then(function() {
                res.send({msg: "SUCCESS"});
            }).catch(function(error:any) {
                res.send({err: error.message});
            });
        } else {
            if(evt.initiator) {
                db.collection("GAMES").doc(evt.gameID).update({
                    gameHistory: evt.gameHistory,
                    minutesPlayed: Number(evt.minutes),
                    priMoves: evt.myMoves,
                    finished: true,
                    winner: evt.winner
                }).then(function() {
                    res.send({msg: "SUCCESS"});
                }).catch(function(error:any) {
                    res.send({err: error.message});
                });
            } else {
                db.collection("GAMES").doc(evt.gameID).update({
                    gameHistory: evt.gameHistory,
                    minutesPlayed: Number(evt.minutes),
                    secMoves: evt.myMoves,
                    finished: true,
                    winner: evt.winner
                }).then(function() {
                    res.send({msg: "SUCCESS"});
                }).catch(function(error:any) {
                    res.send({err: error.message});
                });
            }
        }

    } else {
        res.send({err: "Code 007"});
    }
});

export const updateUsersStats = functions.https.onRequest(async (request, response) => {

    const res:any = respond.setResponse(response);
    const evt:any = request.body;

    const user:any = await db.collection("USERS").doc(evt.email).get();

    if(user.exists) {

        db.collection("USERS").doc(evt.email).update({
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
});

export const retrieveUserChats = functions.https.onRequest(async (request, response) => {

    const res:any = respond.setResponse(response);
    const evt:any = request.body;

    const user:any = await db.collection("USERS").doc(evt.email).get();

    if(user.exists) {
        const chats:any = [];

        let snapShot:any = await db.collection("CHATS").where("priEmail", "==", evt.email).get();
        
        await snapShot.forEach(function(docu:any) {
            const data = docu.data();
            data.online = false;
            data.id = docu.id;
            chats.push(data);
        });

        snapShot = await db.collection("CHATS").where("secEmail", "==", evt.email).get();
        
        await snapShot.forEach(function(dou:any) {
            const data = dou.data();
            data.online = false;
            data.id = dou.id;
            chats.push(data);
        });

        res.send({msg: chats});
    } else {
        res.send({err: "Code 007"});
    }
});

export const saveTrainData = functions.https.onRequest(async (request, response) => {

    const res:any = respond.setResponse(response);
    const evt:any = request.body;

    const gameID:any = generator.generate({
        length: 10,
        numbers: true,
        excludeSimilarCharacters: true
    });

    const docRef:any = db.collection("AIDATA").doc(gameID);

    docRef.set({ fullGame: evt.fullGame }).then(async function() {
        if(evt.id != null) {

            const user:any = await db.collection("USERS").doc(evt.id).get();

            if (user.exists) {
                db.collection("USERS").doc(evt.id).update({
                    lastGame: []
                }).then(function() {
                    res.send({msg: "SUCCESS"});
                }).catch(function(error:any) {
                    res.send({err: error.message});
                });
            } else {
                res.send({err: "Code 007"});
            }
        } else {
            res.send({msg: "SUCCESS"});
        }
    }).catch(function(error:any) {
        res.send({err: error})
    });
});

export const retrieveUserGames = functions.https.onRequest(async (request, response) => {

    const res:any = respond.setResponse(response);
    const evt:any = request.body;

    const user:any = await db.collection("USERS").doc(evt.email).get();

    if(user.exists) {

        const games:any = [];

        let querySnapshot:any = await db.collection("GAMES").where("priEmail", "==", evt.email).get();

        await querySnapshot.forEach(function(game:any) {
            const currGame:any = game.data();
            currGame.id = game.id;
            if(currGame.finished) {
                games.push(currGame);
            } else {
                currGame.gameHistory = currGame.priHistory.length > 0 ? currGame.priHistory[currGame.priHistory.length - 1] : [];
                games.push(currGame);
            }
        });

        querySnapshot = await db.collection("GAMES").where("secEmail", "==", evt.email).get();

        await querySnapshot.forEach(function(doc:any) {
            const currGame:any = doc.data();
            currGame.id = doc.id;
            if(currGame.finished) {
                games.push(currGame);
            } else {
                currGame.gameHistory = currGame.secHistory.length > 0 ? currGame.secHistory[currGame.secHistory.length - 1] : [];
                games.push(currGame);
            }
        });

        res.send({msg: games});
    } else {
        res.send({err: "Code 007"});
    }
});

