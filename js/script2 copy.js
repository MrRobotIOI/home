let slideIndex = [1,1];
/* Class the members of each slideshow group with different CSS classes */
let slideId = ["mySlides1", "mySlides2", "mySlides3"]
showSlidescopy(1, 0);
showSlidescopy(1, 1);

function plusSlidescopy(n, no) {
  showSlidescopy(slideIndex[no] += n, no);
}

function showSlidescopy(n, no) {
  let i;
  let x = document.getElementsByClassName(slideId[no]);
  if (n > x.length) {slideIndex[no] = 1}
  if (n < 1) {slideIndex[no] = x.length}
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  x[slideIndex[no]-1].style.display = "block";
}