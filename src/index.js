// Whole-script strict mode syntax
'use strict';
const $ = require('jquery');
require("expose-loader?$!jquery");

import './DisplayController';


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
    Render(ToDoArray);
})

const Render = (ToDoArray) => {
    let parentClass = "uk-grid-small uk-child-width-expand@s uk-text-center uk-flex";
    let badgeClass = "uk-card-badge";
    let bodyPriorityClass = '';
    let gridClass = "uk-grid-small uk-child-width-expand@s uk-text-center uk-flex";
    let editClass = "uk-button uk-button-text uk-align-right";

    $('#ToDoList').empty();
    ToDoArray.forEach((element,index) => {
        console.log(`the priority of the element is ${element.priority}`);
        if (parseInt(element.priority) === 0) {bodyPriorityClass = "uk-card uk-card-default uk-card-body uk-card-hover uk-margin";}
        else if (parseInt(element.priority) === 1) {bodyPriorityClass = "uk-card uk-card-primary uk-card-body uk-card-hover uk-margin";}
        else if (parseInt(element.priority) === 2) {bodyPriorityClass = "uk-card uk-card-secondary uk-card-body uk-card-hover uk-margin";}
        $('#ToDoList').append(`
        <div class="${gridClass}">
            <div>
                <div class="${parentClass}">
                    <div class="${bodyPriorityClass}">
                        <div id="date-badge-${index}" class="${badgeClass}">Created: ${element.createdDate}<br />Edited: ${element.editedDate}</div>
                        <h3 id="item-title-${index}" class="uk-card-title">${element.title}</h3>
                        <p id="description-tag-${index}">${element.description}</p>
                        <p id="notes-tag-${index}">${element.notes}</p>
                        <p id="priority-tag-${index}">Priority ${element.priority}</p>
                        <div id="edit-${index}" class="${editClass}" uk-toggle="target: #modal${index}">Edit</div>
                    </div>
                </div>
            </div>
        </div>`
        );
        
        $('#ToDoList').append(`<div id="modal${index}" uk-modal><div class="uk-modal-dialog uk-modal-body">
            <h2 class="uk-modal-title">${element.title}</h2>
            <span class="uk-label">Title</span><input class="uk-form-small uk-input" type="text" id="ItemName${index}" value="${element.title}">
            <span class="uk-label">Description</span><textarea class="uk-textarea" id="ItemDescription${index}">${element.description}</textarea>
            <span class="uk-label">Notes</span><textarea class="uk-textarea" id="ItemNotes${index}">${element.notes}</textarea>
            <span class="uk-label">Priority</span><div class="uk-margin uk-grid-small uk-child-width-auto uk-grid">
                <label><input class="uk-radio" type="radio" name="radio${index}" data-value="0"> 0</label>
                <label><input class="uk-radio" type="radio" name="radio${index}" data-value="1"> 1</label>
                <label><input class="uk-radio" type="radio" name="radio${index}" data-value="2"> 2</label>
            </div>
            <p class="uk-text-right"><button id="save${index}" class="uk-button uk-button-primary uk-modal-close" type="button">Save</button></p></div></div>
        `);
        $(`input[name="radio${index}"][data-value="${element.priority}"]`).prop('checked', true);
        $(`#save${index}`).click(function() {
            console.log("Here we have save button click");
            editMode(index,ToDoArray); 
        });


    });
}
Render(ToDoArray);



const editMode = (index,arr) => {


    $(`#item-title-${index}`).html($(`#ItemName${index}`).val());
    arr[index].title = $(`#item-title-${index}`).html();

    $(`#description-tag-${index}`).html($(`#ItemDescription${index}`).val());
    arr[index].description = $(`#description-tag-${index}`).html();


    $(`#notes-tag-${index}`).html($(`#ItemNotes${index}`).val());
    arr[index].notes = $(`#ItemNotes${index}`).val();

    arr[index].editedDate = format(new Date(), 'MM/DD/YYYY h A');
    
   
    $(`#priority-tag-${index}`).html($(`input[name="radio${index}"]:checked`).attr('data-value'));
    arr[index].priority = $(`#priority-tag-${index}`).html();

    localStorage.setItem('ToDoArray', JSON.stringify(arr));
    Render(arr);
}




$('#ClearLocalStorage').click(function() {
    if (localStorage.getItem('ToDoArray')) {
        localStorage.clear();
        
    }
    $('#ToDoList').empty();
    ToDoArray = [];
})