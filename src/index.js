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
|Title, Description, Creation Date, Due Date, Priority, Notes, and Checklist. 
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
    let bodyClass = "uk-card uk-card-default uk-card-body uk-card-hover uk-margin";
    let badgeClass = "uk-card-badge";
    let gridClass = "uk-grid-small uk-child-width-expand@s uk-text-center uk-flex";
    let editClass = "uk-button uk-button-text uk-align-right";
    let stopEditClass = "uk-button uk-button-text uk-align-left";
    $('#ToDoList').empty();
    ToDoArray.forEach((element,index) => {
        
        $('#ToDoList').append(`
        <div class="${gridClass}">
            <div>
                <div class="${parentClass}">
                    <div class="${bodyClass}">
                        <div id="date-badge-${index}" class="${badgeClass}">Created: ${element.createdDate}<br />Edited: ${element.editedDate}</div>
                        <h3 id="item-title-${index}" class="uk-card-title">${element.title}</h3>
                            <input type="text" id="ItemName${index}" value="${element.title}"><br class="spacing" />
                        <p id="description-tag-${index}">${element.description}</p>
                            <textarea id="ItemDescription${index}">${element.description}</textarea><br class="spacing" />
                        <p id="notes-tag-${index}">${element.notes}</p>
                            <textarea id="ItemNotes${index}">${element.notes}</textarea><br class="spacing" />
                        <div id="edit-${index}" class="${editClass}">Edit</div>
                        <div id="stop-edit-${index}" class="${stopEditClass}">Stop Editing</div>
                    </div>
                </div>
            </div>
        </div>`
        );

/*
|Run-once on initial render Next 4 lines.
|
|Setup Click listeners on cards.
|Invoke EditMode and EndEditMode respectively.
*/
        $(`#stop-edit-${index}`).hide(); //run once on initial render.
        $(`#ItemDescription${index}`).hide();
        $(`#ItemName${index}`).hide();
        $(`.spacing`).hide();
        $(`#ItemNotes${index}`).hide();
        
        


        $(`#stop-edit-${index}`).click(function() {
            
            EndEditMode(index,ToDoArray);
        });
        

        $(`#edit-${index}`).click(function() {
            console.log("Click in Editing button");
            EditMode(index);
        });

        

    });
}
Render(ToDoArray);



const EditMode = (index) =>{

    $(`#edit-${index}`).hide();
    $(`#stop-edit-${index}`).show();
    $(`.spacing`).show();
    

    //$(`#date-badge-${index}`).hide();

    $(`#item-title-${index}`).hide();
    $(`#ItemName${index}`).show();

    $(`#description-tag-${index}`).hide();
    $(`#ItemDescription${index}`).show();

    $(`#ItemNotes${index}`).show();
    $(`#notes-tag-${index}`).hide();
}

const EndEditMode = (index,arr) => {

    $(`#edit-${index}`).show();
    $(`#stop-edit-${index}`).hide();
    $(`.spacing`).hide();

    //$(`#date-badge-${index}`).show();
    

    $(`#item-title-${index}`).show();
    $(`#item-title-${index}`).html($(`#ItemName${index}`).val());
    $(`#ItemName${index}`).hide();
    arr[index].title = $(`#item-title-${index}`).html();

    $(`#description-tag-${index}`).show();
    $(`#description-tag-${index}`).html($(`#ItemDescription${index}`).val());
    arr[index].description = $(`#description-tag-${index}`).html();
    $(`#ItemDescription${index}`).hide();

    $(`#ItemNotes${index}`).hide();
    $(`#notes-tag-${index}`).show();
    $(`#notes-tag-${index}`).html($(`#ItemNotes${index}`).val());
    arr[index].notes = $(`#ItemNotes${index}`).val();

    arr[index].editedDate = format(new Date(), 'MM/DD/YYYY h A');

    localStorage.setItem('ToDoArray', JSON.stringify(arr));
    Render(ToDoArray);
}




$('#ClearLocalStorage').click(function() {
    if (localStorage.getItem('ToDoArray')) {
        localStorage.clear();
        
    }
    $('#ToDoList').empty();
    ToDoArray = [];
})