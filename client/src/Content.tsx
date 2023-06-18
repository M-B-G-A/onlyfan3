import { FeedModel } from './Feed';
import { UserModel } from './Profile';
import { ProfileDialog } from './ProfileDialog';
import AppIcon from './assets/app_icon.svg'
import { useAuth, usePolybase } from "@polybase/react";
import React, { useState } from "react";

export const Content = ({ feed, handleClickOpen } : { feed: FeedModel, handleClickOpen: (userId: string) => void }) => {
  
  const db = usePolybase();
  const [user, setUser] = useState<UserModel | null>(null);

  React.useEffect(() => {
    if (user == null) {
        async function getUser() {
            const { data } = await db.collection('User').where("id", "==", feed.id || "").get();
            const record = data[0].data
            setUser(new UserModel(record.id, record.name, record.image, record.status));
        }
        getUser();
    }
});

  return (
        <div style={{ backgroundColor: "white", width: "800px", borderRadius: "20px", boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.11)" }}>
          <div style={{ padding: "30px" }}>
            <div style={{ float: "left", marginRight: "18px" }}>
              <img src={user?.image} style={{ width: "80px", height: "80px", borderRadius: "40px", overflow: "hidden", backgroundColor: "#EEEEEE" }} onClick={() => handleClickOpen(feed.id || "")} />
            </div>
            <div style={{ color: "#6C6C6C", fontSize: "14px" }}>@{user?.name}</div>
            <div style={{ color: "#000000", fontSize: "18px" }}>
              { feed.content }
            </div>
          </div>
          <div style={{ width: "100%", margin: "0 auto", textAlign: "center" }}>
            <img src={ feed.image } style={{ maxWidth: "800px", height: "400px", backgroundColor: "#EEEEEE", objectFit: "contain", textAlign: "center" }} />
          </div>
          </div>
    );
};