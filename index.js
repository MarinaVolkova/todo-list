function hello() {
  var time = document.getElementById('time');
  var data = document.getElementById('data');
  let d = new Date();
  let monthA = 'Января,Февраля,Марта,Апреля,Мая,Июня,Июля, Августа,Сентября,Октября,Ноября,Декабря'.split(',');
  let massage;
  if (new Date().getHours() >= 5 && new Date().getHours() < 10) {
    massage = " Доброе утро ";
  } else if (new Date().getHours() >= 10 && new Date().getHours() < 17) {
    massage = " Добрый день ";
  } else if (new Date().getHours() >= 17 && new Date().getHours() < 23) {
    massage = " Добрый вечер ";
  } else {
    massage = " Доброй ночи ";
    let img = document.getElementById('headimg');
    img.style = "display:inline;";
  }

  let timerId = setTimeout(function tick() {
    if (new Date().getMinutes() < 10) {
      time.innerHTML = (`Время  ${new Date().getHours()} 
    : 0${new Date().getMinutes()}<br> ${massage}!`);
    } else {
      time.innerHTML = (`Время  ${new Date().getHours()} 
    : ${new Date().getMinutes()} <br> ${massage}!`);
    }
    timerId = setTimeout(tick, 6000);
  }, 0);
  data.innerHTML = (`${d.getDate()} ${monthA[d.getMonth()]} ${d.getFullYear()} Год `)
}
hello();

let addButton = document.getElementById('add');
let inputTask = document.getElementById('new-task');
let unfinishTask = document.getElementById('completed_tasks');
let finishTask = document.getElementById('tasks');

//пусто или нет
function listCont() {
  let h4 = document.getElementById('tasksh4');
  let hh4 = document.getElementById('completed_tasksh4');
  if (finishTask.children.length > 1) {
    h4.style = "display:none;";
  } else {
    h4.style = "display:block;";
  }
  if (unfinishTask.children.length > 1) {
    hh4.style = "display:none;";
  } else {
    hh4.style = "display:block;";
  }
}

function createElement(task) {
  let listElement = document.createElement('li');
  let checkbox = document.createElement('input');
  checkbox.type = "checkbox";
  let label = document.createElement("label");
  label.innerText = task;
  let editInput = document.createElement("input");
  editInput.type = "text";
  let editButton = document.createElement("button");
  editButton.className = "edit";
  let deleteButton = document.createElement("button");
  deleteButton.className = "delete";

  editButton.innerHTML = "✎";
  deleteButton.innerHTML = "✖";

  listElement.appendChild(checkbox);
  listElement.appendChild(label);
  listElement.appendChild(editInput);
  listElement.appendChild(editButton);
  listElement.appendChild(deleteButton);
  return listElement;
}

function addTask() {
  if (inputTask.value) {
    let listElement = createElement(inputTask.value);
    // добавляем задание к списку дел
    unfinishTask.appendChild(listElement);
    //обнулим значение строки
    bindTask(listElement, finishTasks);
    inputTask.value = "";
  }
  listCont();
  save();
}
//прикрепим метод к кнопке добавления задания
addButton.onclick = addTask;
//удаление
function deleteTask() {
  //обращаемся к элементу li
  let listItems = this.parentNode;
  let ul = listItems.parentNode;
  ul.removeChild(listItems);
  listCont();
  save();
}
//изменение
function editTask() {
  let editButton = this;
  let listItems = this.parentNode;
  let label = listItems.querySelector('label');
  let input = listItems.querySelector('input[type=text]');
  let containsClass = listItems.classList.contains("editMode");

  if (containsClass) {
    input.style = 'display:none;';
    label.innerText = input.value;
    editButton.className = "edit";
    editButton.innerHTML = "✎";
    save();
  } else {
    input.style = "display:block;";
    input.value = label.innerText;
    editButton.className = "edit";
    editButton.innerHTML = "🗸";
  }
  listItems.classList.toggle("editMode");
}
//нажите на checkbox для зваершения задания
function finishTasks() {
  let listItems = this.parentNode;
  let checkbox = listItems.querySelector("input[type=checkbox]");
  finishTask.appendChild(listItems);
  bindTask(listItems, unfinishTasks);
  listCont();
  save();
}

//вернуть задачу при помощи checkbox
function unfinishTasks() {
  let listItems = this.parentNode;
  let checkbox = listItems.querySelector("input[type=checkbox]");
  unfinishTask.appendChild(listItems);
  bindTask(listItems, finishTasks);
  listCont();
  save();
}
// функция привязки метода к новому элементу во время создания
function bindTask(listElement, checkboxElem) {
  let checkbox = listElement.querySelector("input[type=checkbox]");
  let editButton = listElement.querySelector("button.edit");
  let deleteButton = listElement.querySelector("button.delete");

  checkbox.onclick = checkboxElem;
  editButton.onclick = editTask;
  deleteButton.onclick = deleteTask;
}

//сохранение задачи
function save() {
  // данные храним на локальном хранилище данных в браузере
  let unfinishTaskArr = [];
  let finishTaskArr = [];

  for (let i = 1; i < unfinishTask.children.length; i++) {
    unfinishTaskArr.push(unfinishTask.children[i].getElementsByTagName('label')[0].innerText);
  }

  for (let i = 1; i < finishTask.children.length; i++) {
    finishTaskArr.push(finishTask.children[i].getElementsByTagName('label')[0].innerText);
  }
  localStorage.removeItem('todo');
  localStorage.setItem('todo', JSON.stringify({ unfinishTask: unfinishTaskArr, finishTask: finishTaskArr }));
}

//загрузка
function load(){
  return JSON.parse(localStorage.getItem('todo'));
}

let data=load();
for(let i = 0; i< data.unfinishTask.length;i++){
  let listItems = createElement(data.unfinishTask[i],false);
  unfinishTask.appendChild(listItems);
  bindTask(listItems,finishTasks);
  listCont();
}
for(let i = 0; i< data.finishTask.length;i++){
  let listItems = createElement(data.finishTask[i],true);
  finishTask.appendChild(listItems);
  bindTask(listItems,unfinishTasks);
  listCont();
}