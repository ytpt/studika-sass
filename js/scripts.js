const screenWidth = window.innerWidth;
let header = document.querySelector("header");
let container = header.querySelector(".container");
let settings = container.querySelector(".settings");
const logo = container.querySelector(".logo");
const city = settings.querySelector(".city");
const search = settings.querySelector(".search");
const searchInput = search.querySelector("input");
const menu = container.querySelector(".menu");
const account = settings.querySelector(".account");
const likes = account.querySelector(".like-btn");
const profileBtn = account.querySelector(".profile-btn");

let burger = document.createElement("div");
burger.classList.add('burger-menu');
burger.innerHTML = `
    <a>
        <img src="../images/burger.svg" alt="Меню">
    </a>
`;

if ( screenWidth <= 600 ) {
    container.classList.add("container-block");
    search.classList.add("invisible");
    menu.classList.add("invisible");
    city.style.display = "none";
    profileBtn.style.display = "none";

    settings.insertBefore(burger, logo);

    let back = document.createElement("div");
    back.classList.add("back");
    back.innerHTML = `
        <button type="button">
            <img src="../images/arrow-left.svg" alt='Влево'>
            <p>Назад</p>
        </button>
    `;
    header.appendChild(back);
}

if ( screenWidth <= 768 && screenWidth >= 601 ) {
    settings.removeChild(search);
    settings.insertBefore(burger, settings.children[1]);
    container.classList.add("visible");
    menu.classList.add("invisible");
}

if ( screenWidth <= 1200 && screenWidth >= 769 ) {
    account.removeChild(likes);
    profileBtn.removeChild(profileBtn.children[0]);
    profileBtn.style.marginLeft = "16px";
    search.style.width = "100%";
    searchInput.style.minWidth = "90%";
    menu.style.fontSize = "11px";
}

//Выпадающий список городов
let cityList = [];
city.addEventListener("click", function() {
    let isShown = true;
    if (cityList.length === 0) {
        const postData = async (url = "", data = {}) => {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
            return response.json();
        }
        //Отправка запроса
        postData("https://studika.ru/api/areas", {})
            .then((data) => {
                data.map(obj => {
                    let objList = obj.name;
                    return objList.map(function(city) {
                        let li = document.createElement('li');
                    })

                    //Построение выпадающего списка
                    let cityBlock = document.createElement("div");
                    cityBlock.classList.add("choose-city");
                    cityBlock.innerHTML = `
                        <div class="find-city">
                            <input type="text" placeholder="Любой регион">
                            <a class="city-btn">
                                <p>Москва</p>
                                <img src="../images/cross.svg" alt="Удалить">
                            </a>
                        </div>
                        <div class="city-list">
                            <ul>${objList}</ul>
                        </div>
                        <button>Сохранить</button>
                    `;
                })
            })
            .catch(function(error) {
                console.log(error.message);
            })
    }
})