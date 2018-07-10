// Whole-script strict mode syntax
'use strict';
const $ = require('jquery');
//const jQuery = require('jquery');

$('#ToDoList').append("<li>This item is ToDo</li>");
$('#DoneList').append("<li>This item is done</li>");

//import ToDoArray from 'index.js';
import DOMPurify from 'dompurify';
import UIkit from 'uikit';
import { format } from 'date-fns';

$('#NewToDo').click(function() {
    $('#NewFormDiv').show();

})


/*
|
| 
|
|
|
|
|
*/
const render = (ToDoArray) => {
    let parentClass = "uk-grid-small uk-child-width-expand@s uk-text-center uk-flex";
    let badgeClass = "uk-card-badge";
    let bodyPriorityClass = '';
    let priorityState = '';
    let gridClass = "uk-grid-small uk-child-width-expand@s uk-text-center uk-flex";
    let editClass = "uk-button uk-button-text uk-align-right";

    preRenderClear();
    ToDoArray.forEach((element,index) => {

        if (parseInt(element.priority) === 0) {bodyPriorityClass = "uk-card uk-card-default uk-card-body uk-card-hover uk-margin";priorityState = "Low";}
        else if (parseInt(element.priority) === 1) {bodyPriorityClass = "uk-card uk-card-primary uk-card-body uk-card-hover uk-margin";priorityState = "Normal";}
        else if (parseInt(element.priority) === 2) {bodyPriorityClass = "uk-card uk-card-secondary uk-card-body uk-card-hover uk-margin";priorityState = "High";}
        $('#ToDoList').append(`
        <div class="${gridClass}">
            <div>
                <div class="${parentClass}">
                    <div class="${bodyPriorityClass}">
                        <div id="date-badge-${index}" class="${badgeClass}">Created: ${element.createdDate}<br />Edited: ${element.editedDate}</div>
                        <h3 id="item-title-${index}" class="uk-card-title">${element.title}</h3>
                        <p id="description-tag-${index}">${element.description}</p>
                        <p id="notes-tag-${index}">${element.notes}</p>
                        <p id="priority-tag-${index}">Priority ${priorityState}</p>
                        <div id="edit-${index}" class="${editClass}" uk-toggle="target: #modal${index}">Edit</div>
                    </div>
                </div>
            </div>
        </div>`
        );
        
        $('body').append(`<div data-modal='true' id="modal${index}" uk-modal><div class="uk-modal-dialog uk-modal-body">
            <h2 class="uk-modal-title">${element.title}</h2>
            <span class="uk-label">Title</span><input class="uk-form-small uk-input" type="text" id="ItemName${index}" value="${element.title}">
            <span class="uk-label">Description</span><textarea class="uk-textarea" id="ItemDescription${index}">${element.description}</textarea>
            <span class="uk-label">Notes</span><textarea class="uk-textarea" id="ItemNotes${index}">${element.notes}</textarea>
            <span class="uk-label">Priority</span><div class="uk-margin uk-grid-small uk-child-width-auto uk-grid">
                <label><input class="uk-radio" type="radio" name="radio${index}" data-value="0"> Low</label>
                <label><input class="uk-radio" type="radio" name="radio${index}" data-value="1"> Normal</label>
                <label><input class="uk-radio" type="radio" name="radio${index}" data-value="2"> High</label>
            </div>
            <p class="uk-text-right"><button id="save${index}" class="uk-button uk-button-primary" type="button">Save</button></p></div></div>
        `);
        
        
        $(`#save${index}`).click(function(e) {
            
            //e.target.parentNode.parentNode.parentNode.remove();
            UIkit.modal(e.target.parentNode.parentNode.parentNode).hide();
            $('html').removeAttr('class');
            $('body').removeAttr('style');
            ToDoArray = editMode(index,ToDoArray); 
            render(ToDoArray);
        });

        $(`input[name="radio${index}"][data-value="${parseInt(element.priority)}"]`).prop('checked', true);
 
    });
}

const editMode = (index,arr) => {

    arr[index].title = DOMPurify.sanitize($(`#ItemName${index}`).val(), {ALLOWED_TAGS: ['b']});
    arr[index].description = DOMPurify.sanitize($(`#ItemDescription${index}`).val(), {ALLOWED_TAGS: ['b']});
    arr[index].notes = DOMPurify.sanitize($(`#ItemNotes${index}`).val(), {ALLOWED_TAGS: ['b']});
    arr[index].editedDate = format(new Date(), 'MM/DD/YYYY h A');
    arr[index].priority = $(`input[name="radio${index}"]:checked`).attr('data-value');

    localStorage.setItem('ToDoArray', JSON.stringify(arr));
    return arr;
}

const preRenderClear = () => {
    $('#ToDoList').empty();
    $('div[data-modal="true"]').remove();
}

export {render};