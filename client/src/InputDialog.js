import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import Close from './assets/close.svg';
import { truncateMiddle, formatValue } from "./Utils";
import { useFilePicker } from 'use-file-picker';
import { storeFiles } from "./FileUtils";
import { usePolybase } from "@polybase/react";
import { ulid } from 'ulid';
import CircularProgress from '@mui/material/CircularProgress';
export const InputDialog = ({ props }) => {
    const [loading, setLoading] = React.useState(false);
    const [image, setImage] = React.useState("");
    const [content, setContent] = React.useState("");
    const [openFileSelector, { plainFiles }] = useFilePicker({
        accept: 'image/*',
        multiple: false,
    });
    const db = usePolybase();
    const onChange = (e) => {
        setContent(e.target.value);
    };
    const onClick = async () => {
        await createPost();
        props.handleClose();
    };
    const createPost = async () => {
        const createdPost = await db.collection('Post')
            .create([ulid(), image, content, new Date().getTime()]);
        console.log(createdPost);
    };
    React.useEffect(() => {
        if (props.open) {
            if (plainFiles.length && image == "") {
                setLoading(true);
                storeFiles([plainFiles[0]]).then((filename) => {
                    setImage(filename);
                    setLoading(false);
                });
            }
        }
    });
    return (_jsx("div", { children: _jsxs(Dialog, { open: props.open, onClose: props.handleClose, children: [_jsxs("div", { style: { width: "800px", height: "600px", paddingTop: "40px", paddingLeft: "40px", paddingBottom: "140px" }, children: [_jsxs("div", { style: { width: "100%", height: "80px", display: "flex" }, children: [_jsx("div", { style: { marginRight: "18px" }, children: _jsx("img", { src: props.user?.image, style: { width: "80px", height: "80px", borderRadius: "40px", overflow: "hidden", backgroundColor: "#EEEEEE" } }) }), _jsxs("div", { children: [_jsxs("div", { style: { color: "#6C6C6C", fontSize: "24px" }, children: ["@", props.user?.name] }), _jsx("div", { style: { color: "#000000", fontSize: "24px" }, children: truncateMiddle(formatValue(props.user?.id || ""), 20) })] })] }), _jsx(TextField, { id: "standard-multiline-static", multiline: true, rows: 15, style: { width: "520px", marginRight: "20px", marginTop: "22px" }, onChange: onChange })] }), _jsx("div", { style: { position: "absolute", top: "25px", right: "25px" }, children: _jsx("button", { style: { height: "30px", width: "30px", padding: "0px" }, onClick: props.handleClose, children: _jsx("img", { src: Close }) }) }), _jsx("div", { style: { position: "absolute", bottom: "100px", right: "40px" }, children: _jsx("button", { style: { height: "50px", fontSize: "24px", color: "#000000", padding: "0px" }, onClick: openFileSelector, children: _jsx("u", { children: "UPLOAD Photo & Movie" }) }) }), _jsx("div", { style: { position: "absolute", bottom: "30px", right: "40px" }, children: _jsx("button", { style: { width: "230px", height: "60px", background: "linear-gradient(90deg, #510CF5 0%, #99FCFD 100%)", borderRadius: "12px", fontSize: "18px", color: "#ffffff" }, onClick: onClick, children: "UPLOAD" }) }), loading ? (_jsx("div", { style: { width: "100%", height: "100%", display: 'flex', alignItems: 'center', justifyContent: 'center', position: "absolute" }, children: _jsx(CircularProgress, {}) })) : null] }) }));
};
