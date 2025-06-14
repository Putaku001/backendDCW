require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const connectDB = require('./config/db') // mejor separar conexión
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const cartRoutes = require('./routes/cartRoutes')
const adminRoutes = require('./routes/adminRoutes')
const serviceRoutes = require('./routes/serviceRoutes')
const consultationRoutes = require('./routes/consultationRoutes')
const technologyRoutes = require('./routes/technologyRoutes')
const orderRoutes = require('./routes/orderRoutes')

// Conectar a MongoDB
connectDB()

// Inicializar app
const app = express()

// Configuración CORS
const corsOptions = {
  origin: ['https://lab3dcw.netlify.app', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400 // 24 horas
}

app.use(cors(corsOptions))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Rutas
app.use('/api/auth', authRoutes)
app.use('/api/usuarios', userRoutes)
app.use('/api/carrito', cartRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/servicios', serviceRoutes)
app.use('/api/consultas', consultationRoutes)
app.use('/api/tecnologias', technologyRoutes)
app.use('/api/ordenes', orderRoutes)

// Ruta raíz
app.get('/', (req, res) => res.send('🌐 API funcionando correctamente'))

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err.stack)
  
  // Determinar el código de estado
  const statusCode = err.statusCode || 500
  
  // Determinar el mensaje de error
  const message = err.message || 'Error interno del servidor'
  
  // Enviar respuesta de error
  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? err : {},
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  })
})

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  })
})

// Servidor
const PORT = process.env.PORT || 5000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`)
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`)
})
