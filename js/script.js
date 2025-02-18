// Support Functions
function getFormattedDate() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
}

// Item Creation
// sorting field
function createSortField() {
  const div = document.createElement('div');
  div.className = 'align-right';

  const select = document.createElement('select');
  select.name = 'sort';
  select.id = 'sort';
  select.className = 'sort';

  const option = document.createElement('option');
  option.value = '';
  option.disabled = true;
  option.selected = true;
  option.textContent = 'Sort';

  select.appendChild(option);

  const options = new Map([
    ['a-z', 'a-z'],
    ['z-a', 'z-a'],
    ['newest', 'Newest first'],
    ['oldest', 'Oldest first'],
  ]);

  for (const [key, value] of options) {
    const option = document.createElement('option');
    option.value = key;
    option.appendChild(document.createTextNode(value));
    select.appendChild(option);
  }

  div.appendChild(select);

  return div;
}

// filter field
function createFilterField() {
  const div = document.createElement('div');
  div.className = 'filter-field';

  const input = document.createElement('input');
  input.type = 'text';
  input.name = 'filter';
  input.id = 'filter';
  input.placeholder = 'Filter Items';

  div.appendChild(input);
  return div;
}

// clear button
function createClearButton() {
  const button = document.createElement('button');
  button.className = 'clear-btn';
  button.id = 'clear';
  button.textContent = 'Clear All';

  return button;
}

function createList() {
  const list = document.createElement('ul');
  list.className = 'shopping-list';
  list.id = 'shopping-list';

  return list;
}

// list item
function createListItem(text) {
  const li = document.createElement('li');
  li.className = 'list-item';

  const textSpan = document.createElement('span');
  textSpan.className = 'text';
  textSpan.textContent = text;

  const i = document.createElement('i');
  i.className = 'fa-solid fa-xmark';

  const dateSpan = document.createElement('span');
  dateSpan.className = 'date';
  dateSpan.textContent = getFormattedDate();

  li.appendChild(textSpan);
  li.appendChild(i);
  li.appendChild(dateSpan);

  return li;
}

function createEditModeListItem(text) {
  const li = document.createElement('li');
  li.className = 'list-item';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'edit-mode';
  input.value = text;
  input.maxLength = '12';

  const i = document.createElement('i');
  i.className = 'fa-solid fa-check';

  const dateSpan = document.createElement('span');
  dateSpan.className = 'date';
  dateSpan.textContent = getFormattedDate();

  li.appendChild(input);
  li.appendChild(i);
  li.appendChild(dateSpan);

  return li;
}

function sortItems(e) {
  // getting sort option
  const sortOption = e.target.value;
  // saving list items to sort them
  const items = Array.from(document.querySelectorAll('li.list-item'));
  const itemList = document.querySelector('ul.shopping-list');

  // removing list items from the list
  Array.from(itemList.children).forEach((children) => children.remove());

  // Sorting from a-z
  if (sortOption === 'a-z') {
    items.sort((a, b) => {
      const textA = a.querySelector('.text').textContent;
      const textB = b.querySelector('.text').textContent;
      return textA.localeCompare(textB);
    });
    // Sorting from z-a
  } else if (sortOption === 'z-a') {
    items.sort((a, b) => {
      const textA = a.querySelector('.text').textContent;
      const textB = b.querySelector('.text').textContent;
      return textB.localeCompare(textA);
    });
    // Sorting Newest First
  } else if (sortOption === 'newest') {
    items.sort((a, b) => {
      const dateA = new Date(a.querySelector('.date').textContent);
      const dateB = new Date(b.querySelector('.date').textContent);
      return dateB.getTime() - dateA.getTime();
    });
    // Sorting Oldest First
  } else if (sortOption === 'oldest') {
    items.sort((a, b) => {
      const dateA = new Date(a.querySelector('.date').textContent);
      const dateB = new Date(b.querySelector('.date').textContent);
      return dateA.getTime() - dateB.getTime();
    });
  }
  items.forEach((item) => itemList.appendChild(item));
}

