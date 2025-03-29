const express = require('express')
const path = require('path')
const morgan = require('morgan')
const fs = require('fs')
const cors = require('cors')

const PORT = 3000
const app = express()

// функция получения пути
const getPath = filename => path.join(__dirname, 'public', `${filename}.html`)

// миддлвейр для подключения статических файлов (css, js, изображения и т.д.)
app.use(express.static(path.join(__dirname, 'public')))
// логирующий morgan миддлвейр
app.use(morgan(':method :url :status'))
// миддлвейр для парсинга входящего запроса
app.use(express.json())

// cors
app.use(
	cors({
		methods: ['GET', 'POST', 'PATCH', 'DELETE'],
	})
)

// параметрический роут
app.get('/user-info/:id', (req, res) => {
	const userId = parseInt(req.params.id)
	if (userId === 1) {
		res.send(`
			Пользователь с id :${userId}, Иван
			`)
	} else if (userId === 2) {
		res.send(`
			Пользователь с id :${userId}, Ибрагим
			`)
	} else {
		res.status(404).send('Пользователь не найден')
	}
})

// query роут
// /search?query=...
app.get('/search', (req, res) => {
	const query = req.query.query.toLowerCase()
	let db = JSON.parse(fs.readFileSync(path.join(__dirname, 'db', 'db.json'), 'utf-8'))
	let result
	if(isNaN(query)){
	result = db.filter(el => (el.name.toLowerCase().includes(query) || el.city.toLowerCase().includes(query)))
	}
	else{
	result = db.filter(el => `${el.age}`.includes(query))
	}
	res.json(JSON.stringify(result))
})

//! Работа с пользователями
app.get('/getUsers', (req, res) => {
	try {
		console.log('jopa')
		const users = fs.readFileSync(path.join(__dirname, 'db', 'db.json'), 'utf-8')
		res.json(users)
	} catch (error) {
		console.log('Ошибка при получении пользователей', error)
		res.send('Ошибка при получении пользователей', error)
	}
})
app.get('/getUsers/:id', (req, res) => {
	try {
		const { id } = req.params
		const users = JSON.parse(
			fs.readFileSync(path.join(__dirname, 'db', 'db.json'), 'utf-8')
		)
		const user = users.find(user => user.id == id)
		res.json(user)
	} catch (error) {
		console.log('Ошибка при получении пользователя', error)
		res.send('Ошибка при получении пользователя', error)
	}
})
app.post('/addUser', (req, res) => {
	try {
		const user = req.body
		const users = JSON.parse(
			fs.readFileSync(path.join(__dirname, 'db', 'db.json'), 'utf-8')
		)
		users.push(user)
		fs.writeFileSync(path.join(__dirname, 'db', 'db.json'), JSON.stringify(users))
		res.send(`Пользователь ${user} успешно добавлен`)
	} catch (error) {
		console.log('Ошибка при добавлении пользователя', error)
		res.send('Ошибка при добавлении пользователя', error)
	}
})

app.delete('/delUser', (req,res) => {
	try{
		const id = req.body.id
		const users = JSON.parse(
			fs.readFileSync(path.join(__dirname, 'db', 'db.json'), 'utf-8')
		)
		users.splice(users.findIndex(el => el.id == id ), 1,)
	
	fs.writeFileSync(path.join(__dirname, 'db', 'db.json'), JSON.stringify(users))
	res.send(`Пользователь ${user} успешно удален`)
	} catch (error) {
		console.log('Ошибка при удалении пользователя', error)
		res.send('Ошибка при удалении пользователя', error)
	}
})

// обработка ошибки 404
app.use((req, res) => {
	res.status(404).sendFile(getPath('404'))
})

app.listen(PORT, () => {
	console.log(`server is listening port: ${PORT}`)
})
