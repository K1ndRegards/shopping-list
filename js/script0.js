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

// List context UI element creation
// Sorting field
function createSortField() {
  const div = document.createElement('div');
  div.className = 'sorting-field';

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

// Filter field
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

// Shopping item list
function createList() {
  const list = document.createElement('ul');
  list.className = 'shopping-list';
  list.id = 'shopping-list';

  return list;
}

// Clear button
function createClearButton() {
  const div = document.createElement('div');
  div.className = 'clear-button';

  const button = document.createElement('button');
  button.className = 'clear-btn';
  button.id = 'clear';
  button.textContent = 'Clear All';

  div.appendChild(button);

  return div;
}

// List item
function createListItem(text, date) {
  const li = document.createElement('li');
  li.className = 'list-item';

  const textSpan = document.createElement('span');
  textSpan.className = 'text';
  textSpan.textContent = text;

  const i = document.createElement('i');
  i.className = 'fa-solid fa-xmark';

  const dateSpan = document.createElement('span');
  dateSpan.className = 'date';
  dateSpan.textContent = date;

  li.appendChild(textSpan);
  li.appendChild(i);
  li.appendChild(dateSpan);

  return li;
}

// Action functions
// Item sorting function
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
function areAllItemsNotDisplayed() {
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
  if (areAllItemsNotDisplayed() && !h2) {
    const h2 = document.createElement('h2');
    h2.className = 'empty';
    h2.textContent = 'Empty List';

    itemList.appendChild(h2);

    // if item list is not empty but h2 still persist
  } else if (!areAllItemsNotDisplayed() && h2) {
    itemList.querySelector('h2').remove();
  }
}

// Function that fills shopping list context
// with UI items
function fillContext() {
  const sortField = createSortField();
  sortField.addEventListener('change', sortItems);

  const filterField = createFilterField();
  filterField.addEventListener('input', filterItems);

  const list = createList();
  // function to remove list item on 'X' icon click
  // list.addEventListener('click', ...);
  // function to edit list item on click
  // list.addEventListener('click', ...);

  const clearButton = createClearButton();
  // clearButton.addEventListener('click', clearContext);

  listContext.appendChild(sortField);
  listContext.appendChild(filterField);
  listContext.appendChild(list);
  listContext.appendChild(clearButton);
}

// Function to check the state
// of the shopping list context
function contextExists() {
  return listContext.children.length !== 0;
}

function getItemsFromLocalStorage() {
  let itemsFromStorage;

  if (localStorage.getItem('items') === null) {
    itemsFromStorage = new Array();
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }

  return itemsFromStorage;
}

function addItemToLocalStorage(text, date) {
  let itemsFromStorage = getItemsFromLocalStorage();

  itemsFromStorage.push([text, date]);

  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function removeItemFromLocalStorage(text, date) {
  let itemsFromStorage = getItemsFromLocalStorage();

  for ([itemText, itemDate] of itemsFromStorage) {
    console.log(itemText, itemDate);
  }
}

// Function to add list item to the shopping list
function addListItem(text) {
  const list = document.getElementById('shopping-list');
  const timeOfCreation = getFormattedDate();

  addItemToLocalStorage(text, timeOfCreation);
  const newItem = createListItem(text, timeOfCreation);
  list.appendChild(newItem);
}

// DOM elements
const userInput = document.getElementById('text');
const submitButton = document.getElementById('submit');
const listContext = document.getElementById('list-context');

// Submit button event listener to add new item
submitButton.addEventListener('click', function (e) {
  e.preventDefault();

  const newItem = userInput.value;
  userInput.value = '';

  if (newItem === '') {
    alert('Enter any item in the field.');
    return;
  }

  // First, we are going to fill the context UI, if it is absent
  if (!contextExists()) {
    // Filling context UI, and only then adding list item
    fillContext();
    addListItem(newItem);
  } else {
    // If context UI persist, adding list item to the list
    addListItem(newItem);
  }
});
