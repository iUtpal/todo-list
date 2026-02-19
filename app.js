const addTodoBtn = document.getElementById('addTodoBtn'); //add button
const todoInput = document.getElementById('todoInput'); //input field
const todo_list = document.querySelector('.todo-list');//list for html
const items_left = document.querySelector('.items-left')//left items text box
const clearCompletedBtn = document.getElementById('clearCompletedBtn')//clear complete button
const filterBtn = document.querySelectorAll('.filter-btn') //"All" "Active" and "Completed"
let todos = []; //blank list to store the obejct from the local storage
let todoString = localStorage.getItem('todos'); //tring from localstorage 

let currentFilter = "All"

//checking if the todoString from localStorage is emty or not
todos = todoString ? JSON.parse(todoString) : [];

//display function to display the saved localStorage
function display() {
    let filteredTodos = todos

    if (currentFilter == "Completed") {
        filteredTodos = todos.filter(todo => {
            return todo.status;
        })
    }

    if (currentFilter == "Active") {
        filteredTodos = todos.filter(todo => {
            return !todo.status;
        })
    }

    todo_list.innerHTML = ""
    let todo_string = ""
    for (const todo of filteredTodos) {
        todo_string += `<li id=${todo.id} class="todo-item ${todo.status ? "checked" : ""}">
                    <input type="checkbox" class="todo-checkbox" ${todo.status ? "checked" : ""}>
                    <span class="todo-text">${todo.title}</span>
                    <button class="delete-btn">x</button>
                </li>`;
    }
    todo_list.innerHTML = todo_string

    const counter = todos.filter(todo => !todo.status).length
    items_left.textContent = `${counter} ${counter === 1 ? "item" : "items"}
    left`
}

//initial call
display();


//Handle when "Add" button is clicked
addTodoBtn.addEventListener('click', () => {
    if (todoInput.value.trim() == "") {
        alert("Empty input. Error!")
        return;
    }
    let todo = {
        "id": crypto.randomUUID(),
        "title": todoInput.value,
        "status": false
    };
    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
    todoInput.value = "";
    display();  //calling to get the updated todos-list after entering the new todo
})

todo_list.addEventListener('click', (e) => {
    //Handle when delete button is clicked
    if (e.target.tagName == "BUTTON") {
        const confirmation = confirm("Do you want to delate?")
        if (confirmation) {
            todos = todos.filter(todo => {
                return todo.id != e.target.parentNode.id
            })
            localStorage.setItem("todos", JSON.stringify(todos))
            display()
        }
    }


    //Handle when checkbox is clicked
    if (e.target.tagName == "INPUT") {
        if (e.target.checked) {
            e.target.parentNode.classList.add('checked');
            todos = todos.map(todo => {
                if (todo.id == e.target.parentNode.id) {
                    return { ...todo, status: true }
                }
                else {
                    return todo
                }
            })
            localStorage.setItem('todos', JSON.stringify(todos))
        }
        else {
            e.target.parentNode.classList.remove('checked');
            todos = todos.map(todo => {
                if (todo.id == e.target.parentNode.id) {
                    return { ...todo, status: false }
                }
                else {
                    return todo
                }
            })
            localStorage.setItem('todos', JSON.stringify(todos))
        }
        display()
    }
})

//Handle "Clear Completed" button
clearCompletedBtn.addEventListener('click', () => {
    todos = todos.filter(todo => {
        return todo.status == false
    })
    localStorage.setItem('todos', JSON.stringify(todos))
    display()
})

//handle three buttons ---> All, Active, Completed

filterBtn.forEach(buttons => {
    buttons.addEventListener('click', (e) => {

        //removing the "active" class from all the buttons
        filterBtn.forEach(btn => {
            btn.classList.remove("active")
        })

        if (e.target.textContent == "All") {
            currentFilter = "All"
            e.target.classList.add('active')
            display()
        }
        if (e.target.textContent == "Active") {
            currentFilter = "Active"
            e.target.classList.add('active')
            display()
        }
        if (e.target.textContent == "Completed") {
            currentFilter = "Completed"
            e.target.classList.add('active')
            display()
        }
    })
})
