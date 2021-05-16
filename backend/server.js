const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//set up global middlewares
app.use(cors());
app.use(express.json()); //bodyparser was doing that before.

//DatabaseThings
const uri = process.env.ATLAS_URI;

mongoose.connect(uri, {
    useNewUrlParser : true, 
    useCreateIndex: true,
    useUnifiedTopology:true,
    useFindAndModify:false, //you should look at this. 
});

const connection = mongoose.connection;
connection.once ('open' , () => {
    console.log("mongoDB database connection established succesfully");
});

//
const exercisesRouter = require('./routes/exercises');
const usersRouter = require('./routes/users');

app.use('/exercises', exercisesRouter);
app.use('/users', usersRouter);

//Start!
app.listen(port, () => {
    console.log('server is running on port: ' + port);
})





//SOCKET OPERATION STARTED!


const Document = require('./models/textEditor/document.model');



const io = require('socket.io')(3001, {
    cors: {
        origin: 'http://localhost:2000',
        methods: ['GET', 'POST']
    }
})

io.on("connection" , socket => {

    socket.on("get-document",async documentId=> {
        const document = await findOrCreateDocument(documentId);

        socket.join(documentId) //we are creating room.
        socket.emit("load-document",document.data);  //its only running once, no need to add to

        socket.on("send-changes" , delta => {
            socket.broadcast.to(documentId).emit("receive-changes",delta); //sent data to everyone except sender if there is no "to" function.
        });
    
        socket.on("save-document", async data => {
            await Document.findByIdAndUpdate(documentId, {data});
        })

        socket.on('disconnect', function(){
            console.log('user disconnected',documentId);
        });

    });
   
  
    console.log("connected!", socket.id)
});

const defaultValue = "";
async function findOrCreateDocument(id){
    if(id == null) return "";

    const document = await Document.findById(id);

    if(document) return document;

    return await Document.create({_id: id , data: defaultValue});
}