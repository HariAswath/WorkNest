import express from "express";
const app = express()

app.use(express.json({ limit: "50mb"}));
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.use(
    cors({
        origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowHeaders: ["Content-Type", "Authorization"],
    }),
)
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/insta', (req, res) => {
  res.send('Hello hari!')
})

export default app;