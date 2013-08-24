preexisting = [
  {date: '2013-08-28 Wed', body: 'ECE 302 - HW1: 1.19, 1.22, 1.30, 1.31, 2.14, 2.22, 2.34, 2.44, 2.46, 2.49'},
  {date: '2013-08-30 Fri', body: "ECE 301 - <a href='http://courses.ncsu.edu/ece301/lec/001/wrap/TurninPDFs/turnin1.pdf'>Assignment 1</a>"},
  {date: '2013-09-04 Wed', body: "ECE 302 - HW2"}
];

function populateTodo() {

  todoItems = cachedTodoItems();

  for (i in todoItems) {
    $('#todo-items').append("\
        <div class='list-group-item todo-item'>\
          <h4 class='list-group-item-heading editable'>" + todoItems[i].date + "</h4>\
          <p class='list-group-item-text editable'>\
            " + todoItems[i].body + "\
          </p>\
        </div>\
        ");
  }

  localStorage['todoItems'] = JSON.stringify(todoItems);
}

function cachedTodoItems() {
  if (!localStorage['todoItems']) {
    localStorage['todoItems'] = JSON.stringify([]);
  }

  return JSON.parse(localStorage['todoItems']);
}

function saveTodoItems(todoItems) {
  localStorage['todoItems'] = JSON.stringify(todoItems);
}

$(document).on('click', '.editable', function(event) {
  $(this).toggleClass('editable');
  $(this).html("<input type='text' class='todo-form-item form-control' value='" + $(this).html() + "'>");
  $(this).find('input').focus();
});

$(document).on('blur', 'input.todo-form-item', function(event) {
  $(this).parent('p, h4').toggleClass('editable');
  $(this).replaceWith($(this).val());
});

$(document).on('click', '#add-todo', function(event) {
  $('#todo-items').append($('#new-todo-item-form').html());
});

$(document).on('ready', function() {
  populateTodo();
});
