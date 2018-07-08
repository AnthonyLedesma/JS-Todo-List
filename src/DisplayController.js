const $ = require('jquery');
//const jQuery = require('jquery');

$('#ToDoList').append("<li>This item is ToDo</li>");
$('#DoneList').append("<li>This item is done</li>");


$('#NewToDo').click(function() {
    $('#NewFormDiv').show();

})

