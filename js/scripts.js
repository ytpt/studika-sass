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
                for (let i = 0; i < data.length; i++) {
                    let regionList = data[i],
                        region = data[i].name,
                        regionLi;
                    if (regionList.id === 'all') {
                        regionLi = `
                            <li class="cities-elem">
                                <span class="region-elem">
                                    ${region}
                                </span>
                            </li>
                        `;
                        regions.push(regionLi);
                    } else {
                        regionLi = `
                            <li class="cities-elem">
                                <span class="region-elem">
                                    ${region}
                                </span>
                            </li>
                        `;
                        regions.push(regionLi);

                        for (let cities of regionList.cities) {
                            regionLi = `
                                <li class="cities-elem">
                                    <span class="region-elem">${cities.name}</span>
                                    ${region}
                                </li>
                            `;
                            regions.push(regionLi);
                        }
                    }
                }
                const builder = buildRegionsList('', showChosenCity(), buildCitiesList(regions));

                data
                    && buildCitiesList(regions)
                    && showChosenCity()
                    && buildRegionsList('', showChosenCity(), buildCitiesList(regions));

                city.insertBefore(builder, city.children[2]);

                // Живой поиск
                const cities = document.querySelectorAll('.region-elem');
                liveSearching(cities);

                // Управление выбранным городом в блоке chosenCity
                manageChosenCity(cities);
            })
            .catch(function (error) {
                console.log(error.message);
            })
    } else {
        let cityBlock = document.querySelector('.choose-city');
        cityBlock.style.display = cityBlock.style.display === 'none' ? 'flex' : 'none';
    }

    document.addEventListener('click', (e) => {
        let withinBoundaries = e.composedPath().includes(city);

        if (!withinBoundaries && cityBlock.style.display !== 'none') {
            cityBlock.style.display = 'none';
        }
    })

    document.addEventListener('keydown', function (e) {
        if (e.keyCode === 27) {
            document.querySelector('.choose-city').style.display = 'none';
        }
    })

    function buildCitiesList(regions) {
        return `
        <ul class='cities'>
            ${regions.join(' ')}
        </ul>
    `;
    }

    function showChosenCity() {
        return `
        <div class='city-elem'>
            <p>Москва</p>
            <a>
                <img src='./images/cross.svg' alt='Убрать'>
            </a>
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
            <div class='chosen-city'>
                ${chosenCity}
            </div>
        </div>
            ${cities}
        <div class='save-btn'>
            <button type='button'>Сохранить</button>
        </div>
    `;
        return cityBlock;
    }

    function filterInput(val, cities) {
        document.querySelector('.cross-btn').style.display = 'block';
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

    function clearInput(input, cities) {
        input.value = '';
        document.querySelector('.cross-btn').style.display = 'none';
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

    function liveSearching(cities) {
        const input = document.getElementById('searchCity');
        const crossBtn = document.querySelector('.cross-btn');

        input.focus();
        input.oninput = function() {
            let val = this.value.trim();
            val ? filterInput(val, cities) : clearInput(input)
        }
        crossBtn.addEventListener('click', () => {
            clearInput(input, cities);
        });
    }

    function manageChosenCity(cities) {
        let chosenCityBlock = document.querySelector('.chosen-city');
        let moscowElem = chosenCityBlock.querySelector('.city-elem');

        moscowElem.querySelector('a').addEventListener('click', function() {
            chosenCityBlock.removeChild(moscowElem);
            if (!moscowElem) {
                chosenCityBlock.style.display = 'none';
            }
        })

        cities.forEach(city => {
            city.parentNode.addEventListener('click', function() {
                let chosenCitiesP = chosenCityBlock.querySelectorAll('.city-elem p');
                let isCityExist = false;

                let cloneElem = moscowElem.cloneNode(true);
                const cityName = city.textContent.trim();
                cloneElem.querySelector('p').innerHTML = cityName;

                chosenCitiesP.forEach(elem => {
                    if (elem.textContent === cityName) {
                        isCityExist = true;
                        softDeleteElem(chosenCityBlock, elem.parentNode);
                    }
                })

                if (!isCityExist) {
                    cloneElem.querySelector('a').addEventListener('click', function() {
                        softDeleteElem(chosenCityBlock, cloneElem);
                        if (!chosenCitiesP) {
                            chosenCityBlock.style.display = 'none';
                        }
                    })
                    chosenCityBlock.appendChild(cloneElem);
                    chosenCityBlock.style.display = 'flex';
                }
            });
        })
    }
    function softDeleteElem(parent, elem) {
        setTimeout(function() {
            elem.style.opacity = '0';
            setTimeout(function() {
                parent.removeChild(elem);
            }, 400);
        }, 200);
    }
})