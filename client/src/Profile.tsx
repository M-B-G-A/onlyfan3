import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth, usePolybase } from "@polybase/react";
import { InputDialog } from "./InputDialog";

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

    const onClick = async () => {
        if (state?.publicKey != user?.id) {
            // subscribe
        } else {
            setOpen(true);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    React.useEffect(() => {
        if (user == null) {
            async function getUser() {
                const { data } = await db.collection('User').where("id", "==", userId || "").get();
                const record = data[0].data
                setUser(new UserModel(record.id, record.name, record.image, record.status));
            }
            getUser();
        }
    });

    return (
        <div>
            <div style={{ marginTop: "170px" }}>
                <div style={{ marginLeft: "200px", marginBottom: "10px" }}>
                    <div style={{ color: "#6C6C6C", fontSize: "24px", float: "left", marginRight: "200px" }}>
                        { user?.name }
                    </div>
                    <div style={{ color: "#6C6C6C", fontSize: "24px" }}>
                        <button 
                            style={{ background: "linear-gradient(90deg, #510CF5 0%, #99FCFD 97.83%)", borderRadius: "12px", color: "white", fontSize: "16px", width: "252px", height: "55px" }}
                            onClick={onClick}
                        >
                            { state?.publicKey != user?.id ? 
                                "Subscribe" : "UPLOAD"
                            }
                        </button>
                    </div>
                </div>

                <div style={{ width: "800px", background: "white", height: "202px", borderRadius: "15px" }}>

                    <div style={{ position: "absolute", top: "220px" }}>
                        <img src={user?.image} style={{ marginLeft: "20px", width: "160px", height: "160px", borderRadius: "80px", overflow: "hidden", backgroundColor: "#EEEEEE" }} />
                    </div>
                    <div style={{ paddingLeft: "200px", paddingRight: "40px", paddingTop: "30px" }}>
                        { user?.status }
                    </div>
                </div>
            </div>
            <InputDialog props={{open: open, handleClose: handleClose, user: user || undefined }}  />
        </div>
    );
};
