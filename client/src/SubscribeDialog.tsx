import * as React from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import Close from './assets/close.svg'
import { truncateMiddle, formatValue } from "./Utils";
import { UserModel } from './Profile';
import { useFilePicker } from 'use-file-picker';
import { useEffect } from "react";
import { storeFiles } from "./FileUtils";
import { useAuth, usePolybase } from "@polybase/react";
import { ulid } from 'ulid';

type InputDialogProps = {
  open: boolean,
  user?: UserModel,
  handleClose: () => void,
};

export const SubscribeDialog = ({ props }: { props: InputDialogProps }) => {

  const [image, setImage] = React.useState<string>("");
  const [content, setContent] = React.useState<string>("");
 

  const db = usePolybase();
  const { user } = props;
  const [credit, setCredit] = React.useState<number>(0); 

  const { state } = useAuth();

  const giveFaucet = async () => {
    const data = await fetch('http://k469emcmtlbfle9qrhpe1ppp9s.ingress.palmito.duckdns.org/wallet',{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        publicKey: state?.publicKey,
      }),
    }).then((response) => response.json())
    setCredit(data);
  }

  const subscribe = async (month: number) => {
    const data = await fetch('http://k469emcmtlbfle9qrhpe1ppp9s.ingress.palmito.duckdns.org/subscription',{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subscriber: state?.publicKey,
        creator: user?.id,
        month,
      }),
    }).then((response) => response.json());
    if(data > new Date().getTime()) {
      alert('subscribe success: until ' + new Date(data).toUTCString());
      window.location.reload();
    } else {
      alert('subscribe failed: not enough money');
    }
  };

  React.useEffect(() => {
    fetch('http://k469emcmtlbfle9qrhpe1ppp9s.ingress.palmito.duckdns.org/wallet?publicKey=' + state?.publicKey)
      .then(res => res.json()).then(c => setCredit(c));
  }, []);

  return (
    <Dialog open={props.open} onClose={props.handleClose}>
      <div style={{ 
        width: "400px", 
        height: "640px", 
        padding: "50px",
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        boxSizing: 'border-box',
      }}>
        <img src={props.user?.image} width={110} height={110} style={{ borderRadius: '55px' }} />
        <div style={{
          marginTop: '36px',
          color: '#6c6c6c',
          textDecorationLine: 'underline',
          fontSize: '24px',
          marginBottom: '45px',
        }}>{'@' + user?.name}</div>
        <button style={{
          backgroundColor: '#4294F7',
          width: '300px',
          height: '80px',
          borderRadius: '12px',
          color: '#fff',
          paddingLeft: '42px',
          paddingRight: '42px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '25px',
          fontSize: '20px',
        }} onClick={() => subscribe(1)}><div>30 days</div><div>20 FIL</div></button>
        <button style={{
          backgroundColor: '#4294F7',
          width: '300px',
          height: '80px',
          borderRadius: '12px',
          color: '#fff',
          paddingLeft: '42px',
          paddingRight: '42px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '25px',
          fontSize: '20px',
        }} onClick={() => subscribe(2)}><div>60 days</div><div>40 FIL</div></button>
        <button style={{
          backgroundColor: '#4294F7',
          width: '300px',
          height: '80px',
          borderRadius: '12px',
          color: '#fff',
          paddingLeft: '42px',
          paddingRight: '42px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '20px',
        }} onClick={() => subscribe(3)}><div>90 days</div><div>60 FIL</div></button>
      </div>
      {credit < 20 ? <div style={{ color: '#aaa'}} onClick={() => giveFaucet()}>faucet</div> : null}
    </Dialog>
  );
}