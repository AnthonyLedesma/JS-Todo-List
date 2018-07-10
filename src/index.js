// Whole-script strict mode syntax
'use strict';
const $ = require('jquery');

require("expose-loader?$!jquery");

import {render} from './DisplayController.js';


import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import { format } from 'date-fns';

// loads the Icon plugin
UIkit.use(Icons);

let ToDoArray = [];
if (localStorage.getItem('ToDoArray')) {
    ToDoArray = JSON.parse(localStorage.getItem('ToDoArray'));
}

/*
|
|Factory function ToDoItems will output ToDo list items as objects. 
|Objects should have the following properties.
|Title, Description, Creation Date, Due Date, Priority, Notes, and Checklist. 
|
|Priority 0-2 | Low to High
|
*/

function ToDoItems () {
    let obj = {
        title: '',
        description: '',
        dueDate: '',
        createdDate: '',
        editedDate: 'N/A',
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
    x.createdDate = format(new Date(), 'MM/DD/YYYY h A');
    ToDoArray.push(x);
    localStorage.setItem('ToDoArray', JSON.stringify(ToDoArray));
    $('#NewFormDiv').hide();
    render(ToDoArray);
})

render(ToDoArray);




$('#ClearLocalStorage').click(function() {
    if (localStorage.getItem('ToDoArray')) {
        localStorage.clear();
        
    }
    $('#ToDoList').empty();
    ToDoArray = [];
})