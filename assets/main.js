function setupLinks() {
  $('a').attr('target', '_blank');
}
function populateTodo() {

  todoItems = cachedTodoItems();

  for (i in todoItems) {
    if (todoItems[i] == null) {
      todoItems.splice(i, 1);
    }
    itemToAppend = "\
        <div class='list-group-item todo-item'>\
          <button class='btn btn-xs pull-right' id='toggle-status'>\
            <span class='glyphicon glyphicon-minus'></span>\
          </button>\
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
    setStatus(statusDiv(divAtIndex(i)), todoItems[i].status || false);
  }

  saveTodoItems(todoItems);
}

function divAtIndex(index) {
  return $(todoItemsInView()[index]);
}

function setStatus(div, done) {
  div.toggleClass('glyphicon-ok', done);
  div.toggleClass('glyphicon-minus', !done);
}

function statusDiv(todoDiv) {
  return todoDiv.find('.glyphicon-minus, .glyphicon-ok');
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

function todoBody(todoDiv) {
  return $(todoDiv).find('p').html();
}

function todoStatus(todoDiv) {
  return statusDiv($(todoDiv)).hasClass('glyphicon-ok');
}

function todoIndex(todoDiv) {
  return todoItemsInView().index(todoDiv);
}

function todoItemsInView() {
  return $('#todo-items .todo-item');
}

function todoFromDiv(todoDiv) {
  return { date: todoDate(todoDiv), body: todoBody(todoDiv), status: todoStatus(todoDiv) };
}

$(document).on('click', '.editable:not(a)', function(event) {
  $(this).toggleClass('editable', false);
  $(this).html("<input type='text' class='todo-form-item form-control' value='" + $(this).html().trim() + "'>");
  $(this).find('input').focus();
});

$(document).on('blur', 'input.todo-form-item', function(event) {
  parentSection = $(this).parent('p, h4');
  parentSection.toggleClass('editable', true);
  todoDiv = parentSection.parent();
  $(this).replaceWith($(this).val().trim());
  todoItems = cachedTodoItems();

  index = todoIndex(todoDiv);
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

$(document).on('click', '#toggle-status', function(event) {
  todoDiv = $(this).parent();
  index = todoIndex(todoDiv);
  todoItems = cachedTodoItems();
  currentItem = todoItems[index];
  setStatus(statusDiv(todoDiv), !currentItem.status || false);
  currentItem.status = todoStatus(todoDiv);
  saveTodoItems(todoItems);
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
