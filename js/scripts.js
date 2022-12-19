const screenWidth = window.innerWidth;
let header = document.querySelector("header");
let container = header.querySelector(".container");
let settings = container.querySelector(".settings");
const logo = container.querySelector(".logo");
const city = container.querySelector(".city");
const search = container.querySelector(".search");
const searchInput = search.querySelector("input");
const menu = container.querySelector(".menu");
const profile = container.querySelector(".profile-btn");

let burger = document.createElement("div");
burger.classList.add('burger-menu');
burger.innerHTML = `
    <a>
        <img src="../images/burger.svg" alt="Меню">
    </a>
`;

if ( screenWidth <= 576 ) {
    container.classList.add("container-block");
    search.classList.add("invisible");
    menu.classList.add("invisible");
    city.style.display = "none";
    profile.style.display = "none";

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

if ( screenWidth <= 768 && screenWidth >= 576 ) {
    settings.insertBefore(burger, settings.children[2]);
    profile.style.margin = "0";
    menu.style.display = "grid";
    menu.style.display = "none";
    search.style.width = "100%";
    searchInput.style.minWidth = "90%";
    container.insertBefore(search, container.children[1]);
}

if ( screenWidth <= 1200 && screenWidth >= 768 ) {
    profile.removeChild(profile.children[0]);
    search.style.width = "100%";
    searchInput.style.minWidth = "90%";
    searchInput.style.fontSize = "10px";
    searchInput.style.padding = "13px 8px 13px 20px";
    profile.style.margin = "0";

    if ( menu.offsetWidth >= container.offsetWidth ) {
        console.log(menu.offsetWidth);
        console.log(container.offsetWidth);

        menuLinks = menu.querySelectorAll('a');
    }

}