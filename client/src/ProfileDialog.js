import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from "react";
import Dialog from '@mui/material/Dialog';
import Close from './assets/close.svg';
import { useAuth, usePolybase } from "@polybase/react";
import { truncateMiddle, formatValue } from "./Utils";
import { useNavigate } from "react-router-dom";
import { useFilePicker } from 'use-file-picker';
import { storeFiles } from "./FileUtils";
export const ProfileDialog = ({ props }) => {
    const { auth, state } = useAuth();
    const navigate = useNavigate();
    const db = usePolybase();
    const [userName, setUserName] = useState("");
    const [userImage, setUserImage] = useState("");
    const [openFileSelector, { plainFiles }] = useFilePicker({
        accept: 'image/*',
        multiple: false,
    });
    const handleLogout = () => {
        auth.signOut();
        navigate("/");
        props.handleClose();
    };
    const handleOpenMyPage = () => {
        navigate("/profile/" + props.userId);
        props.handleClose();
    };
    React.useEffect(() => {
        if (props.open == true) {
            if (userName == "") {
                async function getUserName() {
                    const { data } = await db.collection('User').where("id", "==", props.userId).get();
                    setUserName(data[0].data.name);
                    setUserImage(data[0].data.image);
                }
                getUserName();
            }
            if (plainFiles.length && userImage == "") {
                storeFiles([plainFiles[0]]).then((filename) => {
                    setImage(filename);
                    setUserImage(filename);
                });
            }
        }
    });
    const setImage = async (filename) => {
        const recordData = await db.collection('User')
            .record(state?.publicKey || '')
            .call("setImage", [filename]);
    };
    return (_jsx(Dialog, { open: props.open, onClose: props.handleClose, children: _jsxs("div", { style: { width: "400px", height: "550px" }, children: [_jsx("div", { style: { position: "absolute", top: "25px", right: "25px" }, children: _jsx("button", { style: { height: "30px", width: "30px", padding: "0px" }, onClick: props.handleClose, children: _jsx("img", { src: Close }) }) }), _jsx("div", { style: { width: "100%", textAlign: "center", marginTop: "80px" }, children: _jsx("img", { style: { width: "150px", height: "150px", borderRadius: "75px", backgroundColor: "#EEEEEE" }, src: userImage, onClick: openFileSelector }) }), _jsx("div", { style: { width: "100%", textAlign: "center" }, children: _jsxs("button", { style: { fontSize: "24px", color: "#6C6C6C" }, children: ["@", userName] }) }), _jsx("div", { style: { width: "100%", textAlign: "center", marginBottom: "20px" }, children: _jsx("button", { style: { fontSize: "24px", color: "#000000" }, children: truncateMiddle(formatValue(props.userId), 20) }) }), _jsx("div", { style: { width: "100%", textAlign: "center", marginBottom: "20px" }, children: _jsx("button", { style: { width: "300px", height: "80px", fontSize: "24px", color: "#ffffff", background: "#4294F7", borderRadius: "12px" }, onClick: handleOpenMyPage, children: "My Page" }) }), state?.publicKey == props.userId ? (_jsx("div", { style: { width: "100%", textAlign: "center" }, children: _jsx("button", { style: { fontSize: "24px", color: "#626262" }, onClick: handleLogout, children: "Logout" }) })) : null] }) }));
};