// Function to check the state of the shopping list
function isItemListEmpty() {
  const itemList = document.querySelector('ul.shopping-list');

  const items = itemList.querySelectorAll('.list-item');

  for (const item of items.values()) {
    if (item.style.display !== 'none') {
      return false;
    }
  }

  return true;
}

// Item filter function
function filterItems() {
  const filterValue = document.getElementById('filter').value;

  const itemList = document.querySelector('ul.shopping-list');
  const items = itemList.querySelectorAll('.list-item');

  items.forEach((item) => {
    const itemText = item.querySelector('.text').textContent;

    if (!itemText.includes(filterValue)) {
      item.style.display = 'none';
    } else {
      item.style.display = 'flex';
    }
  });

  // Adding h2 element, if list after filtering is empty
  const h2 = itemList.querySelector('h2.empty');

  // if item list is empty and h2 is absent
  if (isItemListEmpty() && !h2) {
    const h2 = document.createElement('h2');
    h2.className = 'empty';
    h2.textContent = 'Empty List';

    itemList.appendChild(h2);

    // if item list is not empty but h2 still persist
  } else if (!isItemListEmpty() && h2) {
    itemList.querySelector('h2').remove();
  }
}

// item list remove function (by 'X' icon)
function removeListItem(e) {
  const list = document.querySelector('.shopping-list');
  // if our target is 'X' econ, remove parent element (which is list item)
  if (e.target.tagName === 'I' && e.target.className === 'fa-solid fa-xmark') {
    e.target.parentElement.remove();
    // if list is empty, remove whole context UI
    if (list.children.length === 0) {
      clearContext();
    }
  }
}

function saveEditOnBlur(e) {
  if (
    e.currentTarget.tagName === 'INPUT' &&
    e.currentTarget.className === 'edit-mode'
  ) {
    const editItem = e.currentTarget;
    const text = editItem.value;
    if (text) {
      editItem.parentElement.replaceWith(createListItem(text));
    } else {
      editItem.parentElement.remove();
      if (document.querySelector('.shopping-list').children.length === 0) {
        clearContext();
      }
    }
  }
}

// function to edit items on click
function editItem(e) {
  const item = e.target;

  if (item.tagName === 'LI' && item.className === 'list-item') {
    let text = item.querySelector('.text').textContent;

    const editModeItem = createEditModeListItem(text);
    const input = editModeItem.querySelector('.edit-mode');

    item.replaceWith(editModeItem);
    input.focus();
    input.addEventListener('blur', saveEditOnBlur);
  }
}

// function that fills context with UI
function fillContext() {
  const sortField = createSortField();
  sortField.addEventListener('change', sortItems);

  const filterField = createFilterField();
  filterField.addEventListener('input', filterItems);

  const list = createList();
  list.addEventListener('click', removeListItem);
  list.addEventListener('click', editItem);

  const clearButton = createClearButton();
  clearButton.addEventListener('click', clearContext);

  listContext.appendChild(sortField);
  listContext.appendChild(filterField);
  listContext.appendChild(list);
  listContext.appendChild(clearButton);

  contextPersist = true;
}

// Adding list item to the shopping list
function addListItem(text) {
  const list = document.getElementById('shopping-list');

  list.appendChild(createListItem(text));
}

// function for context UI removal
function clearContext() {
  Array.from(listContext.children).forEach((child) => {
    child.remove();
  });
  contextPersist = false;
}

// Variable to check the state of context UI
let contextPersist = false;

// DOM elements
const listContext = document.getElementById('list-context');
const userInput = document.getElementById('text');
const submitButton = document.getElementById('submit');

// submit button event listener
submitButton.addEventListener('click', function (e) {
  e.preventDefault();

  const newItem = userInput.value;
  userInput.value = '';

  // If item input is empty, warn user
  if (newItem === '') {
    alert('Enter any item in the field.');
    return;
  }

  // First, we gotta fill the context UI, if it is absent
  if (!contextPersist) {
    // filling context UI, and only then adding list item
    fillContext();
    addListItem(newItem);
  } else {
    // If context UI persist, adding list item to the list
    addListItem(newItem);
  }
});

submitButton.addEventListener('click', filterItems);
