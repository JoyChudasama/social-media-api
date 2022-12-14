const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const userRoute = require('./routes/User');
const authRoute = require('./routes/Auth');
const postRoute = require('./routes/Post');
const commentRoute = require('./routes/Comment');

const app = express();

dotenv.config();

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log('MongoDB connected...')
    }
)

app.use(express.json())
app.use(helmet());
app.use(morgan('common'));

app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute);
app.use('/api/comments', commentRoute);

app.get('/', (req, res) => {
    res.send('Use /api routes')
})

app.listen(8800, () => {
    console.log("Server is running...")
})