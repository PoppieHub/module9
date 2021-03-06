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

const minWeight = document.querySelector('.minweight__input');
const maxWeight = document.querySelector('.maxweight__input');

// список фруктов в JSON формате
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
const display = () => {
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
const shuffleFruits = (fruitsTemp) => {
    let result = [];

    while (fruitsTemp.length > 0) {
        let endElement = fruitsTemp.length - 1;
        let temp = getRandomInt(0, endElement);
        result.push(fruitsTemp[temp]);
        fruitsTemp.splice(temp,1);
    }

    fruitsTemp = result;

    return fruitsTemp;
};

// проверка на перемешанный массив
const checkForAShuffled = (fruitsTemp) => {
    const oldFruits = fruitsTemp.slice();

    fruitsTemp = shuffleFruits(fruitsTemp);

    if (fruitsTemp.length === oldFruits.length && (fruitsTemp.every((v,i)=>v === oldFruits[i])) === true) {
        alert('порядок не изменился!');
        fruitsTemp = oldFruits;
    }

    return fruitsTemp;
}

shuffleButton.addEventListener('click', () => {
    fruits = checkForAShuffled(fruits);
    display();
});

/*** ФИЛЬТРАЦИЯ ***/

// проверка на пустоту
const checkEmpty = (arg, defaultArg) => {
    if (arg.value.length === 0) {
        arg.value = defaultArg;
    }

    return arg.value;
};

/*
// проверка на число
const checkNumber = (arg) => {

  let result;

  (arg && !isNaN(arg))? result = true : result = false;

  return result;
};

// Предупреждение о том что не число
const applyNumber = (arg1, arg2) => {

  if (arg1 !== true && arg2 !== true) {

    let min = getRandomInt(0, 10);
    let max = getRandomInt(10, 100);

    minWeight.value = min;
    maxWeight.value = max;
  }

  alert( `Вы ввели не числовой формат минимального и максимального значения. Я сгенерировал их сам.`);
};

 */

// проверка на границы weight
const checkBorderWeight = (min, max) => {
    if (parseInt(min) > parseInt(max)) {
        min = getRandomInt(0, 10);
        max = getRandomInt(10, 100);

        alert( `Вы перепутали границы минимального и максимального значения. Я сгенерировал их сам от ${min} до ${max}.`);
    }

    return [
        min,
        max,
    ];
};

// применить границы weight
const applyBorders = (arg) => {
    minWeight.value = arg[0];
    maxWeight.value = arg[1];
};

// фильтрация массива
const filterFruits = () => {
    fruits = fruits.filter((item) => {
        return (maxWeight.value >= item.weight && item.weight >= minWeight.value);
    });
};

filterButton.addEventListener('click', () => {
    checkEmpty(minWeight, getRandomInt(0,20));
    checkEmpty(maxWeight, getRandomInt(20,30));

    //applyNumber(checkNumber(minWeight.value), checkNumber(maxWeight.value));

    const borderWeight = checkBorderWeight(minWeight.value, maxWeight.value);
    applyBorders(borderWeight);

    filterFruits();
    display();
});

/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

const HEXtoBright = (hex) => {
    return (parseInt(hex.substring(1, 2),16) + parseInt(hex.substring(3, 4),16) + parseInt(hex.substring(5, 6),16));
}

const comparisonColor = (a, b) => {

    const brightA = HEXtoBright(a);
    const brightB = HEXtoBright(b);

    return brightA <= brightB;
};

const sortAPI = {
    bubbleSort(arr, comparison) {

        const length = arr.length;

        for (let n = 0; n < length - 1; n++) {
            for (let i = 0; i < length - 1 - n; i++) {

                if(!comparison(arr[i].color, arr[i + 1].color)) {
                    let temp = arr[i];
                    arr[i] = arr[i + 1];
                    arr[i + 1] = temp;
                }
            }
        }

        return arr;
    },

    quickSort(arr) {

        const left = [],
            middle = [],
            right = [];

        const length = arr.length;

        if (length < 2) {
            return arr;
        }

        const index = arr[Math.floor(length / 2)].color;

        arr.forEach(el => {
            if (el.color === index) {
                middle.push(el);
            } else if ( (el.color !== index) && (el.color.length >= index.length) ) {
                right.push(el);
            } else if ( (el.color !== index) && (el.color.length < index.length) ) {
                left.push(el);
            }
        });

        return fruits = [
            ...sortAPI.quickSort(left),
            ...middle,
            ...sortAPI.quickSort(right),
        ];
    },

    // выполняет сортировку и производит замер времени
    startSort(sort, arr, comparison) {
        const start = new Date().getTime();
        arr = sort(arr, comparison);
        const end = new Date().getTime();
        sortTime = `${end - start} ms`;

        return arr;
    },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
    if (sortKind === 'bubbleSort') {
        sortKind = 'quickSort';
        sortKindLabel.textContent = sortKind;
    } else {
        sortKind = 'bubbleSort';
        sortKindLabel.textContent = sortKind;
    }
});

sortActionButton.addEventListener('click', () => {

    const sort = sortAPI[sortKind];
    fruits = sortAPI.startSort(sort, fruits, comparisonColor);
    display();
    sortTimeLabel.innerHTML = sortTime;
});

/*** ДОБАВИТЬ ФРУКТ ***/

// проверка на пустоту Object
const checkEmptyObj = (arg) => {
    return arg.length !== 0;
};

// добавление элемента
const addFruit = (kind,color,weight) => {
    const obj = {
        "kind": kind,
        "color": color,
        "weight": weight
    };
    if (checkEmptyObj(kind) && checkEmptyObj(color) && checkEmptyObj(weight)){
        return fruits.push(obj);
    }
    return alert('Вы не указали все поля, при вводе нового фрукта, попробуйте снова!')
};

addActionButton.addEventListener('click', () => {
    addFruit(kindInput.value, colorInput.value, weightInput.value);
    display();
});