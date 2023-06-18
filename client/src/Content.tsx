import { FeedModel } from './Feed';
import { ProfileDialog } from './ProfileDialog';
import AppIcon from './assets/app_icon.svg'

export const Content = ({ feed, handleClickOpen } : { feed: FeedModel, handleClickOpen: (userId: string) => void }) => {
  return (
        <div style={{ backgroundColor: "white", width: "800px", borderRadius: "20px", boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.11)" }}>
          <div style={{ padding: "30px" }}>
            <div style={{ float: "left", marginRight: "18px" }}>
              <img src="" style={{ width: "80px", height: "80px", borderRadius: "40px", overflow: "hidden", backgroundColor: "#EEEEEE" }} onClick={() => handleClickOpen(feed.id || "")} />
            </div>
            <div style={{ color: "#6C6C6C", fontSize: "14px" }}>@{feed.name}</div>
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