const $ = require('jquery');
require("expose-loader?$!jquery");

import './DisplayController';


import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import { format } from 'date-fns';

// loads the Icon plugin
UIkit.use(Icons);

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
        createdDate: '',
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

    x.createdDate = format(new Date(), 'MM/DD/YYYY H A');
    
    
    ToDoArray.push(x);
    // var result = format(
//     new Date(2014, 1, 11),
//     'MM/DD/YY'
//   )

    
    localStorage.setItem('ToDoArray', JSON.stringify(ToDoArray));
    $('#NewFormDiv').hide();
    Render();
})

const Render = () => {
    let parentClass = "uk-grid-small uk-child-width-expand@s uk-text-center uk-flex";
    let bodyClass = "uk-card uk-card-default uk-card-body uk-card-hover uk-margin";
    let badgeClass = "uk-card-badge uk-label";
    let gridClass = "uk-grid-small uk-child-width-expand@s uk-text-center uk-flex";
    $('#ToDoList').empty();
    ToDoArray.forEach(element => {
        $('#ToDoList').append(`
        <div class="${gridClass}">
            <div data-index="" >
                <div class="${parentClass}">
                    <div class="${bodyClass}">
                        <div class="${badgeClass}">${element.createdDate}</div>
                        <h3 class="uk-card-title">${element.title}</h3>
                        ${element.description}
                    </div>
                </div>
            </div>
        </div>`
        );
    });
}
Render();

// var result = format(
//     new Date(2014, 1, 11),
//     'MM/DD/YYYY'
//   )




$('#ClearLocalStorage').click(function() {
    if (localStorage.getItem('ToDoArray')) {
        localStorage.clear();
        
    }
    $('#ToDoList').empty();
        ToDoArray = [];
})