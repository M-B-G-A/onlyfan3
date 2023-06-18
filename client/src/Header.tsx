import { AppBar, Toolbar } from '@mui/material';
import AppIcon from './assets/app_icon.svg'
import { truncateMiddle, formatValue } from "./Utils";
import { PolybaseProvider, AuthProvider, useAuth, usePolybase, useIsAuthenticated } from "@polybase/react";
import { atom, useAtom } from "jotai";
import { AuthState } from '@polybase/auth';
import { Link, Navigation } from 'react-router-dom';
import { ProfileDialog } from './ProfileDialog';
import React, { useState } from "react";

/*
// 기존 코드
const walletAtom = atom<AuthState | null>(null);

const Header = () => {
  // const [ wallet, setWallet ] = useAtom(walletAtom);
  const { auth, state, loading } = useAuth();

  // `state` is null if not logged in, or logged in state e.g. { type: "metamask", userId: "..." }
  // React.useEffect(() => {
  //   console.log(state);
  //   setWallet(state);
  // }, [state]);
  // `auth` is the prop passed to AuthProvider as auth 

  return (
    <div>
      <button onClick={() => auth.signIn()}>Sign In</button>
      <button onClick={() => auth.signOut()}>Sign Out</button>
      { state ? <div>{state.publicKey}</div> : null}
    </div>
  )
}
*/

export const Header = () => {

    const { auth, state } = useAuth();
    const db = usePolybase();
    const [open, setOpen] = useState(false);

    const onClickMy = () => {
      console.log('onClickMy');
    };

    const onClickFeed = () => {
      console.log('onClickFeed');
    };

    const onClickWallet = async () => {
      if (state == null) {
        await signIn();
      } else {
        handleClickOpen();
      }
    };

    const signIn = async () => {
      const state = await auth.signIn();
      if (state?.publicKey != null) {
        const record = await db.collection('User').where("id", "==", state?.publicKey).get();
        console.log(record);
        if (record.data.length == 0) {
          const recordData = await db.collection('User').create([
            Math.random().toString(36).substring(2,11), 
            'image',
            'hello! Pans',
          ]);
          console.log(recordData);
        }
       }
    }

  const handleClickOpen = () => {
      setOpen(true);
  };

  const handleClose = () => {
      setOpen(false);
  };

    return (
       <div>
        <AppBar
            position="static"
            elevation={0}
            style={{
                backgroundColor: "#ffffff"
            }}
        >
            <Toolbar style={{
                height: "100px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between"
            }}>
                <div style={{
                    display: "flex",
                    height: "100px",
                    flexDirection: "row",
                    alignItems: "center"
                }}>
                    <img src={AppIcon} style={{ height: "45px", width: "200px" }} />
                </div>
                <div>
                  <button
                    onClick={() => {
                      onClickMy();
                    }}
                  >
                   <Link to="/feed">FEED</Link> 
                  </button>
                  <button
                    onClick={() => {
                      onClickFeed();
                    }}
                  >
                    <Link to="/library">LIBRARY</Link> 
                  </button>
                  <button
                    onClick={() => {
                      onClickWallet();
                    }}
                  >
                    { state?.publicKey != null ? <div>{ truncateMiddle(formatValue(state.publicKey), 20) }</div> : 'LOGIN' }
                  </button>
                </div>
            </Toolbar>
        </AppBar>
        <ProfileDialog props={{open: open, handleClose: handleClose, userId: state?.publicKey || "" }}  />
       </div>
    );
};