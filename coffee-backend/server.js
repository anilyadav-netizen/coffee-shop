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
const wishlistRoute = require("./routes/wishlistRoute")

app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ limit: "500mb", extended: true }));

app.use(cors(
    {origin:"*",
        methods:["GET","POST","PUT","DELETE"]
    }
))


app.use("/api/auth", authRoutes);
app.use("/api/coffee", coffeeRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);
app.use('/api/wishlist',wishlistRoute)
connectDB()


app.listen(Port,()=>{
    console.log(`connect now on port ${Port}`)
})