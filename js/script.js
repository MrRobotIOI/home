var html = document.getElementsByTagName("html")[0];
var lmode = document.querySelector('.switch .wrapper');

lmode.onclick = function () {
    if (html.classList.contains("clicked")) {
        html.classList.remove("clicked");
    } else {
        html.classList.add("clicked");
    }
}