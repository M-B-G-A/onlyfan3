import * as React from "react";
import { PolybaseProvider, AuthProvider, useAuth, usePolybase } from "@polybase/react";
import { Polybase } from "@polybase/client";
import { Auth, AuthState } from "@polybase/auth";
import * as eth from "@polybase/eth";
import { atom, useAtom } from "jotai";
import { ulid } from 'ulid';

// const walletAtom = atom<AuthState | null>(null);

const Header = () => {
  // const [ wallet, setWallet ] = useAtom(walletAtom);
  const { auth, state, loading } = useAuth();

  // `state` is null if not logged in, or logged in state e.g. { type: "metamask", userId: "..." }
  // React.useEffect(() => {
  //   if(state) {
      
  //     console.log('hihi', eth.getEncryptionKey(state.userId || ''));
  //   }
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

const Content = () => {
  const { state } = useAuth();
  const db = usePolybase();
  const createUser = async () => {
    // .create(args) args array is defined by the constructor fn
    const recordData = await db.collection('User').create([
      'name', 
      'image?',
      'status?',
    ]);
  }

  const setName = async () => {
    const recordData = await db.collection('User')
      .record(state?.publicKey || '')
      .call("setName", ['name2']);
  }

  const deleteUser = async () => {
    const recordData = await db.collection('User').record(state?.publicKey || '').call('del');
    console.log(recordData);
  }

  const createPost = async () => {
    const createdPost = await db.collection('Post')
      .create([ulid(), 'cid from ipfs', 'contentcontentcontent', new Date().getTime(), 5]);
    console.log(createdPost);
  }

  const createTx = async () => {
    const createdTx = await db.collection('Transaction')
      .create(['TXID']);
    console.log(createdTx);
  }


  const deleteTx = async () => {
    const recordData = await db.collection('Transaction').record('TXID').call('del');
    console.log(recordData);
  }

  const createKey = async () => {
    const createdKey = await db.collection('Key')
      .create(['password']);
  }

  const getKey = async () => {
    console.log(await db.collection('Key').record(state?.publicKey || '').get());
  }
  
  return <>
    <div>
      <button onClick={() => createUser()}>create user</button>
      <button onClick={() => setName()}>set name</button>
      <button onClick={() => deleteUser()}>delete</button>
    </div>
    <div>
      <button onClick={() => createPost()}>create post</button>
    </div>
    <div>
      <button onClick={() => createTx()}>create tx</button>
      <button onClick={() => deleteTx()}>delete</button>
    </div>
    <div>
      <button onClick={() => createKey()}>create key</button>
      <button onClick={() => getKey()}>get key</button>
    </div>
  </>;
};

export const App = () => {
  const db = new Polybase({
    defaultNamespace: "pk/0x3f2d19f61dfe0a5bb4eb4f0fe4342bd1a3530797afa6c1a69c9a2e7e3eb7b196b9ac814e817f97bf25967992db8a468273a744e699dcf72d40e3bd7ab29c48c1/onlyfan3",
  });
  const auth = new Auth();
  return (
    <PolybaseProvider polybase={db}>
      <AuthProvider auth={auth} polybase={db}>
        <Header />
        <Content />
      </AuthProvider>
    </PolybaseProvider>
  );
};
