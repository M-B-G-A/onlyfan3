import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { UserModel } from './Profile';
import { usePolybase } from "@polybase/react";
import React, { useState } from "react";
export const Content = ({ feed, handleClickOpen }) => {
    const db = usePolybase();
    const [user, setUser] = useState(null);
    React.useEffect(() => {
        if (user == null) {
            async function getUser() {
                const { data } = await db.collection('User').where("id", "==", feed.id || "").get();
                const record = data[0].data;
                setUser(new UserModel(record.id, record.name, record.image, record.status));
            }
            getUser();
        }
    });
    return (_jsxs("div", { style: { backgroundColor: "white", width: "800px", borderRadius: "20px", boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.11)" }, children: [_jsxs("div", { style: { padding: "30px" }, children: [_jsx("div", { style: { float: "left", marginRight: "18px", height: "140px" }, children: _jsx("img", { src: user?.image, style: { width: "80px", height: "80px", borderRadius: "40px", overflow: "hidden", backgroundColor: "#EEEEEE" }, onClick: () => handleClickOpen(feed.id || "") }) }), _jsxs("div", { style: { color: "#6C6C6C", fontSize: "14px" }, children: ["@", user?.name] }), _jsx("div", { style: { color: "#000000", fontSize: "18px" }, children: feed.content })] }), _jsx("div", { style: { width: "100%", textAlign: "center", marginBottom: "40px" }, children: feed.visible ? (_jsx("img", { src: feed.image, style: { width: "700px", height: "400px", objectFit: "contain" } })) :
                    (_jsxs("div", { style: { width: "100%", height: "300px", background: "#000000", marginTop: "40px", textAlign: "center", color: "#ffffff", paddingTop: "80px" }, children: ["This Photo was published on March 25, 2023. ", _jsx("br", {}), "Want to own your posts?", _jsx("div", { style: { width: "100%", marginTop: "100px" }, children: _jsx("button", { style: { background: "linear-gradient(90deg, #510CF5 0%, #99FCFD 97.83%)", borderRadius: "12px", color: "white", fontSize: "16px", width: "252px", height: "55px" }, onClick: () => {
                                        console.log('hi');
                                        if (user?.id) {
                                            location.href = `/profile/${user?.id}`;
                                        }
                                    }, children: "Subscribe" }) })] })) })] }));
};
