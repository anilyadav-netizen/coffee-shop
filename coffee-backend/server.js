require("dotenv").config()
const express = require("express")
const dns = require("dns")
const cors = require("cors")
const app = express()
dns.setServers(["1.1.1.1","8.8.8.8"])

const Port= process.env.PORT || 5000

const connectDB = require("./config/connect.db")
const authRoutes = require("./routes/authRoutes");
const coffeeRoutes = require("./routes/coffeeRoutes");
const cartRoutes = require("./routes/cartRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

app.use(express.json())

app.use(express.urlencoded({extended:true,limit:"200mb"}))

app.use(cors(
    {origin:"*",
        methods:["GET","POST","PUT","DELETE"]
    }
))


app.use("/api/auth", authRoutes);
app.use("/api/coffee", coffeeRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);
connectDB()


app.listen(Port,()=>{
    console.log(`connect now on port ${Port}`)
})