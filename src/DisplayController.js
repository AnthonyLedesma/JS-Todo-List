// Whole-script strict mode syntax
'use strict';
const $ = require('jquery');
//const jQuery = require('jquery');


//import ToDoArray from 'index.js';
import DOMPurify from 'dompurify';
import UIkit from 'uikit';
import { format } from 'date-fns';



/*
|Render function will take array containing to-do objects.
|Objects are read in forEach loop and the data is used with on-the-fly DOM manipulation.
|
|One card and one Modal is rendered with each pass through.
|Note preRenderClear function will clear DOM elements using jQuery methods.
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
                        <div id="date-badge-${index}" class="${badgeClass}">Created: ${element.createdDate}<br />Edited: ${element.editedDate}<br  />Due: ${element.dueDate}</div>
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
        
        $('#modal-overflow').append(`
        <div data-modal='true' id="modal${index}" uk-modal>
            <div class="uk-modal-dialog">
                <div class="uk-modal-header"><h2 class="uk-modal-title">${element.title}</h2></div>
                <div class="uk-modal-body">
                    <button class="uk-modal-close-default" type="button" uk-close></button>
                    <form>
                        <div class="uk-grid-small" uk-grid>
                            <div class="uk-width-1-2@s">
                                <span class="uk-label">Title</span><input class="uk-input" type="text" id="ItemName${index}" value="${element.title}">
                                <span class="uk-label">Description</span><input class="uk-input" type="text" id="ItemDescription${index}" value="${element.description}">
                            </div>
                            <div class="uk-width-1-2@s">
                                <span class="uk-label">Notes</span><textarea class="uk-textarea" id="ItemNotes${index}" style="height: 105px;">${element.notes}</textarea>
                            </div>
                        </div>
                        <hr />
                        <div class="uk-grid-small" uk-grid>
                            <div class="uk-width-1-2@s">
                                <span class="uk-label">Priority</span><br  />
                                <label><input class="uk-radio" type="radio" name="radio${index}" data-value="0"> Low</label>
                                <label><input class="uk-radio" type="radio" name="radio${index}" data-value="1"> Normal</label>
                                <label><input class="uk-radio" type="radio" name="radio${index}" data-value="2"> High</label>
                            </div>
                            <div class="uk-width-1-2@s">
                                <span class="uk-label">Due Date</span><input type="text" id="datepicker${index}" class="uk-input">
                            </div>
                        </div>
                    </form>
                </div>
                <div class="uk-modal-footer">
                    <p class="uk-align-right"><button id="save${index}" class="uk-button uk-button-primary" type="button" uk-close>Save</button></p>
                    <p class="uk-align-left"><button id="delete${index}" class="uk-button uk-button-danger" type="button" uk-close>Delete</button></p>
                </div>
            </div>
        </div>`);
        


        
        $(`#save${index}`).click(function(e) {
            //UIkit.modal(e.target.parentNode.parentNode.parentNode).hide();
            //$('html').removeAttr('class');
            //$('body').removeAttr('style');
            //UIkit.modal(e, 'sel-close');
            ToDoArray = editMode(index,ToDoArray); 
            render(ToDoArray);
        });

        $(`#delete${index}`).click(function(e) {
                e.preventDefault();
                e.target.blur();
                UIkit.modal.prompt(`Type <b>"remove"</b> To Remove To-Do Item <b>"${e.target.parentNode.parentNode.parentNode.firstElementChild.textContent}"</b>`, '').then(function (answer) {
                    if (answer === "remove") {
                        ToDoArray = deleteMode(index,ToDoArray); 
                        console.log(ToDoArray);
                        render(ToDoArray);
                    }
                });
            
            //UIkit.modal(e.target.parentNode.parentNode.parentNode).hide();
            //$('html').removeAttr('class');
            //$('body').removeAttr('style');
        });

        //match checked attribute with the corresponding element value.
        $(`input[name="radio${index}"][data-value="${parseInt(element.priority)}"]`).prop('checked', true);
        //Add date picker functionality to all edit modals.
        $(`#datepicker${index}`).datepicker();
 
    });
}

/*
|preRenderClear will use jQuery methods to remove the rendered cards and modals.
*/

const preRenderClear = () => {
    $('#ToDoList').empty();
    $('div[data-modal="true"]').remove();
}

/*
|editMode is invoked when the save button is clicked on the edit modal.
|takes the index number of the clicked element and the source ToDo object array.
|
|Function will set corresponding object attributes and return the mutated array.
|Also saves the mutated array to local storage to overwrite unchanged array. 
*/

const editMode = (index,arr) => {

    arr[index].title = DOMPurify.sanitize($(`#ItemName${index}`).val(), {ALLOWED_TAGS: ['b']});
    arr[index].description = DOMPurify.sanitize($(`#ItemDescription${index}`).val(), {ALLOWED_TAGS: ['b']});
    arr[index].notes = DOMPurify.sanitize($(`#ItemNotes${index}`).val(), {ALLOWED_TAGS: ['b']});
    arr[index].editedDate = format(new Date(), 'MM/DD/YYYY');
    arr[index].priority = $(`input[name="radio${index}"]:checked`).attr('data-value');
    arr[index].dueDate = DOMPurify.sanitize($(`#datepicker${index}`).val(), {ALLOWED_TAGS: ['b']});

    localStorage.setItem('ToDoArray', JSON.stringify(arr));
    return arr;
}

const deleteMode = (index,arr) => {
    arr = arr.splice((index+1),1);
    
    localStorage.setItem('ToDoArray', JSON.stringify(arr));
    return arr;
}


export {render};