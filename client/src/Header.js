import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AppBar, Toolbar } from '@mui/material';
import AppIcon from './assets/app_icon.svg';
import { truncateMiddle, formatValue } from "./Utils";
import { useAuth, usePolybase } from "@polybase/react";
import { Link } from 'react-router-dom';
import { ProfileDialog } from './ProfileDialog';
import { useState } from "react";
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
        }
        else {
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
                    Math.random().toString(36).substring(2, 11),
                    'image',
                    'hello! Pans',
                ]);
                console.log(recordData);
            }
        }
    };
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    return (_jsxs("div", { children: [_jsx(AppBar, { position: "static", elevation: 0, style: {
                    backgroundColor: "#ffffff"
                }, children: _jsxs(Toolbar, { style: {
                        height: "100px",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }, children: [_jsx("div", { style: {
                                display: "flex",
                                height: "100px",
                                flexDirection: "row",
                                alignItems: "center"
                            }, children: _jsx("img", { src: AppIcon, style: { height: "45px", width: "200px" } }) }), _jsxs("div", { children: [_jsx("button", { onClick: () => {
                                        onClickMy();
                                    }, children: _jsx(Link, { to: "/feed", children: "FEED" }) }), _jsx("button", { onClick: () => {
                                        onClickFeed();
                                    }, children: _jsx(Link, { to: "/library", children: "LIBRARY" }) }), _jsx("button", { onClick: () => {
                                        onClickWallet();
                                    }, children: state?.publicKey != null ? _jsx("div", { children: truncateMiddle(formatValue(state.publicKey), 20) }) : 'LOGIN' })] })] }) }), _jsx(ProfileDialog, { props: { open: open, handleClose: handleClose, userId: state?.publicKey || "" } })] }));
};
