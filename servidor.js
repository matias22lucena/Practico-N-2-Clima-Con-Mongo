const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/climaDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB', err));

// Definir el esquema y el modelo de Mongoose
const busquedaSchema = new mongoose.Schema({
  ciudad: String,
  fecha: { type: Date, default: Date.now },
  clima: String
});

const Busqueda = mongoose.model('Busqueda', busquedaSchema);

// Ruta para obtener el clima y guardar en el historial
app.post('/clima', async (req, res) => {
  const { ciudad, clima } = req.body;

  // Guardar la búsqueda en la base de datos
  const nuevaBusqueda = new Busqueda({ ciudad, clima });
  await nuevaBusqueda.save();

  res.send({ message: 'Historial guardado' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
