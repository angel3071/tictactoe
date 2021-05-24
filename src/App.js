import React, { useRef, useState } from 'react';
import './App.css';
import "./Board.css";

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';


firebase.initializeApp({
  apiKey: "AIzaSyDc6UfzwYZEMFiCKzgboPMZUYNDk10bS3A",
  authDomain: "tictactoe-1c146.firebaseapp.com",
  projectId: "tictactoe-1c146",
  storageBucket: "tictactoe-1c146.appspot.com",
  messagingSenderId: "169864309378",
  appId: "1:169864309378:web:f0d8e5219a2e096f09229b"
})

const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {
  console.log('Entering App');

  const [user] = useAuthState(auth)
 
  return (
    <div className="App">
      <header>
      </header>

      <section>
      {user ? <Board /> : <SignIn />}
      </section>

    </div>
  );
}

function SignIn() {
  console.log('Entering SignIn');

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </>
  )

}

function CreateMatch() {
  console.log('Entering CreateMatch');

  const createNewMatch = async () => {
    console.log('Entering create new match');
    const { uid } = auth.currentUser;
    const matchesRef = firestore.collection('matches');
    matchesRef.add({
      creator: uid,
      data: ['-', '-', '-', '-', '-', '-', '-', '-', '-'],
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    })

  }

  return (
    <>
      <button onClick={createNewMatch}>create new match</button>
    </>
  )
}

function Board() {
  console.log('Entering Board');
  const matchesRef = firestore.collection('matches');
  const query = matchesRef.orderBy('createdAt').limit(1);

  const [matches] = useCollectionData(query, { idField: 'id' });

  console.log(matches);

  if(Array.isArray(matches) && matches.length) //why js?
    return (<>
      {matches.map(match => <Match key={match.id} match={match} />)}
      </>
      )
  return(<CreateMatch />)

}




function Match(props) {
  console.log('Entering Match');

  const { id, data, creator } = props.match;
  console.log(id);

  const handleClick = async (data, index) => {

    console.log('Entering on cell click');

    if(data[index] !== '-') return; //cell is not empty

    const { uid } = auth.currentUser;
    console.log(uid)
    const userElement = (creator === uid) ? 'x' : 'o';  //first player marks with an x
    const matchesRef = firestore.collection('matches').doc(id);
    await matchesRef.update({
      data: data.map((x, i) => i === index ? userElement : x )
    })
  }

  console.log(data);
  return (
    <div>       
    <div className="board-container">
      {data && data.map((element, index) => 
      <div key={index} className='board-cell' onClick={() => handleClick(data, index)}> {element} </div>)} 
    </div> 
    </div>
  )

}

export default App;
