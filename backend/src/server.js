import express from 'express'
import authRoutes from './routes/authRoutes.js'
import authMiddleware from '../middleware/authMiddleware.js';
import todoRoutes from './routes/todoRoutes.js'
const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json())

app.get('/', (req, res) => {
  res.json({message: "Ok"})
})

/* Routes */
app.use('/auth', authRoutes)
app.use('/todos', authMiddleware, todoRoutes)
app.use('/reflections', authMiddleware, reflectionRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})