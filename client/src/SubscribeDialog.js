import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import { useAuth, usePolybase } from "@polybase/react";
export const SubscribeDialog = ({ props }) => {
    const [image, setImage] = React.useState("");
    const [content, setContent] = React.useState("");
    const db = usePolybase();
    const { user } = props;
    const [credit, setCredit] = React.useState(0);
    const { state } = useAuth();
    const giveFaucet = async () => {
        const data = await fetch('http://k469emcmtlbfle9qrhpe1ppp9s.ingress.palmito.duckdns.org/wallet', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                publicKey: state?.publicKey,
            }),
        }).then((response) => response.json());
        setCredit(data);
    };
    const subscribe = async (month) => {
        const data = await fetch('http://k469emcmtlbfle9qrhpe1ppp9s.ingress.palmito.duckdns.org/subscription', {
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
        if (data > new Date().getTime()) {
            alert('subscribe success: until ' + new Date(data).toUTCString());
            window.location.reload();
        }
        else {
            alert('subscribe failed: not enough money');
        }
    };
    React.useEffect(() => {
        fetch('http://k469emcmtlbfle9qrhpe1ppp9s.ingress.palmito.duckdns.org/wallet?publicKey=' + state?.publicKey)
            .then(res => res.json()).then(c => setCredit(c));
    }, []);
    return (_jsxs(Dialog, { open: props.open, onClose: props.handleClose, children: [_jsxs("div", { style: {
                    width: "400px",
                    height: "640px",
                    padding: "50px",
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                    boxSizing: 'border-box',
                }, children: [_jsx("img", { src: props.user?.image, width: 110, height: 110, style: { borderRadius: '55px' } }), _jsx("div", { style: {
                            marginTop: '36px',
                            color: '#6c6c6c',
                            textDecorationLine: 'underline',
                            fontSize: '24px',
                            marginBottom: '45px',
                        }, children: '@' + user?.name }), _jsxs("button", { style: {
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
                        }, onClick: () => subscribe(1), children: [_jsx("div", { children: "30 days" }), _jsx("div", { children: "20 FIL" })] }), _jsxs("button", { style: {
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
                        }, onClick: () => subscribe(2), children: [_jsx("div", { children: "60 days" }), _jsx("div", { children: "40 FIL" })] }), _jsxs("button", { style: {
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
                        }, onClick: () => subscribe(3), children: [_jsx("div", { children: "90 days" }), _jsx("div", { children: "60 FIL" })] })] }), credit < 20 ? _jsx("div", { style: { color: '#aaa' }, onClick: () => giveFaucet(), children: "faucet" }) : null] }));
};
