import express from 'express'
import authRoutes from './routes/authRoutes.js'
import authMiddleware from '../middleware/authMiddleware.js';
import todoRoutes from './routes/todoRoutes.js'
import reflectionRoutes from './routes/reflectionRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json())

app.get('/', (req, res) => {
  res.json({message: "Foo"})
})

/* Routes */
app.use('/api/auth', authRoutes) // register, login
app.use('/api/todos', authMiddleware, todoRoutes) //
app.use('/api/reflections', authMiddleware, reflectionRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})