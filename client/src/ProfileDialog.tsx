import React, { useState } from "react";
import Dialog from '@mui/material/Dialog';
import Close from './assets/close.svg'
import { useAuth, usePolybase } from "@polybase/react";
import { truncateMiddle, formatValue } from "./Utils";
import { useNavigate } from "react-router-dom";
import { useFilePicker } from 'use-file-picker';
import { useEffect } from "react";
import { storeFiles } from "./FileUtils";

type ProfileDialogProps = {
    open: boolean,
    userId: string,
    handleClose: () => void,
};

export const ProfileDialog = ({ props }: { props: ProfileDialogProps }) => {
    const { auth, state } = useAuth();
    const navigate = useNavigate();
    const db = usePolybase();
    const [userName, setUserName] = useState<string>("");
    const [userImage, setUserImage] = useState<string>("");
    const [openFileSelector, { plainFiles }] = useFilePicker({
        accept: 'image/*',
        multiple: false,
    });

    const handleLogout = () => {
        auth.signOut().then(() => {
            props.handleClose();
            navigate("/");
        });
    };

    const handleOpenMyPage = () => {
        navigate("/profile/" + props.userId);
        props.handleClose();
    };

    async function getUserName() {
        const { data } = await db.collection('User').where("id", "==", props.userId).get();
        setUserName(data[0].data.name);
        setUserImage(data[0].data.image);
    }

    React.useEffect(() => {
        // if (props.open == true) {
            // if (userName == "") {
                if(props.userId) {
                    getUserName();
                }
            // }
        // }
    }, [props.userId]);

    React.useEffect(() => {
        if (plainFiles.length && userImage == "") {
            storeFiles([plainFiles[0]]).then((filename: string) => {
                setImage(filename);
                setUserImage(filename);
            });
        }
    }, [plainFiles]);

    const setImage = async (filename: string) => {
        const recordData = await db.collection('User')
            .record(state?.publicKey || '')
            .call("setImage", [filename]);
    }

    return (
        <Dialog open={props.open} onClose={props.handleClose}>
            <div style={{ width: "400px", height: "550px" }}>
                <div style={{ position: "absolute", top: "25px", right: "25px" }}>
                    <button style={{ height: "30px", width: "30px", padding: "0px" }} onClick={props.handleClose}><img src={Close} /></button>
                </div>
                <div style={{ width: "100%", textAlign: "center", marginTop: "80px" }}>
                    <img
                        style={{ width: "150px", height: "150px", borderRadius: "75px", backgroundColor: "#EEEEEE" }}
                        src={userImage}
                        onClick={openFileSelector}
                    />
                </div>
                <div style={{ width: "100%", textAlign: "center" }}>
                    <button style={{ fontSize: "24px", color: "#6C6C6C" }}>
                        @{userName}
                    </button>
                </div>
                <div style={{ width: "100%", textAlign: "center", marginBottom: "20px" }}>
                    <button style={{ fontSize: "24px", color: "#000000" }}>
                        {truncateMiddle(formatValue(props.userId), 20)}
                    </button>
                </div>
                <div style={{ width: "100%", textAlign: "center", marginBottom: "20px" }}>
                    <button
                        style={{ width: "300px", height: "80px", fontSize: "24px", color: "#ffffff", background: "#4294F7", borderRadius: "12px" }}
                        onClick={handleOpenMyPage}
                    >
                      Go Page
                    </button>
                </div>
                {
                    state?.publicKey == props.userId ? (
                        <div style={{ width: "100%", textAlign: "center" }}>
                            <button
                                style={{ fontSize: "24px", color: "#626262" }}
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    ) : null
                }

            </div>
        </Dialog>
    );
};