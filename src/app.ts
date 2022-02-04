import { ExpressPeerServer } from "peer";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { v4 } from "uuid";
function nicelog(msg: string) {console.log('\x1b[36m%s\x1b[0m', msg)}

const PORT = 4005;

const app = express();
app.use(cors());
app.get("/create/room", (req, res)=> {
    res.json({id: v4()})
})

const listener = app.listen(PORT, ()=> {
    nicelog(`Server listening on port ${PORT} ...`);
})

const io = new Server(listener, {
    cors: {
        origin: "*",    
    }
});

// ON A NEW CLIENT CONNECTION
io.on("connection", (socket)=>{
    socket.on("join-room", (roomId, userId)=>{
        // todo lo que pase con roomId se enviara a este socket 
        socket.join(roomId)
        // enviar el mensaje al room en el que estamos
        socket.broadcast.to(roomId).emit("user-connected", userId)
    })
    nicelog("A user has connected")
})


const peerServer = ExpressPeerServer(listener, {
    path: "/myapp"
});
app.use("/peerjs", peerServer);
