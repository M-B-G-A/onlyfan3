import { FeedModel } from './Feed';
import { UserModel } from './Profile';
import { ProfileDialog } from './ProfileDialog';
import AppIcon from './assets/app_icon.svg'
import { useAuth, usePolybase } from "@polybase/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Content = ({ feed, handleClickOpen }: { feed: FeedModel, handleClickOpen: (userId: string) => void }) => {

  const db = usePolybase();
  
  const [user, setUser] = useState<UserModel | null>(null);
  const navigate = useNavigate();

  const goToProfile = () => {
    if(user && user.id) {
      navigate(`/profile/${user.id}`);
    }
  }


  async function getUser() {
    const { data } = await db.collection('User').where("id", "==", feed.id || "").get();
    const record = data[0].data
    setUser(new UserModel(record.id, record.name, record.image, record.status));
  }

  React.useEffect(() => {
    if (user == null) {
      getUser();
    }
  }, []);

  return (
    <div style={{ backgroundColor: "white", width: "800px", borderRadius: "20px", boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.11)" }}>
      <div style={{ padding: "30px" }}>
        <div style={{ float: "left", marginRight: "18px", height: "140px" }}>
          <img src={user?.image} style={{ width: "80px", height: "80px", borderRadius: "40px", overflow: "hidden", backgroundColor: "#EEEEEE" }} onClick={() => handleClickOpen(user?.id || "")} />
        </div>
        <div style={{ color: "#6C6C6C", fontSize: "14px" }}>@{user?.name}</div>
        <div style={{ color: "#000000", fontSize: "18px" }}>
          {feed.content}
        </div>
      </div>
      <div style={{ width: "100%", textAlign: "center", marginBottom: "40px" }}>
        {
          feed.visible ? (<img src={feed.image} style={{ width: "700px", height: "400px", objectFit: "contain" }} />) :
            (
              <div style={{ width: "100%", height: "300px", background: "#000000", marginTop: "40px", textAlign: "center", color: "#ffffff", paddingTop: "80px" }} >
                This Photo was published on { new Date(feed.timestamp).toUTCString() } <br />
                Want to own your posts?
                <div style={{ width: "100%", marginTop: "100px" }}>
                  <button style={{ background: "linear-gradient(90deg, #510CF5 0%, #99FCFD 97.83%)", borderRadius: "12px", color: "white", fontSize: "16px", width: "252px", height: "55px" }} onClick={() => goToProfile()}>
                    Subscribe
                  </button>
                </div>

              </div>
            )

        }
      </div>
    </div>
  );
};