import React, { useEffect } from "react";
import Button from "@mui/material/Button";
import boximg from "../assets/boximg.png";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { getDatabase, ref, set, push, onValue } from "firebase/database";
import { useSelector } from "react-redux";

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

const GroupList = () => {
  const db = getDatabase();
  const [open, setOpen] = React.useState(false);
  const [groupname, setGroupName] = React.useState("");
  let [grouplist, setGroupList] = React.useState([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  let userInfo = useSelector((state) => state.user.value);

  useEffect(() => {
    const grouptRef = ref(db, "group");
    onValue(grouptRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (userInfo.uid != item.val().adminid) {
          arr.push({ ...item.val(), gid: item.key });
        }
      });
      setGroupList(arr);
    });
  }, []);

  let handleCreateGroup = () => {
    set(push(ref(db, "group/")), {
      groupname: groupname,
      adminname: userInfo.displayName,
      adminid: userInfo.uid,
    });
  };

  let handleGroupJoin = (item) => {
    set(push(ref(db, "grouprequest")), {
      adminid: item.adminid,
      adminname: item.adminname,
      groupname: item.groupname,
      groupid: item.gid,
      userid: userInfo.uid,
      username: userInfo.displayName,
    });
  };

  return (
    <div className="boxcontainer">
      <div className="titleholder">
        <h2>Group List</h2>
        <Button onClick={handleOpen} variant="contained">
          Create Group
        </Button>
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
          <Button onClick={() => handleGroupJoin(item)} variant="contained">
            Join
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
            Create Group
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <TextField
              onChange={(e) => setGroupName(e.target.value)}
              id="outlined-basic"
              label="Name"
              variant="outlined"
            />
            <Button onClick={handleCreateGroup} variant="contained">
              Create
            </Button>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default GroupList;
