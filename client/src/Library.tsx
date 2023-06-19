import React, { useState } from "react";
import { useAuth, usePolybase } from "@polybase/react";
import { Content } from "./Content";
import { List, ListItem } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import Close from './assets/close.svg'
import { useNavigate } from "react-router-dom";
import { ProfileDialog } from "./ProfileDialog";
import { FeedModel } from "./Feed";

export const Library = () => {
    const [feeds, setFeeds] = useState<FeedModel[]>([]);
    const [id, setId] = useState<string | null>(null);
    const { state } = useAuth();
    const db = usePolybase();

    const [open, setOpen] = React.useState(false);

    const navigate = useNavigate();
    const [subscribedIds, setSubscribedIds] = React.useState(null);

    const handleClickOpen = (id: string) => {
        setId(id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const subscribe = async () => {
        const data = await fetch('https://basic-bundle-soft-wildflower-6de2.currybab.workers.dev/subscription?subscriber=' + state?.publicKey, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        }).then((response) => response.json());

        console.log(data);
        setSubscribedIds(data.map((d: any) => d.creatorId));
    };

    React.useEffect(() => {
        async function getFeeds() {
            const { data } = await db.collection("Post").get()
            const feeds = data.reverse().filter( data =>
                 data.data.publicKey != state?.publicKey && (subscribedIds || []).filter((creatorId) => creatorId === data.data.publicKey).length != 0
            ).map(data =>
                new FeedModel(
                    data.data.publicKey, //id
                    '', // image
                    '', // name
                    data.data.content,
                    data.data.cid,
                    true,
                    data.data.timestamp
                )
            );
            setFeeds(feeds);
        }
        getFeeds();

        if (subscribedIds == null) {
            subscribe();
        }
    }, []);

    return (
        <div>
            <List style={{
                marginTop: "21px",
            }}>
                {feeds
                    .map((data, index) => (
                        <ListItem>
                            <Content feed={data} handleClickOpen={handleClickOpen} />
                        </ListItem>
                    ))
                }
            </List>
            <ProfileDialog props={{ open: open, handleClose: handleClose, userId: id || "" }} />
        </div>
    );
};
