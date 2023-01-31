let header = document.querySelector('header');
let container = header.querySelector('.container');
let settings = container.querySelector('.settings');
let logo = container.querySelector('.logo');
const city = settings.querySelector('.city');
const cityIcon = settings.querySelector('.city-main');
const search = settings.querySelector('.search');
const searchInput = search.querySelector('input');
const menu = container.querySelector('.menu');
const account = settings.querySelector('.account');
const likes = account.querySelector('.like-btn');
const profileBtn = account.querySelector('.profile-btn');

let burger = document.createElement('div');
burger.classList.add('burger-menu');
burger.innerHTML = `
    <a>
        <img src='../images/burger.svg' alt='Меню'>
    </a>
`;

let back = document.createElement('div');
back.classList.add('back');
back.innerHTML = `
    <button type='button'>
        <img src='../images/arrow-left.svg' alt='Влево'>
        <p>Назад</p>
    </button>
`;

window.onload = () => {
    if (document.documentElement.clientWidth <= 600) {
        container.classList.add('container-block');
        search.classList.add('invisible');
        menu.classList.add('invisible');
        city.style.display = 'none';
        profileBtn.style.display = 'none';

        settings.insertBefore(burger, logo);
        if (!header.contains(back)) {
            header.appendChild(back);
        }
    }

    if (document.documentElement.clientWidth <= 768
        && document.documentElement.clientWidth >= 601) {

        if (settings.contains(search)) {
            settings.removeChild(search);
        }

        settings.insertBefore(burger, settings.children[1]);
        container.classList.add('visible');
        menu.classList.add('invisible');
    }

    if (document.documentElement.clientWidth <= 1200
        && document.documentElement.clientWidth >= 769) {
        if (account.contains(likes)) {
            account.removeChild(likes);
        }
        if (profileBtn.contains(profileBtn.children[0])) {
            profileBtn.removeChild(profileBtn.children[0]);
        }
        profileBtn.style.marginLeft = '16px';
        search.style.width = '100%';
        searchInput.style.minWidth = '90%';
        menu.style.fontSize = '11px';
    }
}

// Выпадающий список городов
let cityBlock = document.createElement('div');
cityBlock.classList.add('choose-city');
let regions = [];

city.onmouseover = function() {
    city.classList.add('onMouse');
}

city.onmouseleave = function() {
    city.classList.remove('onMouse');
}

const spinner = `
    <div class='preloader-wrap'>
        <div class='preloader'>
            <div></div>
        </div>
    </div>
`;

function buildCitiesList(regions) {
    return `
        <ul class='cities'>
            ${regions.join(' ')}
        </ul>
    `;
}

function showChosenCity() {
    return `
         <div class='chosen-city'>
            <div class='city-elem'>
                <p>Москва</p>
                <a>
                    <img src='./images/cross.svg' alt='Убрать'>
                </a>
            </div>
        </div>
    `;
}

function buildRegionsList(spinner, chosenCity, cities) {
    cityBlock.innerHTML = `
        <div class='search-city'>
            <button class='cross-btn'>
                 <img src='images/close.svg' alt="Убрать">   
            </button>
            <label>
                <input id='searchCity' type='text' placeholder='Любой регион' autofocus>
            </label>
            ${spinner}
            ${chosenCity}
        </div>
            ${cities}
        <div class='save-btn'>
            <button type='button'>Сохранить</button>
        </div>
    `;
    return cityBlock;
}

cityIcon.addEventListener('click', function() {
    if (regions.length === 0) {
        const postData = async (url = '', data = {}) => {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            return response.json();
        }
        city.insertBefore(buildRegionsList(spinner, '',''), city.children[2]);

// Отправка запроса на сервер
        postData('https://studika.ru/api/areas', {})
            .then((data) => {
                for (let i in data) {
                    let regionList = data[i],
                        region = data[i].name;
                    if (regionList.id === 'all') {
                        let regionLi = `
                            <li class="cities-elem">
                                <span class="region-elem">
                                    ${region}
                                </span>
                            </li>
                        `;
                        regions.push(regionLi);
                    } else {
                        let regionLi = `
                            <li class="cities-elem">
                                <span class="region-elem">
                                    ${region}
                                </span>
                            </li>
                        `;
                        regions.push(regionLi);

                        for (let cities of regionList.cities) {
                            let regionLi = `
                                <li class="cities-elem">
                                    <span class="region-elem">${cities.name}</span>
                                    ${region}
                                </li>
                            `;
                            regions.push(regionLi);
                        }
                    }
                }
                data
                    && buildCitiesList(regions)
                    && showChosenCity()
                    && buildRegionsList('', showChosenCity(), buildCitiesList(regions));

                const builder = buildRegionsList('', showChosenCity(), buildCitiesList(regions));
                city.insertBefore(builder, city.children[2]);

                // Живой поиск
                const cities = document.querySelectorAll('.region-elem');
                const input = document.getElementById('searchCity');
                const crossBtn = document.querySelector('.cross-btn');

                input.focus();
                input.oninput = function() {
                    let val = this.value.trim();
                    val ? filterInput(val) : clearInput(input)
                }

                crossBtn.addEventListener('click', clearInput);

                function filterInput(val) {
                    crossBtn.style.display = 'block';
                    cities.forEach(elem => {
                        const city = elem.innerText.search(RegExp(val,'gi')),
                            li = elem.parentNode;
                        let str = elem.innerText;

                        if (city === -1) {
                            li.style.display = 'none';
                        } else {
                            li.style.display = 'flex';
                            elem.innerHTML = insertMark(str, city, val.length);
                        }
                    })
                }

                function clearInput(input) {
                    input.value = '';
                    crossBtn.style.display = 'none';
                    cities.forEach(elem => {
                        const li = elem.parentNode;
                        li.style.display = 'flex';
                        elem.innerHTML = elem.innerText;
                    })
                }

                function insertMark(string, pos, len) {
                    return `
                        ${string.slice(0, pos)}<mark>${string.slice(pos, pos + len)}</mark>${string.slice(pos + len)}
                    `;
                }
            })
            .catch(function (error) {
                console.log(error.message);
            })
    } else {
        let cityBlock = document.querySelector('.choose-city');
        cityBlock.style.display = cityBlock.style.display === 'none' ? 'flex' : 'none';
    }

    document.addEventListener('click', (e) => {
        const cityBlock = document.querySelector('.choose-city'),
            withinBoundaries = e.composedPath().includes(city);

        if (!withinBoundaries && cityBlock.style.display !== 'none') {
            cityBlock.style.display = 'none';
        }
    })

    document.addEventListener('keydown', function (e) {
        if (e.keyCode === 27) {
            document.querySelector('.choose-city').style.display = 'none';
        }
    })
})