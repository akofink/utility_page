function setupLinks() {
  $('a').attr('target', '_blank');
}
function populateTodo() {

  todoItems = cachedTodoItems();

  for (i in todoItems) {
    itemToAppend = "\
        <div class='list-group-item todo-item'>\
          <button class='btn btn-xs pull-right' id='remove-todo'>\
            <span class='glyphicon glyphicon-remove'></span>\
          </button>\
          <button class='btn btn-xs pull-right' id='move-up-todo'>\
            <span class='glyphicon glyphicon-arrow-up'></span>\
          </button>\
          <button class='btn btn-xs pull-right' id='move-down-todo'>\
            <span class='glyphicon glyphicon-arrow-down'></span>\
          </button>\
          <h4 class='list-group-item-heading editable'>" + todoItems[i].date + "</h4>\
          <p class='list-group-item-text editable'>\
            " + todoItems[i].body + "\
          </p>\
        </div>\
        "
    $('#todo-items').append(itemToAppend);
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

function todoDate(todoItem) {
  return $(todoItem).find('h4').html();
}

function todoBody(todoItem) {
  return $(todoItem).find('p').html();
}

function todoIndex(todoDiv) {
  return todoItemsInView().index(todoDiv);
}

function todoItemsInView() {
  return $('#todo-items .todo-item');
}

function todoFromDiv(todoDiv) {
  return { date: todoDate(todoDiv), body: todoBody(todoDiv) };
}

$(document).on('click', '.editable', function(event) {
  $(this).toggleClass('editable');
  $(this).html("<input type='text' class='todo-form-item form-control' value='" + $(this).html() + "'>");
  $(this).find('input').focus();
});

$(document).on('blur', 'input.todo-form-item', function(event) {
  parentSection = $(this).parent('p, h4');
  parentSection.toggleClass('editable');
  todoDiv = parentSection.parent();
  $(this).replaceWith($(this).val());
  todoItems = cachedTodoItems();

  window.todoDiv = todoDiv;
  index = todoIndex(todoDiv);
  console.log(index == todoItems.length);
  if (index == todoItems.length) {
    todoItems.push(todoFromDiv(todoDiv));
  } else {
    todoItems[index] = todoFromDiv(todoDiv);
  }

  saveTodoItems(todoItems);
});

$(document).on('click', '#add-todo', function(event) {
  $('#todo-items').append($('#new-todo-item-form').html());
});

$(document).on('click', '#remove-todo', function(event) {
  todoDiv = $(this).parent();
  index = todoIndex(todoDiv);
  todoItems = cachedTodoItems();
  todoItems.splice(index, 1);
  saveTodoItems(todoItems);
  todoDiv.remove();
});

$(document).on('click', '#move-up-todo', function(event) {
  todoDiv = $(this).parent();
  index = todoIndex(todoDiv);
  todoDiv.insertBefore(todoDiv.prev())
  todoItems = cachedTodoItems();
  currentItem = todoItems[index];
  todoItems[index] = todoItems[index - 1];
  todoItems[index - 1] = currentItem;
  saveTodoItems(todoItems);
});

$(document).on('click', '#move-down-todo', function(event) {
  todoDiv = $(this).parent();
  index = todoIndex(todoDiv);
  todoDiv.insertAfter(todoDiv.next())
  todoItems = cachedTodoItems();
  currentItem = todoItems[index];
  todoItems[index] = todoItems[index + 1];
  todoItems[index + 1] = currentItem;
  saveTodoItems(todoItems);
});

$(document).on('ready', function() {
  populateTodo();
  setupLinks();
});
