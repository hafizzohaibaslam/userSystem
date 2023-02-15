const mongoose = require('mongoose');

const db ='mongodb://Essay:12345@ac-llpf2c5-shard-00-00.7fdnxz6.mongodb.net:27017,ac-llpf2c5-shard-00-01.7fdnxz6.mongodb.net:27017,ac-llpf2c5-shard-00-02.7fdnxz6.mongodb.net:27017/EssayProject?ssl=true&replicaSet=atlas-1037xh-shard-0&authSource=admin&retryWrites=true&w=majority'


mongoose.connect(db)
.then(()=>{
    console.log('connected to DB successfully...')
})
.catch((error)=>{
    console.log(error);
})