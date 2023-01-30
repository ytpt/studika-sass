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
        const spinner = `
            <div class='preloader-wrap'>
                <div class='preloader'>
                    <div></div>
                </div>
            </div>
        `;

        city.insertBefore(buildRegionsList(spinner, '',''), city.children[2]);

// Отправка запроса на сервер
        postData('https://studika.ru/api/areas', {})
            .then((data) => {
                for (let i = 0; i < data.length; i++) {
                    let regionList = data[i];
                    let region = data[i].name;
                    if (regionList.id === 'all'){
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
                if (data) {
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

                    const builder = buildRegionsList('', showChosenCity(), buildCitiesList(regions));
                    city.insertBefore(builder, city.children[2]);

                    // Живой поиск
                    const cities = document.querySelectorAll('.region-elem');
                    const input = document.getElementById('searchCity');
                    const crossBtn = document.querySelector('.cross-btn');
                    input.focus();
                    input.oninput = function() {
                        let val = this.value.trim();
                        if (val) {
                            crossBtn.style.display = 'block';
                            crossBtn.addEventListener('click', function() {
                                input.value = '';
                                clearInput();
                            });
                            cities.forEach(function(elem) {
                                if (elem.innerText.search(RegExp(val,'gi')) === -1) {
                                    const li = elem.parentNode;
                                    li.style.display = 'none';
                                } else {
                                    const li = elem.parentNode;
                                    li.style.display = 'flex';
                                    let str = elem.innerText;
                                    elem.innerHTML = insertMark(str, elem.innerText.search(RegExp(val,'gi')), val.length);
                                }
                            })
                        } else {
                            input.value = '';
                            clearInput();
                        }
                    }

                    function clearInput() {
                        crossBtn.style.display = 'none';
                        cities.forEach(function(elem) {
                            const li = elem.parentNode;
                            li.style.display = 'flex';
                            elem.innerHTML = elem.innerText;
                        })
                    }

                    function insertMark(string, pos, len) {
                        return string.slice(0, pos) + '<mark>' + string.slice(pos, pos + len) +
                            '</mark>' + string.slice(pos + len);
                    }
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
        let cityBlock = document.querySelector('.choose-city');
        const withinBoundaries = e.composedPath().includes(city);

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