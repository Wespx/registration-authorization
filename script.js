'use strict';

const username = document.getElementById('username');
const registerUser = document.getElementById('registerUser');
const login = document.getElementById('login');
const list = document.getElementById('list');

let users = [];

const validName = function(str) {
	const nameReg = /^[-а-яА-ЯёЁ\s]+$/; 
	return nameReg.test(str);
};

const validLogin = function(str) {
    const nameReg = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,10}$/;
    return nameReg.test(str);
};

const validPassword = function(str) {
    const nameReg = /^[a-zA-Z0-9-_\.]{1,10}$/;
    return nameReg.test(str);
};

const findSubstr = function(str, target) {
    let count = 0;
    let pos = -1;
    while ((pos = str.indexOf(target, pos +1)) !== -1) {
        count++;
    }
    return count;
};

const render = function() {
    list.textContent = '';
    
    users.forEach(function(user) {
        const li = document.createElement('li');

        li.innerHTML = 'Имя: ' + user.firstName + ', Фамилия: ' + user.lastName +
                        ', зарегистрирован: ' + user.regDate + 
                        '<button class="deleteUser"></button>';
        
        list.append(li);

        const deleteUserButton = li.querySelector('.deleteUser');

        deleteUserButton.addEventListener('click', function() {
            users.splice(users.indexOf(user), 1);
            render();
        });
    });
};

const addNewUser = function() {
    const newUser = {};
    const options = {day: 'numeric', month: 'long', year: 'numeric',
                    hour: '2-digit', minute: '2-digit', second: '2-digit'};
    
    let askName;
    do {
        askName = prompt('Ваши имя и фамилия?', 'Василий Обломов');
        
        if (askName === null) {
            return;
        }
    } while (!validName(askName.trim()) || findSubstr(askName, ' ') !== 1);

    const firstName = askName.split(' ')[0];
    const lastName = askName.split(' ')[1];

    let askLogin;
    do {
        askLogin = prompt('Введите Ваш логин', '');
        
        if (askLogin === null) {
            return;
        }
    } while (!validLogin(askLogin.trim()));

    let askPassword;
    do {
        askPassword = prompt('Введите Ваш пароль', '');
        
        if (askPassword === null) {
            return;
        }
    } while (!validPassword(askPassword.trim()));

    newUser.firstName = firstName;
    newUser.lastName = lastName;
    newUser.login = askLogin;
    newUser.password = askPassword;
    newUser.regDate = new Date().toLocaleString('ru', options);

    users.push(newUser);
    render();
};

const auth = function() {
    let userFound = false;
    
    let askLogin;
    do {
        askLogin = prompt('Введите Ваш логин', '');

        if (askLogin === null) {
            return;
        }
    } while (!validLogin(askLogin.trim()));

    let askPassword;
    do {
        askPassword = prompt('Введите Ваш пароль', '');

        if (askPassword === null) {
            return;
        }
    } while (!validPassword(askPassword.trim()));
    
    users.forEach(function(user) {
        if (askLogin === user.login && askPassword === user.password) {
            username.textContent = user.firstName;
            userFound = true;
            return;
        }
    });

    if (!userFound) {
        alert('Пользователь не найден!');
    }
};


registerUser.addEventListener('click', addNewUser);
login.addEventListener('click', auth);

window.addEventListener('beforeunload', function() {
    const storageData = JSON.stringify(users);
    localStorage.setItem('usersData', storageData);
});

window.addEventListener('load', function() {
    const storageData = JSON.parse(localStorage.getItem('usersData'));
    
    if (storageData !== null) {
        users = storageData;
    }
    
    render();
});