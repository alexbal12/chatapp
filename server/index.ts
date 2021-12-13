import * as express from "express";
import { firestore, rtdb } from "./db";
import { nanoid } from "nanoid";
import * as cors from "cors";

(function () {
  const port = 3000;
  const app = express();
  app.use(express.json());
  app.use(cors());
  const userCollection = firestore.collection("users");
  const roomCollection = firestore.collection("rooms");
  //signup
  app.post("/signup", function (req, res) {
    const email = req.body.email;
    const nombre = req.body.nombre;
    userCollection
      .where("email", "==", email)
      .get()
      .then((searchResponse) => {
        if (searchResponse.empty) {
          userCollection
            .add({
              email: email,
              nombre,
            })
            .then((newUserRef) => {
              res.json({
                id: newUserRef.id,
                new: true,
              });
            });
        } else {
          res.status(400).json({
            message: "user already exists",
          });
        }
      });
  });

  //authentication
  app.post("/auth", (req, res) => {
    //const email = req.body.email;
    const { email } = req.body;
    userCollection
      .where("email", "==", email)
      .get()
      .then((searchResponse) => {
        if (searchResponse.empty) {
          res.status(404).json({
            message: "not found",
          });
        } else {
          res.json({
            id: searchResponse.docs[0].id,
          });
        }
      });
  });
  app.post("/rooms", (req, res) => {
    const { userId } = req.body;
    userCollection
      .doc(userId.toString())
      .get()
      .then((doc) => {
        if (doc.exists) {
          const roomRef = rtdb.ref("/rooms/" + nanoid());
          roomRef
            .set({
              messages: [],
              owner: userId,
            })
            .then(() => {
              const roomLongId = roomRef.key;
              const roomId = 1000 + Math.floor(Math.random() * 999);
              roomCollection
                .doc(roomId.toString())
                .set({
                  rtdbRoomId: roomLongId,
                })
                .then(() => {
                  res.json({
                    id: roomId.toString(),
                  });
                });
            });
        } else {
          res.status(401).json({
            message: "no existis",
          });
        }
      });
  });
  app.get("/rooms/:roomId", (req, res) => {
    const { userId } = req.query;
    const { roomId } = req.params;
    userCollection
      .doc(userId.toString())
      .get()
      .then((doc) => {
        if (doc.exists) {
          roomCollection
            .doc(roomId)
            .get()
            .then((snap) => {
              const data = snap.data();
              res.json(data);
            });
        } else {
          res.status(401).json({
            message: "no existis",
          });
        }
      });
  });
  app.post("/messages/:roomId", function (req, res) {
    const { roomId } = req.params;
    const chatRoomRef = rtdb.ref(`/rooms/${roomId}/messages`);
    chatRoomRef.push(req.body, function () {
      res.json("todo ok");
    });
  });
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
})();
