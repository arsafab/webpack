// NAVBAR TOGGLE
const navbarToggle = document.querySelector('#navbar-toggle');

const toggleNav = () => {
    const mainNav = document.querySelector('#main-nav');

    navbarToggle.classList.toggle('active');
    mainNav.classList.toggle('active');
};

navbarToggle.addEventListener('click', toggleNav);

