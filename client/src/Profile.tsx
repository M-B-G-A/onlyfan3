import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth, usePolybase } from "@polybase/react";
import { InputDialog } from "./InputDialog";
import { SubscribeDialog } from "./SubscribeDialog";
import { FeedModel } from "./Feed";
import { List, ListItem } from '@mui/material';
import { Content } from "./Content";

export class UserModel {
    id: string;
    name: string;
    image: string;
    status: string;

    constructor(
        id: string,
        name: string,
        image: string,
        status: string,
    ) {
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
    const [user, setUser] = useState<UserModel | null>(null);
    const [open, setOpen] = React.useState(false);
    const [subscribeOpen, setSubscribeOpen] = React.useState(false);
    const [subscription, setSubscription] = React.useState(0);
    const [feeds, setFeeds] = useState<FeedModel[]>([]);
    
    const onClick = async () => {
        if (state?.publicKey != user?.id) {
            // subscribe
            if (subscription < new Date().getTime()) {
                setSubscribeOpen(true);
            }
        } else {
            setOpen(true);
        }
    };

    const handleClose = () => {
        if (state?.publicKey != user?.id) {
            // subscribe
            setSubscribeOpen(false);
        } else {
            setOpen(false);
        }
    };

    const handleClickOpen = (id: string) => {

    };

    async function getUser() {
        console.log(userId)
        const { data } = await db.collection('User').record(userId || '').get();
        const record = data;
        setUser(new UserModel(record.id, record.name, record.image, record.status));
    }

        
    async function getFeeds(visible: boolean) {
        const { data } = await db.collection("Post").get();

        const feeds = data.reverse().filter(data =>
            data.data.publicKey == userId
        ).map(data =>
            new FeedModel(
                data.data.publicKey, //id
                "", // image
                "", // name
                data.data.content,
                data.data.cid,
                visible,
                data.data.timestamp
            )
        );
        setFeeds(feeds);
    }

    React.useEffect(() => {
        getUser();
    }, []);

    React.useEffect(() => {
        if(state?.publicKey && user) {
            fetch(`https://basic-bundle-soft-wildflower-6de2.currybab.workers.dev/subscription?subscriber=${state?.publicKey}&creator=${user?.id}`)
                .then(res => res.json())
                .then(res => {
                    console.log(res);
                    if(res.length > 0) {
                        console.log(res[0].until);
                        setSubscription(res[0].until);
                    }

                    getFeeds(userId === state?.publicKey || res.length > 0);
                });
        } else {
            getFeeds(false);
        }
    }, [state, user]);

    return (
        <div>
            <div style={{ marginTop: "170px" }}>
                <div style={{ marginLeft: "200px", marginBottom: "10px" }}>
                    <div style={{ color: "#6C6C6C", fontSize: "24px", float: "left", marginRight: "200px" }}>
                        { user?.name }
                    </div>
                    <div style={{ color: "#6C6C6C", fontSize: "24px" }}>
                        <button 
                            style={{ background: (state?.publicKey != user?.id && subscription > new Date().getTime()) ? "#aaa":"linear-gradient(90deg, #510CF5 0%, #99FCFD 97.83%)", borderRadius: "12px", color: "white", fontSize: "16px", width: "252px", height: "55px" }}
                            onClick={onClick}
                        >
                            { state?.publicKey != user?.id ? 
                                (subscription > new Date().getTime() ? `${Math.round((new Date(subscription).getTime() - new Date().getTime()) / 24 / 3600000)} days left` : "Subscribe"): "UPLOAD"
                            }
                        </button>
                    </div>
                </div>

                <div style={{ width: "800px", background: "white", height: "202px", borderRadius: "15px" }}>

                    <div style={{ position: "absolute", top: "220px" }}>
                        <img src={user?.image} style={{ marginLeft: "20px", width: "160px", height: "160px", borderRadius: "80px", overflow: "hidden", backgroundColor: "#EEEEEE" }} />
                    </div>
                    <div style={{ paddingLeft: "200px", paddingRight: "40px", paddingTop: "30px" }}>
                        {user?.status}
                    </div>
                </div>
            </div>
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
            <InputDialog props={{ open: open, handleClose: handleClose, user: user || undefined }} />
            <SubscribeDialog props={{ open: subscribeOpen, handleClose: handleClose, user: user || undefined }} />
        </div>
    );
};
