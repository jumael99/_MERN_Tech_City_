import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'
dotenv.config();

import connectDB from './config/db.js'
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(cors());

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.get('/', (req,res) => {
    res.send('Good morning!');
})

/* productRoute*/
/* /api/products dibo naki api/products evabe dibo */
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);


app.listen(port, ()=> {
    console.log(`Server running on port:${port} 🔥`);
})


