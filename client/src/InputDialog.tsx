import * as React from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import Close from './assets/close.svg'
import { truncateMiddle, formatValue } from "./Utils";
import { UserModel } from './Profile';
import { useFilePicker } from 'use-file-picker';
import { useEffect } from "react";
import { storeFiles } from "./FileUtils";
import { useAuth, usePolybase } from "@polybase/react";
import { ulid } from 'ulid';
import CircularProgress from '@mui/material/CircularProgress';

type InputDialogProps = {
  open: boolean,
  user?: UserModel,
  handleClose: () => void,
};

export const InputDialog = ({ props }: { props: InputDialogProps }) => {

  const [loading, setLoading] = React.useState<boolean>(false);
  const [image, setImage] = React.useState<string>("");
  const [content, setContent] = React.useState<string>("");

  const [openFileSelector, { plainFiles }] = useFilePicker({
    accept: 'image/*',
    multiple: false,
  });

  const db = usePolybase();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  }

  const onClick = async () => {
    await createPost();
    props.handleClose();
  };

  const createPost = async () => {
    const createdPost = await db.collection('Post')
      .create([ulid(), image, content, new Date().getTime()]);
    console.log(createdPost);
  }

  React.useEffect(() => {
    if (props.open) {
      if (plainFiles.length && image == "") {
        setLoading(true);
        storeFiles([plainFiles[0]]).then((filename: string) => {
          setImage(filename);
          setLoading(false);
        });
      }
    }
  }, [plainFiles]);

  return (
    <div>

      <Dialog open={props.open} onClose={props.handleClose}>
        <div style={{ width: "800px", height: "600px", paddingTop: "40px", paddingLeft: "40px", paddingBottom: "140px" }}>
          <div style={{ width: "100%", height: "80px", display: "flex" }}>
            <div style={{ marginRight: "18px" }}>
              <img src={props.user?.image} style={{ width: "80px", height: "80px", borderRadius: "40px", overflow: "hidden", backgroundColor: "#EEEEEE" }} />
            </div>
            <div>
              <div style={{ color: "#6C6C6C", fontSize: "24px" }}>@{props.user?.name}</div>
              <div style={{ color: "#000000", fontSize: "24px" }}>{truncateMiddle(formatValue(props.user?.id || ""), 20)}</div>
            </div>
          </div>
          <TextField
            id="standard-multiline-static"
            multiline
            rows={15}
            style={{ width: "520px", marginRight: "20px", marginTop: "22px" }}
            onChange={onChange}
          />

        </div>
        {/* Buttons */}
        <div style={{ position: "absolute", top: "25px", right: "25px" }}>
          <button style={{ height: "30px", width: "30px", padding: "0px" }} onClick={props.handleClose}><img src={Close} /></button>
        </div>
        <div style={{ position: "absolute", bottom: "100px", right: "40px" }}>
          <button
            style={{ height: "50px", fontSize: "24px", color: "#000000", padding: "0px" }}
            onClick={openFileSelector}
          ><u>
              UPLOAD Photo & Movie
            </u>
          </button>
        </div>
        <div style={{ position: "absolute", bottom: "30px", right: "40px" }}>
          <button
            style={{ width: "230px", height: "60px", background: "linear-gradient(90deg, #510CF5 0%, #99FCFD 100%)", borderRadius: "12px", fontSize: "18px", color: "#ffffff" }}
            onClick={onClick}
          >
            UPLOAD
          </button>
        </div>
        {
          loading ? (<div style={{ width: "100%", height: "100%", display: 'flex', alignItems: 'center', justifyContent: 'center', position: "absolute" }}>
            <CircularProgress />
          </div>) : null
        }
      </Dialog>
    </div>
  );
}