"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  signInWithGoogle,
  signOut,
  // onIdTokenChanged,
  onAuthStateChanged,
} from "@/src/lib/firebase/auth.js";
import { addFakeRestaurantsAndReviews } from "@/src/lib/firebase/firestore.js";
import { setCookie, deleteCookie } from "cookies-next";

// function useUserSession(initialUser) {
  
//   useEffect(() => {
//     return onIdTokenChanged(async user => {
//       if(user){
//         const idToken = await user.getIdToken();
//         await setCookie("___session", idToken);
//         window.location.reload();
//       } else {
//         return await deleteCookie("__session");
//       };

//       // if(initialUser?.uid === user?.uid) return;
//       // else window.location.reload();
//     });
//   }, [initialUser]);

//   return initialUser;
// };

function UserHeader({ user }) {

  const handleSignOut = (event) => {
    event.preventDefault();
    signOut();
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

function NoUserHeader(){

  const handleSignIn = (event) => {
    event.preventDefault();
    signInWithGoogle();
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

export default function Header({ initialUser }) {
  const [user, setUser] = useState(initialUser);

  onAuthStateChanged(async user => {
    if(!user) return await deleteCookie("__session");
    const idToken = await user.getIdToken();
    await setCookie("___session", idToken);
    setUser(user);
  });

  // const user = useUserSession(initialUser);

  // const handleSignOut = (event) => {
  //   event.preventDefault();
  //   signOut();
  // };

  // const handleSignIn = (event) => {
  //   event.preventDefault();
  //   signInWithGoogle();
  // };

  return (
    <header>
      <Link href="/" className="logo">
        <img src="/friendly-eats.svg" alt="FriendlyEats" />
        Friendly Eats
      </Link>
      {user ? <UserHeader user={user} /> : <NoUserHeader />}
      {/* {user ? (
        <>
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
        </>
      ) : (
        <div className="profile">
          <a href="#" onClick={handleSignIn}>
            <img src="/profile.svg" alt="A placeholder user image" />
            Sign In with Google
          </a>
        </div>
      )} */}
    </header>
  );
};