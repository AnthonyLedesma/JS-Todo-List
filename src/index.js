const $ = require('jquery');
require("expose-loader?$!jquery");


import './DisplayController';

//const ItemName = $('#ItemName');
//const ItemDescription = $('#ItemDescription');

//localStorage.setItem('myLibrary', JSON.stringify(myLibrary));

let ToDoArray = [];
if (localStorage.getItem('ToDoArray')) {
    ToDoArray = JSON.parse(localStorage.getItem('ToDoArray'));
}

/*
|
|Factory function ToDoItems will output ToDo list items as objects. 
|Objects should have the following properties.
|Title, Description, Due Date, Priority, Notes, and Checklist. 
|
|Priority 0-3 | Low to High
|
*/



function ToDoItems () {
    let obj = {
        title: '',
        description: '',
        dueDate: '',
        priority: 0,
        notes: '',
        checklist: ''
    };
    return obj;
}



$('#GenerateButton').click(function() {
    let x = ToDoItems(); 

    x.title = $('#ItemName').val();
    x.description = $('#ItemDescription').val();
    
    ToDoArray.push(x);

    
    localStorage.setItem('ToDoArray', JSON.stringify(ToDoArray));
    $('#NewFormDiv').hide();
    Render();
})

const Render = () => {
    $('#ToDoList').empty();
    ToDoArray.forEach(element => {
        $('#ToDoList').append(`<li>This item is ${element.title} and its described as ${element.description}</li>`);
    });
}
Render();