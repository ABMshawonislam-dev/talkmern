import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import boximg from "../assets/boximg.png";
import { getDatabase, ref, onValue, remove } from "firebase/database";
import { useSelector } from "react-redux";

const BlockUser = () => {
  const db = getDatabase();
  const [blocklist, setBlockList] = useState([]);

  let userInfo = useSelector((state) => state.user.value);

  useEffect(() => {
    const blockRef = ref(db, "block/");
    onValue(blockRef, (snapshot) => {
      let arr = [];

      snapshot.forEach((item) => {
        if (
          item.val().blockbyid == userInfo.uid ||
          item.val().blockid == userInfo.uid
        ) {
          arr.push({ ...item.val(), bid: item.key });
        }
      });

      setBlockList(arr);
    });
  }, []);

  let handleUnBlock = (id) => {
    remove(ref(db, "block/" + id));
  };

  



  return (
    <div className="boxcontainer" style={{ marginTop: "50px" }}>
      <div className="titleholder">
        <h2>Block List</h2>
      </div>

      

      {blocklist.map((item) => (
        <div className="box">
          <div className="img">
            <img src={boximg} />
          </div>
          <div className="title">
            {item.blockbyid == userInfo.uid ? (
              <h3>{item.blockname}</h3>
            ) : (
              <h3>{item.blockbyname}</h3>
            )}
          </div>
          {item.blockbyid == userInfo.uid && (
            <Button onClick={() => handleUnBlock(item.bid)} variant="contained">
              Unblock
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default BlockUser;
