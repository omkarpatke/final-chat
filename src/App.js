import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { useState, useRef } from 'react';


import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
    apiKey: "AIzaSyAsrxxF0iWiwS5eZt3rpYsBfH8U1ExXejw",
    authDomain: "repeat-superchat.firebaseapp.com",
    projectId: "repeat-superchat",
    storageBucket: "repeat-superchat.appspot.com",
    messagingSenderId: "624415729237",
    appId: "1:624415729237:web:aa07af59ea7951228a16dc"
})

const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {
    const [user] = useAuthState(auth);
    return ( <div className = "App" >
        <header >
        <SignOut/ >
        </header>

        <section > { user ? < ChatRoom / > : < SignIn / > } </section>
         </div >
    );
}

function SignIn() {
    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider);
    }

    return ( <>
        <button onClick = { signInWithGoogle } > Sign in With Google </button>
         </>

    )
}

function SignOut() {
    return (auth.currentUser && ( <button className = 'sign-out'
        onClick = {
            () => auth.signOut()
        } > Sign Out </button>
    ))
}

function ChatRoom() {
    const dummy = useRef()


    const messagesRef = firestore.collection('messages');
    const query = messagesRef.orderBy('createdAt').limit(25);

    const [messages] = useCollectionData(query, { idField: 'id' });
    const [formValue, setFormValue] = useState('');

    const sendMessage = async(e) => {
        e.preventDefault();

        const { uid, photoURL } = auth.currentUser;
        await messagesRef.add({
            text: formValue,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid,
            photoURL

        })
        setFormValue('');

        dummy.current.scrollIntoView({ behavior: 'smooth' })

    }

    return ( <>
            <main> {
                messages && messages.map(msg => < ChatMessage key = { msg.id }
                    message = { msg }/>) } 
                    <div ref = { dummy } > </div>
</main > 
<form onSubmit = { sendMessage } >

                    <input value = { formValue }
                    onChange = {
                        (e) => setFormValue(e.target.value)
                    }/> 
                    <button type = 'submit'
                    disabled = {!formValue } > Send </button>
</form>
                     </>
                )
            }

            function ChatMessage(props) {
                const { text, uid } = props.message;
                const messageClass = uid === auth.currentUser.uid ? 'sent' : 'recieved';


                return ( <>
                    <div className = { `message ${messageClass}` } >
                    <p> { text } </p> </div >
                    </> )
                }

                export default App;