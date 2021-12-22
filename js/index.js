const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления
const fruitsItem = document.querySelectorAll('.fruit__item');

let fruitsJSON = `[
  {"kind": "Мангустин", "color": "violet", "weight": 13},
  {"kind": "Дуриан", "color": "green", "weight": 35},
  {"kind": "Личи", "color": "carmazin", "weight": 17},
  {"kind": "Карамбола", "color": "yellow", "weight": 28},
  {"kind": "Тамаринд", "color": "lightbrown", "weight": 22}
]`;

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);

/*** ОТОБРАЖЕНИЕ ***/

const createBlock = (selectorName, className) => {

    const selector = document.createElement(selectorName);

    if(className){
      selector.classList.add(className);
    }

    return selector;
}


// отрисовка карточек
const display = oldChild => {

  const lengthKeys = Object.keys(fruits).length;

  const removeNodesFromList = () => {

    while (fruitsList.firstChild) {
      fruitsList.removeChild(fruitsList.firstChild);
    }
  };

  removeNodesFromList();

  for (let i = 0; i < fruits.length; i++) {

    const elementFruitsList = createBlock('li','fruit__item');
    const elementFruitsBlock = createBlock('div','fruit__info');
    let firstElementBlockInside = createBlock('div', '');

    elementFruitsList.classList.add('fruit_' + fruits[i].color.toString());

    fruitsList.appendChild(elementFruitsList);
    elementFruitsList.appendChild(elementFruitsBlock);

    elementFruitsBlock.appendChild(firstElementBlockInside);
    firstElementBlockInside.innerHTML =  'index: ' + i;

    for (const property in fruits[i]) {
      let elementBlockInside = createBlock('div', '');

      elementBlockInside.innerHTML =  `${property}: ${fruits[i][property]}`;
      elementFruitsBlock.appendChild(elementBlockInside);
    }
  }

  return fruitsList;
};

// первая отрисовка карточек
display();

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// перемешивание массива
const shuffleFruits = () => {
  let result = [];

  // ATTENTION: сейчас при клике вы запустите бесконечный цикл и браузер зависнет
  while (fruits.length > 0) {
    // TODO: допишите функцию перемешивания массива
    //
    // Подсказка: находим случайный элемент из fruits, используя getRandomInt
    // вырезаем его из fruits и вставляем в result.
    // ex.: [1, 2, 3], [] => [1, 3], [2] => [3], [2, 1] => [], [2, 1, 3]
    // (массив fruits будет уменьшатся, а result заполняться)
  }

  fruits = result;
};

shuffleButton.addEventListener('click', () => {
  shuffleFruits();
  display();
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
const filterFruits = () => {
  fruits.filter((item) => {
    // TODO: допишите функцию
  });
};

filterButton.addEventListener('click', () => {
  filterFruits();
  display();
});

/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки


function isSorted(arr) {
  // TODO: Проверка на отсортированный массив

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < arr[i - 1]) {
      return false;
    }
    return true;
  }
}

const comparationColor = (a, b) => {
  // TODO: допишите функцию сравнения двух элементов по цвету
};

const sortAPI = {
  bubbleSort(arr, comparation) {
    // TODO: допишите функцию сортировки пузырьком

    const length = arr.length;

    for (let n = 0; n < length - 1; n++) {
      for (let i = 0; i < length - 1 - n; i++) {

        if(arr[i] > arr[i + 1]) {
          let temp = arr[i];
          arr[i] = arr[i + 1];
          arr[i + 1] = temp;
        }

      }
    }

    return arr;
  },

  quickSort(arr, comparation) {
    // TODO: допишите функцию быстрой сортировки

    const index = Math.floor(Math.random() * arr.length);

    const more = [];
    const less = [];

    for (let i = 0; i < arr.length; i++) {
      if (i === index) {
        continue
      }
      (arr[i] < arr[index])? more.push(arr[i]): less.push(arr[i]);
    }

    return [
        ...quickSort(less),
        arr[index],
        ...quickSort(more),
    ];

  },

  // выполняет сортировку и производит замер времени
  startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    sort(arr, comparation);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
  },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
  // TODO: переключать значение sortKind между 'bubbleSort' / 'quickSort'
});

sortActionButton.addEventListener('click', () => {
  // TODO: вывести в sortTimeLabel значение 'sorting...'
  const sort = sortAPI[sortKind];
  sortAPI.startSort(sort, fruits, comparationColor);
  display();
  // TODO: вывести в sortTimeLabel значение sortTime
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {
  // TODO: создание и добавление нового фрукта в массив fruits
  // необходимые значения берем из kindInput, colorInput, weightInput
  display();
});

replaceText('weight:', 'weight (кг):', 'div');

function replaceText(find, withWhat, selector) {

  const elementFind = document.querySelectorAll(selector);

  elementFind.forEach((element) => {
    element.innerHTML = element.innerHTML.replace(find, withWhat);
  })
}