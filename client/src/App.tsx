import * as React from "react";
import { PolybaseProvider, AuthProvider, useAuth, useIsAuthenticated } from "@polybase/react";
import { Polybase } from "@polybase/client";
import { Auth, AuthState } from "@polybase/auth";
import { atom, useAtom } from "jotai";

const polybase = new Polybase();
const auth = new Auth();

const walletAtom = atom<AuthState | null>(null);

const Header = () => {
  const [ wallet, setWallet ] = useAtom(walletAtom);
  const { auth, state, loading } = useAuth();

  // `state` is null if not logged in, or logged in state e.g. { type: "metamask", userId: "..." }
  React.useEffect(() => {
    setWallet(state);
  }, [state]);
  // `auth` is the prop passed to AuthProvider as auth 

  return (
    <div>
      <button onClick={() => auth.signIn()}>Sign In</button>
      <button onClick={() => auth.signOut()}>Sign Out</button>
    </div>
  )
}

const Content = () => {
  const [ wallet ] = useAtom(walletAtom);
  const [isLoggedIn, loading] = useIsAuthenticated();
  return (
    wallet ? <div>
      { wallet?.userId }
    </div> : <div>no user detected</div>
  );
}

export const App = () => {
  return (
    <PolybaseProvider polybase={polybase}>
      <AuthProvider auth={auth} polybase={polybase}>
        <Header />
        <Content />
      </AuthProvider>
    </PolybaseProvider>
  );
};
