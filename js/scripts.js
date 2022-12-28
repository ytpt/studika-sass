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

//Выпадающий список городов
let regions = [];

function buildRegionsList(regions) {
    let cityBlock = document.createElement('div');
    cityBlock.classList.add('choose-city');

    cityBlock.innerHTML = `
        <div class='search-city'>
            <label>
                <input type='text' placeholder='Любой регион' autofocus>
            </label>
            <div class='chosen-city' >
                <div class='city-elem'>
                    <p>Москва</p>
                    <a>
                        <img src='./images/cross.svg' alt='Удалить'>
                    </a>
                </div>
            </div>
        </div>
        <div class='cities'>
            ${regions}
        </div>
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
        //Отправка запроса
        postData('https://studika.ru/api/areas', {})
            .then((data) => {
                console.log(data)
                data.forEach(obj => {
                    regions += `<a>${obj.name}</a>`;
                })

            const regionsListDOM = buildRegionsList(regions);
            city.insertBefore(regionsListDOM, city.children[2]);
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