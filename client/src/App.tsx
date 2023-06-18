import * as React from "react";
import { PolybaseProvider, AuthProvider, useAuth, usePolybase } from "@polybase/react";
import { Polybase } from "@polybase/client";
import { Auth, AuthState } from "@polybase/auth";
import * as eth from "@polybase/eth";
import { atom, useAtom } from "jotai";
import { ulid } from 'ulid';
import { Header } from "./Header"
import { Feed } from "./Feed"
import { Library } from "./Library"
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import { Profile } from "./Profile";

/*
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
*/

export const App = () => {
  const db = new Polybase({
    defaultNamespace: "pk/0xb01611ad184429dfd624954a3ef60a87afaac44a575f70370f20dfb26aedc837cf3f1ce3977e4ab2b0d47a11ae774fff78f168d106994060b2e6247cc0fd60d2/onlyfan3",
  });

  const auth = new Auth();

  return (
    <PolybaseProvider polybase={db}>
      <AuthProvider auth={auth} polybase={db}>
          <BrowserRouter>
          <Header />
        <div style={{  width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
          <Routes>
            <Route path="/feed/*" element={ <Feed /> } />
            <Route path="/library/*" element={ <Library /> } />
            <Route path="/profile/:userId" element={ <Profile /> } />
            <Route path="/" element={ <Navigate replace to ="/feed" /> } />
          </Routes>
          </div>
          </BrowserRouter>
      </AuthProvider>
    </PolybaseProvider>
  );
};
