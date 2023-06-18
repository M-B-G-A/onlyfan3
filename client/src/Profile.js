import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth, usePolybase } from "@polybase/react";
import { InputDialog } from "./InputDialog";
import { SubscribeDialog } from "./SubscribeDialog";
import { FeedModel } from "./Feed";
import { List, ListItem } from '@mui/material';
import { Content } from "./Content";
export class UserModel {
    constructor(id, name, image, status) {
        Object.defineProperty(this, "id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "image", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "status", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.id = id;
        this.name = name;
        this.image = image;
        this.status = status;
    }
}
export const Profile = () => {
    const { auth, state } = useAuth();
    const db = usePolybase();
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [open, setOpen] = React.useState(false);
    const [subscribeOpen, setSubscribeOpen] = React.useState(false);
    const [subscription, setSubscription] = React.useState(0);
    const [feeds, setFeeds] = useState([]);
    const onClick = async () => {
        if (state?.publicKey != user?.id) {
            // subscribe
            if (subscription < new Date().getTime()) {
                setSubscribeOpen(true);
            }
        }
        else {
            setOpen(true);
        }
    };
    const handleClose = () => {
        if (state?.publicKey != user?.id) {
            // subscribe
            setSubscribeOpen(false);
        }
        else {
            setOpen(false);
        }
    };
    const handleClickOpen = (id) => {
    };
    React.useEffect(() => {
        if (user == null) {
            async function getUser() {
                const { data } = await db.collection('User').where("id", "==", userId || "").get();
                const record = data[0].data;
                setUser(new UserModel(record.id, record.name, record.image, record.status));
            }
            getUser();
        }
        async function getFeeds() {
            const { data } = await db.collection("Post").get();
            const feeds = data.reverse().filter(data => data.data.publicKey == state?.publicKey).map(data => new FeedModel(data.data.publicKey, //id
            "", // image
            "", // name
            data.data.content, data.data.cid, true));
            setFeeds(feeds);
        }
        getFeeds();
        fetch(`http://k469emcmtlbfle9qrhpe1ppp9s.ingress.palmito.duckdns.org/subscription?subscriber=${state?.publicKey}&creator=${user?.id}`)
            .then(res => res.json())
            .then(res => {
            console.log(res);
            if (res.length > 0) {
                console.log(res[0].until);
                setSubscription(res[0].until);
            }
        });
    });
    return (_jsxs("div", { children: [_jsxs("div", { style: { marginTop: "170px" }, children: [_jsxs("div", { style: { marginLeft: "200px", marginBottom: "10px" }, children: [_jsx("div", { style: { color: "#6C6C6C", fontSize: "24px", float: "left", marginRight: "200px" }, children: user?.name }), _jsx("div", { style: { color: "#6C6C6C", fontSize: "24px" }, children: _jsx("button", { style: { background: (state?.publicKey != user?.id && subscription > new Date().getTime()) ? "#aaa" : "linear-gradient(90deg, #510CF5 0%, #99FCFD 97.83%)", borderRadius: "12px", color: "white", fontSize: "16px", width: "252px", height: "55px" }, onClick: onClick, children: state?.publicKey != user?.id ?
                                        (subscription > new Date().getTime() ? "Subscribed" : "Subscribe") : "UPLOAD" }) })] }), _jsxs("div", { style: { width: "800px", background: "white", height: "202px", borderRadius: "15px" }, children: [_jsx("div", { style: { position: "absolute", top: "220px" }, children: _jsx("img", { src: user?.image, style: { marginLeft: "20px", width: "160px", height: "160px", borderRadius: "80px", overflow: "hidden", backgroundColor: "#EEEEEE" } }) }), _jsx("div", { style: { paddingLeft: "200px", paddingRight: "40px", paddingTop: "30px" }, children: user?.status })] })] }), _jsx(List, { style: {
                    marginTop: "21px",
                }, children: feeds
                    .map((data, index) => (_jsx(ListItem, { children: _jsx(Content, { feed: data, handleClickOpen: handleClickOpen }) }))) }), _jsx(InputDialog, { props: { open: open, handleClose: handleClose, user: user || undefined } }), _jsx(SubscribeDialog, { props: { open: subscribeOpen, handleClose: handleClose, user: user || undefined } })] }));
};
