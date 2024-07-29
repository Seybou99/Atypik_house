import { Server, Socket } from "socket.io";

const io = new Server({
  cors: {
    origin: "http://localhost:3000", // Votre URL front-end
  },
});

interface OnlineUser {
  userId: string;
  socketId: string;
}

let onlineUsers: OnlineUser[] = [];

const addUser = (userId: string, socketId: string) => {
  const userExists = onlineUsers.find((user) => user.userId === userId);
  if (!userExists) {
    onlineUsers.push({ userId, socketId });
  }
};

const removeUser = (socketId: string) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userId: string): OnlineUser | undefined => {
  return onlineUsers.find((user) => user.userId === userId);
};

io.on("connection", (socket: Socket) => {
  console.log("A user connected:", socket.id);

  socket.on("newUser", (userId: string) => {
    addUser(userId, socket.id);
    console.log(`User connected: ${userId}, Socket ID: ${socket.id}`);
  });

  socket.on("sendMessage", ({ receiverId, data }: { receiverId: string; data: any }) => {
    const receiver = getUser(receiverId);
    if (receiver) {
      io.to(receiver.socketId).emit("getMessage", data);
    } else {
      console.log(`User not found: ${receiverId}`);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
    removeUser(socket.id);
  });
});

io.listen(4000).on("listening", () => {
  console.log("Socket.IO server is listening on port 4000");
});
