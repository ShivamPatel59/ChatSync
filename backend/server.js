const express = require('express');
const chats = require('./data/data');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();


connectDB();

app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send('Server is ready');
    }
);
app.get("/api/chats", (req, res) => {
    res.send(chats);
});

app.use('/api/user', require('./routes/userRoutes'))
app.use('/api/chat', require('./routes/chatRoutes'))

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    });