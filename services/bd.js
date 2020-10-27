require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const {Pool} = require('pg')

morgan.token('post', function (req, res) {
 return JSON.stringify(req.body)
})

const app = express()
app.use(express.json())
app.use(cors())


app.use(morgan(function (tokens, req, res) {
 return [
  tokens.method(req, res),
  tokens.url(req, res),
  tokens.status(req, res),
  tokens.res(req, res, 'content-length'), '-',
  tokens['response-time'](req, res), 'ms',
  tokens.method(req, res) === 'POST' ? tokens.post(req, res) : '',
 ].join(' ')
}))

pool = new Pool()

app.get('/services/bd', (request, response) => {
    pool.query('SELECT * FROM notes')
        .then(notes => {
            response.json(notes.rows)
        })
        .catch(err => console.log(err.stack))
})


app.post('/services/bd', (request, response) => {
    const body = request.body

    const noteContent = body.textoNota
    const important = body.importante || false
    
    if(noteContent === '') {
        console.log(body)
        return response.status(400).json({
            error: 'Empty note'
        })
    }

    const query = {
        text: 'INSERT INTO notes(text, important) values($1, $2) RETURNING *',
        values: [noteContent, important]
    }
    
    pool.query(query)
        .then(res => console.log(res.rows)) // Si el insert es exitoso imprime en la consola la tupla que se insertó.
        .catch(err => console.log(err.stack)) // Si el insert no es exitoso se imprime el mensaje de error en la consola.

})

app.delete('/services/bd/:id', (request, response) => {
    const id = Number(request.params.id)

    if (id == undefined || id <= 0) {
        response.status(400).end()
    }

    const query = {
        text: 'DELETE FROM notes WHERE id = $1 RETURNING *',
        values: [id]
    }

    pool.query(query)
        .then(res => response.send('Fila eliminada'))
        .catch(err => console.log(err.stack))
})

app.patch('/services/bd/:id', (req, res) => {
    const id = Number(req.params.id)
    const text = req.body.nuevoTexto

    if (id == undefined || id <= 0 || text == undefined) {
        res.status(400).end()
    }
    
    const query = {
        text: 'UPDATE notes SET text = $2 WHERE id = $1',
        values: [id, text]
    }
    pool.query(query)
        .then(res.send('Nota actualizada'))
        .catch(err => console.log(err.stack))
})


const PORT = process.env.SERVERPORT || 3001
app.listen(PORT, () => {
    console.log('HTTP Server serving requests to db running on port ', PORT)
})
