const screenWidth = window.innerWidth;
let header = document.querySelector("header");
let container = header.querySelector(".container");
let settings = container.querySelector(".settings");
const logo = container.querySelector(".logo");
const city = container.querySelector(".city");
const search = container.querySelector(".search");
const searchInput = search.querySelector("input");
const menu = container.querySelector(".menu");
const likes = container.querySelector(".like-btn");
const account = container.querySelector(".account");
const profileBtn = container.querySelector(".profile-btn");

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
    container.style.display = "block";
    profileBtn.style.margin = "0";
    menu.style.display = "none";
}

if ( screenWidth <= 1200 && screenWidth >= 769 ) {
    account.removeChild(likes);
    profileBtn.removeChild(profileBtn.children[0]);
    profileBtn.style.marginLeft = "16px";
    search.style.width = "100%";
    searchInput.style.minWidth = "90%";
    menu.style.fontSize = "11px";
}