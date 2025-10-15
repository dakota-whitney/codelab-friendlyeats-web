"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { auth } from "@/src/lib/firebase/clientApp";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  // onIdTokenChanged,
} from "firebase/auth";
// import {
//   signInWithGoogle,
//   signOut,
//   onAuthStateChanged,
// } from "@/src/lib/firebase/auth.js";
import { addFakeRestaurantsAndReviews } from "@/src/lib/firebase/firestore.js";
import { setCookie, deleteCookie } from "cookies-next";

function UserHeader({ user, auth }) {

  const handleSignOut = async event => {
    event.preventDefault();

    try {
      await auth.signOut();
    } catch(error){
      console.error('Error signing out with Google', error);
    };
  };

  return (
    <div className="profile">
      <p>
        <img
          className="profileImage"
          src={user.photoURL || "/profile.svg"}
          alt={user.email}
        />
        {user.displayName}
      </p>

      <div className="menu">
        ...
        <ul>
          <li>{user.displayName}</li>

          <li>
            <a href="#" onClick={addFakeRestaurantsAndReviews}>
              Add sample restaurants
            </a>
          </li>

          <li>
            <a href="#" onClick={handleSignOut}>
              Sign Out
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

function NoUserHeader({ auth }){

  const handleSignIn = async event => {
    event.preventDefault();
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
    } catch(error) {
      console.error('Error signing in with Google', error);
    };
  };
  
  return (
    <div className="profile">
      <a href="#" onClick={handleSignIn}>
        <img src="/profile.svg" alt="A placeholder user image" />
        Sign In with Google
      </a>
    </div>
  );
};

export default function Header({ appConfig, initialUser }) {
  const [user, setUser] = useState(initialUser);

  useEffect(() => {
    return onAuthStateChanged(auth, async user => {
      if(!user) await deleteCookie("__session");
      else await user.getIdToken().then(token => setCookie("___session", token));
      setUser(user);
    });
  }, []);

  return (
    <header>
      <Link href="/" className="logo">
        <img src="/friendly-eats.svg" alt="FriendlyEats" />
        Friendly Eats
      </Link>
      {user ? 
        <UserHeader user={user} auth={auth} /> : 
        <NoUserHeader auth={auth} />
      }
    </header>
  );
};