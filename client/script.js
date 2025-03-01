
const InputName = document.querySelector('.Name-i')
const InputAge = document.querySelector('.Age-i')
const InputCity = document.querySelector('.City-i')
const postUserBtn = document.querySelector('.addUserBtn')
const UserList = document.querySelector(".list")
const SearchInput = document.querySelector(".searchBlock input")

const getDataFunction = async url => {
	const getData = async url => {
		const res = await fetch(url)
		const json = await res.json()
		return json
	}

	try {
		const data = await getData(url)
		return data
	} catch (error) {
		console.log(`Произошла ошибка в getData, ${error.message}`)
	}
}

// Добавление пользователя
const postDataFunction = async (url, obj) => {
	const postData = async (url, obj) => {
		const res = await fetch(url, {
			method: 'POST',
			body: JSON.stringify(obj),
			headers: { 'Content-type': 'application/json; charset=UTF-8' }
		})
		const json = await res.json()
		return json
	}

	try {
		const data = await postData(url, obj)
		return data
	} catch (error) {
		console.log(`Произошла ошибка в postData, ${error.message}`)
	}
}

const DeleteDataFunction = async (url, id) => {
	const patchData = async (url, id) => {
		const res = await fetch(`${url}`, {
			method: 'DELETE',
			body: JSON.stringify({id}),
			headers: { 'Content-type': 'application/json; charset=UTF-8'}
		})

		if (!res.ok) throw new Error(`Ошибка при запросе ${res.status}`)

		const text = await res.text()
		try {
			return JSON.parse(text)
		} catch (err) {
			throw new Error('сервер вернул не JSON')
		}
	}
	try {
		const data = await patchData(url, id)
		console.log('Пользователь изменён')
		return data
	} catch (error) {
		console.log(`Произошла ошибка в patchData, ${error.message}`)
	}
}

document.addEventListener("DOMContentLoaded",async () => {
	let data = JSON.parse(await getDataFunction('http://localhost:3000/getUsers'))
	data.forEach(user => {
		console.log(user)
		UserList.insertAdjacentHTML(
			`beforeend`,
			`<li class="listElement">
						<span>${user.name}, ${user.age}, ${user.city}</span>
						<div class="deleteBtn">
							<img class="deleteIMG" src="imgs/delete.png">
						</div>
					</li>`
		)
		let listElement = document.querySelector('ul').lastChild
		listElement.querySelector('.deleteBtn').addEventListener('click', async () => {
			listElement.remove()
			await DeleteDataFunction('http://localhost:3000/delUser', user.id)
		})
	})
})

postUserBtn.addEventListener('click', async () => {
	let data = JSON.parse(await getDataFunction('http://localhost:3000/getUsers')).map(el => el = el.id)
	if(InputName.value.length == 0 || InputAge.value.length == 0 || InputCity.value.length == 0 || isNaN(InputAge.value)){
		alert('Вы не ввели одно из полей для загрузки пользователя или ввели неправильно')
	}
	else{
	let userObj = {id : Math.max(...data)+1, name : InputName.value, age: Number(InputAge.value), city: InputCity.value}
	console.log(await postDataFunction('http://localhost:3000/addUser', userObj))	
	}
})

SearchInput.addEventListener("keypress",async (e) => {
	if(e.code == "Enter"){
		let data = JSON.parse(await getDataFunction(`http://localhost:3000/search?query=${SearchInput.value}`))
		console.log(data)
		UserList.innerHTML = ""
		data.forEach(user => {
			console.log(user)
			UserList.insertAdjacentHTML(
				`beforeend`,
				`<li class="listElement">
							<span>${user.name}, ${user.age}, ${user.city}</span>
							<div class="deleteBtn">
								<img class="deleteIMG" src="imgs/delete.png">
							</div>
						</li>`
			)
		})
		let listElement = document.querySelector('ul').lastChild
		listElement.querySelector('.deleteBtn').addEventListener('click', async () => {
			listElement.remove()
			await DeleteDataFunction('http://localhost:3000/delUser', user.id)
		})
	}
})
