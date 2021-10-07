//Lazyloading add simple support for background images:
document.addEventListener('lazybeforeunveil', function (e) {
    var bg = e.target.getAttribute('data-bg');
    if (bg) {
        e.target.style.backgroundImage = 'url(' + bg + ')';
    }
});

// Burger functionality

var burger = document.getElementById('burger');
var menu = document.getElementById('menu');

burger.addEventListener('click', function (event) {
    if (this.classList.contains('open')) {
        this.classList.remove('open');
        menu.classList.remove('open');
    } else {
        this.classList.add('open');
        menu.classList.add('open');
    }
});