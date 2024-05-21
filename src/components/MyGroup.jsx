import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import boximg from "../assets/boximg.png";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
} from "firebase/database";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const MyGroup = () => {
  const db = getDatabase();
  let [grouplist, setGroupList] = useState([]);
  let [groupMemberlist, setGroupMemberList] = useState([]);
  let [groupjoinreqlist, setGroupJoinReqList] = useState([]);
  const [open2, setOpen2] = React.useState(false);
  const handleOpen2 = (info) => {
    setOpen2(true);

    const groupMemberstRef = ref(db, "groupmember");
    onValue(groupMemberstRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (info.gid == item.val().groupid) {
          arr.push(item.val());
        }
      });
      setGroupMemberList(arr);
    });
  };
  const handleClose2 = () => setOpen2(false);
  let userInfo = useSelector((state) => state.user.value);
  const [open, setOpen] = React.useState(false);
  const handleOpen = (info) => {
    setOpen(true);
    const grouptRef = ref(db, "grouprequest");
    onValue(grouptRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        // console.log(info, item.val().groupid);
        if (info.gid == item.val().groupid) {
          arr.push({ ...item.val(), grid: item.key });
        }
      });
      setGroupJoinReqList(arr);
    });
  };
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const grouptRef = ref(db, "group");
    onValue(grouptRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (userInfo.uid == item.val().adminid) {
          arr.push({ ...item.val(), gid: item.key });
        }
      });
      setGroupList(arr);
    });
  }, []);

  let handleMemberAccept = (item) => {
    console.log(item);
    set(push(ref(db, "groupmember")), {
      ...item,
    }).then(() => {
      remove(ref(db, "grouprequest/" + item.grid));
    });
  };

  return (
    <div className="boxcontainer" style={{ marginTop: "50px" }}>
      <div className="titleholder">
        <h2>My Group</h2>
        <Button variant="contained">Create Group</Button>
      </div>

      {grouplist.map((item) => (
        <div className="box">
          <div className="img">
            <img src={boximg} />
          </div>
          <div className="title">
            <p>Admin: {item.adminname}</p>
            <h3>{item.groupname}</h3>
          </div>
          <Button onClick={() => handleOpen(item)} variant="contained">
            Request
          </Button>
          <Button onClick={() => handleOpen2(item)} variant="contained">
            Members
          </Button>
        </div>
      ))}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Group Request
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <List
              sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
            >
              {groupjoinreqlist.map((item) => (
                <>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar
                        alt="Remy Sharp"
                        src="/static/images/avatar/1.jpg"
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.username}
                      secondary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: "inline" }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {item.username}
                          </Typography>
                          {`— wants to join ${item.groupname}`}
                          <br />
                          <Button
                            onClick={() => handleMemberAccept(item)}
                            variant="contained"
                          >
                            Accept
                          </Button>

                          <Button variant="contained" color="error">
                            Delete
                          </Button>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </>
              ))}
            </List>
          </Typography>
        </Box>
      </Modal>

      <Modal
        open={open2}
        onClose={handleClose2}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Group Member
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <List
              sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
            >
              {groupMemberlist.map((item) => (
                <>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar
                        alt="Remy Sharp"
                        src="/static/images/avatar/1.jpg"
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.username}
                      secondary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: "inline" }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {item.username}
                          </Typography>
                          {`— wants to join ${item.groupname}`}
                          <br />
                          <Button
                            onClick={() => handleMemberAccept(item)}
                            variant="contained"
                          >
                            Accept
                          </Button>

                          <Button variant="contained" color="error">
                            Delete
                          </Button>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </>
              ))}
            </List>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default MyGroup;
