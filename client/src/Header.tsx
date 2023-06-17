import { AppBar, Toolbar } from '@mui/material';
import AppIcon from './assets/app_icon.svg'

export const Header = () => {
    const onClickMy = () => {
      console.log('onClickMy');
    };

    const onClickFeed = () => {
      console.log('onClickFeed');
    };

    const onClickWallet = () => {
      console.log('onClickWallet');
    };

    return (
        <AppBar
            position="static"
            elevation={0}
            style={{
                backgroundColor: "#ffffff"
            }}
        >
            <Toolbar style={{
                height: "100px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between"
            }}>
                <div style={{
                    display: "flex",
                    height: "100px",
                    flexDirection: "row",
                    alignItems: "center"
                }}>
                    <img src={AppIcon} style={{ height: "45px", width: "200px" }} />
                </div>
                <div>
                  <button
                    onClick={() => {
                      onClickMy();
                    }}
                  >
                    MY
                  </button>
                  <button
                    onClick={() => {
                      onClickFeed();
                    }}
                  >
                    FEED
                  </button>
                  <button
                    onClick={() => {
                      onClickWallet();
                    }}
                  >
                    0x1234...ffff
                  </button>
                </div>
            </Toolbar>
        </AppBar>
    );
};