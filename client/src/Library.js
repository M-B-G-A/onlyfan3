import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from "react";
import { useAuth, usePolybase } from "@polybase/react";
import { Content } from "./Content";
import { List, ListItem } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { ProfileDialog } from "./ProfileDialog";
import { FeedModel } from "./Feed";
export const Library = () => {
    const [feeds, setFeeds] = useState([]);
    const [id, setId] = useState(null);
    const { state } = useAuth();
    const db = usePolybase();
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();
    const [subscribedIds, setSubscribedIds] = React.useState(null);
    const handleClickOpen = (id) => {
        setId(id);
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const subscribe = async () => {
        const data = await fetch('http://k469emcmtlbfle9qrhpe1ppp9s.ingress.palmito.duckdns.org/subscription?subscriber=' + state?.publicKey, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        }).then((response) => response.json());
        console.log(data);
        setSubscribedIds(data.map((d) => d.creatorId));
    };
    React.useEffect(() => {
        async function getFeeds() {
            const { data } = await db.collection("Post").get();
            const feeds = data.reverse().filter(data => data.data.publicKey != state?.publicKey && (subscribedIds || []).filter((creatorId) => creatorId === data.data.publicKey).length != 0).map(data => new FeedModel(data.data.publicKey, //id
            '', // image
            '', // name
            data.data.content, data.data.cid, true));
            setFeeds(feeds);
        }
        getFeeds();
        if (subscribedIds == null) {
            subscribe();
        }
    });
    return (_jsxs("div", { children: [_jsx(List, { style: {
                    marginTop: "21px",
                }, children: feeds
                    .map((data, index) => (_jsx(ListItem, { children: _jsx(Content, { feed: data, handleClickOpen: handleClickOpen }) }))) }), _jsx(ProfileDialog, { props: { open: open, handleClose: handleClose, userId: id || "" } })] }));
};
