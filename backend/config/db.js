const mongoos = require('mongoose');

const connectDB = async () => {
    try {
        const connect = await mongoos.connect(process.env.MONGO_URI)
        console.log("connected to db", connect.connection.host)
    } catch (error) {
        console.log(error.message)
        process.exit()    
    }
}

module.exports = connectDB;