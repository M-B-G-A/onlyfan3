import AppIcon from './assets/app_icon.svg'

export const Content = () => {
    return (
        <div style={{ backgroundColor: "white", width: "800px", borderRadius: "20px", boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.11)" }}>
          <div style={{ padding: "30px" }}>
            <div style={{ float: "left", marginRight: "18px" }}>
              <img src="" style={{ width: "80px", height: "80px", borderRadius: "40px", overflow: "hidden", backgroundColor: "#EEEEEE" }} />
            </div>
            <div style={{ color: "#6C6C6C", fontSize: "14px" }}>@hellofans</div>
            <div style={{ color: "#000000", fontSize: "18px" }}>
              Hello Guys! <br/>
              This concert was impressive! <br/>
              I hope you enjoy this photo album too!
            </div>
          </div>
          <div>
            <img src={ AppIcon } style={{ width: "800px", height: "400px", backgroundColor: "#EEEEEE" }} />
          </div>
        </div>
    );
};