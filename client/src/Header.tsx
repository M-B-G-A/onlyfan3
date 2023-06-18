import { AppBar, Toolbar } from '@mui/material';
import AppIcon from './assets/app_icon.svg'
import { truncateMiddle, formatValue } from "./Utils";
import { PolybaseProvider, AuthProvider, useAuth, usePolybase } from "@polybase/react";
import { atom, useAtom } from "jotai";

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

    const { auth, state, loading } = useAuth();

    const onClickMy = () => {
      console.log('onClickMy');
    };

    const onClickFeed = () => {
      console.log('onClickFeed');
    };

    const onClickWallet = () => {
      if (state != null) {
        auth.signOut();
      } else {
        auth.signIn();
      }
    };

    return (
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
                    MY
                  </button>
                  <button
                    onClick={() => {
                      onClickFeed();
                    }}
                  >
                    FEED
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
    );
};