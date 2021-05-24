const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

exports.detectVictory = functions.firestore
       .document('matches/{matchId}')
       .onUpdate(async (change, context) => {

        console.log('Entering onUpdate matches');

        const { data, winner, creator, uid } = change.after.data(); 
        if(winner) return;

        console.log('Match data', data);

        const getwinner = (data) => {
            return 'x';
        }
        
        const calculatedWinner = getwinner(data);
        if(calculatedWinner)
            await db.collection('matches').doc(context.params.matchId).update({winner: calculatedWinner === 'x' ? creator : 'other'
        });


});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
