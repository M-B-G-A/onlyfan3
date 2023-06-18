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

    const handleClickOpen = (id: string) => {
        setId(id)
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    React.useEffect(() => {
        async function getFeeds() {
            const { data } = await db.collection("Post").get()
            const feeds = data.map(data =>
                new FeedModel(
                    data.data.publicKey, //id
                    data.data.publicKey, // image
                    'ss', // name
                    data.data.content,
                    data.data.cid
                )
            );
            setFeeds(feeds);
        }
        getFeeds();
    });

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