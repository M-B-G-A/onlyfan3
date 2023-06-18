import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PolybaseProvider, AuthProvider } from "@polybase/react";
import { Polybase } from "@polybase/client";
import { Auth } from "@polybase/auth";
import { Header } from "./Header";
import { Feed } from "./Feed";
import { Library } from "./Library";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
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
    return (_jsx(PolybaseProvider, { polybase: db, children: _jsx(AuthProvider, { auth: auth, polybase: db, children: _jsxs(BrowserRouter, { children: [_jsx(Header, {}), _jsx("div", { style: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', }, children: _jsxs(Routes, { children: [_jsx(Route, { path: "/feed/*", element: _jsx(Feed, {}) }), _jsx(Route, { path: "/library/*", element: _jsx(Library, {}) }), _jsx(Route, { path: "/profile/:userId", element: _jsx(Profile, {}) }), _jsx(Route, { path: "/", element: _jsx(Navigate, { replace: true, to: "/feed" }) })] }) })] }) }) }));
};
