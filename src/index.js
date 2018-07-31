/* global localStorage */

import $ from 'jquery';

/*
|Expose jQuery to global environment.
|DomPurify is used to sanitize user inputs.
|format is used for date and time manipulation.
|parse module from date-fns will transform common formats
|load datepicker widget from jQuery UI.
*/
import DOMPurify from 'dompurify';
import { format } from 'date-fns';
import parse from 'date-fns/parse';
import 'jquery-ui/ui/widgets/datepicker';

/*
|UIkit allow us access to JS methods to work with CSS framework.
|UIkit icons plugin imported then loaded.
*/
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import render from './DisplayController';

UIkit.use(Icons);

/*
|Set ToDoArray as global accessible variable.
|Array will contain To-Do list objects.
|Retrieve array from localStorage if the item exists.
*/
let ToDoArray = [];
if (localStorage.getItem('ToDoArray')) {
  ToDoArray = JSON.parse(localStorage.getItem('ToDoArray'));
}

/*
|Factory function ToDoItems will output ToDo list items as objects.
|Objects should have the following properties.
|Title, Description, Creation Date, Due Date, Priority, Notes, and Checklist.
|
|Priority 0-2 | Low to High
*/

function ToDoItems() {
  const obj = {
    title: '',
    description: '',
    dueDate: '',
    createdDate: '',
    priority: 0,
    notes: '',
    checklist: {
      item: '',
      checked: false,
    },
  };
  return obj;
}


/*
|Generate button is accessible when NEW TO-DO ITEM menu item is clicked.
|Generate button will use the information provided within the Add To-Do Item form
|located in index.html.
|Inputs are sanitized and placed into temporary object which is pushed into global ToDoArray.
|At the end of the click event render is called and form values are set to defaults.
*/
$('#GenerateButton').click(() => {
  const x = ToDoItems();
  x.title = DOMPurify.sanitize($('#ItemName').val(), { ALLOWED_TAGS: ['b'] });
  x.description = DOMPurify.sanitize($('#ItemDescription').val(), { ALLOWED_TAGS: ['b'] });
  x.createdDate = format(new Date(), 'MM/DD/YYYY');
  x.dueDate = format(parse(DOMPurify.sanitize($('#datepicker').val(), { ALLOWED_TAGS: ['b'] })), 'MM/DD/YYYY');
  x.priority = $('input[name="newItem"]:checked').attr('data-priority');
  x.notes = DOMPurify.sanitize($('#ItemNotes').val(), { ALLOWED_TAGS: ['b'] });

  ToDoArray.push(x);
  localStorage.setItem('ToDoArray', JSON.stringify(ToDoArray));
  render(ToDoArray);

  $('#ItemName').val('');
  $('#ItemDescription').val('');
  $('#datepicker').val('');
  $('#ItemNotes').val('');
  $('input[name="newItem"][data-priority="0"]').prop('checked', true);
});

/*
|render is called on initial page load.
|Initialize datepicker plugin on the Add To-Do Item form.
*/
render(ToDoArray);
$('#datepicker').datepicker();


/*
|DEV FUNCTION
|Intended to bypass form restrictions.
*/
$('#ClearLocalStorage').click(() => {
  if (localStorage.getItem('ToDoArray')) {
    localStorage.clear();
  }
  $('#ToDoList').empty();
  ToDoArray = [];
});
