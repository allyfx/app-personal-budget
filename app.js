class Expense {
	constructor(year, month, day, type, description, value) {
		this.year = year
		this.month = month
		this.day = day
		this.type = type
		this.description = description
		this.value = value
	}

	validateData() {
		for(let i in this) {
			if(this[i] == undefined || this[i] == "" || this[i] == null) {
				return false
			}
		}

		return true
	}
	
}

class Bd {

	constructor() {
		let id = localStorage.getItem('id')

		if(id === null) {
			localStorage.setItem('id', 0)
		}
	}

	getNextId() {
		let nextId = localStorage.getItem('id')
		return parseInt(nextId) + 1
	}

	record(d) {
		//Writes the new object to Webstorage's Localstorage in JSON format
		let id = this.getNextId()

		localStorage.setItem(id, JSON.stringify(d))
		localStorage.setItem('id', id)
	}

	retriveAllRecords() {
		//Array of expenses
		let expenses = Array()
		let id = localStorage.getItem('id')
		
		//Recover all expenses registered in local storage
		for(let i = 1; i <= id; i++) {
			//Recuperar a despesa
			let expense = JSON.parse(localStorage.getItem(i))

			/*
			If you do not have a literal object - it has been removed or something else -
			the loop will continue and will not execute the codes below
			*/
			if(expense === null) {
				continue
			}

			expense.id = i
			expenses.push(expense)
		}

		return expenses
	}

	search(expense) {
		let filteredExpenses = Array()
		filteredExpenses = this.retriveAllRecords() //Recover all data before filtering it

		//Apply filters
		//Year
		if(expense.year != ''){
			filteredExpenses = filteredExpenses.filter(d => d.year == expense.year)
		}
		//Month
		if(expense.month != ''){
			filteredExpenses = filteredExpenses.filter(d => d.month == expense.month)
		}
		//Day
		if(expense.day != ''){
			filteredExpenses = filteredExpenses.filter(d => d.day == expense.day)
		}
		//Type
		if(expense.type != ''){
			filteredExpenses = filteredExpenses.filter(d => d.type == expense.type)
		}
		//Description
		if(expense.description != ''){
			filteredExpenses = filteredExpenses.filter(d => d.description == expense.description)
		}
		//Value
		if(expense.value != ''){
			filteredExpenses = filteredExpenses.filter(d => d.value == expense.value)
		}

		return filteredExpenses
	}

	remove(id) {
		localStorage.removeItem(id)
		loadsExpensesList()
	}
}

let bd = new Bd()

function registerExpense() {
	//Variables that take HTML elements from their respective ids
	let year = document.getElementById('year')
	let month = document.getElementById('month')
	let day = document.getElementById('day')
	let type = document.getElementById('type')
	let description = document.getElementById('description')
	let value = document.getElementById('value')

	//Instancing a new object with a new expense
	let expense = new Expense(
		year.value,
		month.value,
		day.value,
		type.value,
		description.value,
		value.value
	)

	if(expense.validateData()) {
		bd.record(expense)
		//Success dialog

		//Changing the modal according to the result
		changeModal(
			"Expense has been successfully registered!",
			"Back",
			"btn btn-success",
			"Record inserted successfully",
			"modal-header text-success"
		)

		//Show modal
		$('#modalRegisterExpense').modal('show')

		//Resets the field values when the record is successful
		year.value = ""
		month.value = ""
		type.value = ""
		day.value = ""
		description.value = ""
		value.value = ""
		
	} else {
		//Error dialog

		//Changing the modal according to the result
		changeModal(
			"There are mandatory fields that have not been filled in!",
			"Go back and fix",
			"btn btn-danger",
			"Recording error",
			"modal-header text-danger"
		)

		//Show modal
		$('#modalRegisterExpense').modal('show')
	}
	
}

function changeModal(body, btn, btn_class, title, modal_class) {
	document.querySelector("div .modal-body").innerHTML = body
	document.getElementById("button").innerHTML = btn
	document.getElementById("button").className = btn_class
	document.getElementById("exampleModalLabel").innerHTML = title
	document.querySelector("div #modal-header").className = modal_class
}

function loadsExpensesList(expenses = Array(), filter=false) {
	if(expenses.length == 0 && filter == false) {
		expenses = bd.retriveAllRecords()
	}
	
	let expensesList = document.getElementById('expenseList')
	expensesList.innerHTML = ''

	//Cycle through the expenses array listing each expense dynamically
	expenses.forEach(function(d){
		//Create line (tr)
		let line = expensesList.insertRow()

		//Create column (td)
		line.insertCell(0).innerHTML = `${d.day}/${d.month}/${d.year}`
		//Ajustar o tipo
		switch(d.type){
			case '1': d.type = 'Food'
				break
			case '2': d.type = 'Education'
				break
			case '3': d.type = 'Recreation'
				break
			case '4': d.type = 'Health'
				break
			case '5': d.type = 'Transport'
				break
		}
		line.insertCell(1).innerHTML = d.type
		line.insertCell(2).innerHTML = d.description
		line.insertCell(3).innerHTML = d.value

		//Create the delete button
		let btn = document.createElement("button")
		btn.className = 'btn btn-danger'
		btn.innerHTML = '<i class="fas fa-times"></i>'
		btn.id = `id_expense_${d.id}`
		btn.onclick = function() {
			//Remove the expense
			let id = this.id.replace('id_expense_', '')
			bd.remove(id)

			//Define o modal
			changeModal(
				"The expense has been successfully removed!",
				"Back",
				"btn btn-success",
				"Expense removed",
				"modal-header text-success"
			)
			//Show modal
			$('#modalRegisterExpense').modal('show')
		}
		line.insertCell(4).append(btn)
	})
}

function searchExpense() {
	//Taking the entered values as filters
	let year = document.getElementById('year').value
	let month = document.getElementById('month').value
	let day = document.getElementById('day').value
	let type = document.getElementById('type').value
	let description = document.getElementById('description').value
	let value = document.getElementById('value').value

	let expense = new Expense(year, month, day, type, description, value)

	//Calls the search function and receives an array of filtered expenses in return
	let expenses = bd.search(expense)

	loadsExpensesList(expenses, true)
}