window.onload = function () {
  showMenu();
  showSlider();
  showSocials();

  getArticles();

  $(window).on('beforeunload', function () {
    $(window).scrollTop(0);
  });
  var sub = document.querySelector('#submit');
  sub.addEventListener('click', emailValidationSubscribe);
  var button = document.querySelector('#valBtn');
  button.addEventListener('click', Validation);
};
/* Menu */

function showMenu() {
  $.ajax({
    url: 'data/menu.json',
    method: 'GET',
    dataType: 'json',
    success: function (data) {
      printMenu(data);
    },
    error: function (error) {
      console.log(error);
    },
  });
}
function printMenu(data) {
  let html = '';
  for (let d of data) {
    html += `
        <li class="nav-item ${isActiveLink(d)}">
            <a class="nav-link" href="${d.href}">${d.text}</a>
        </li>`;
  }
  document.querySelector('#navigationLinks').innerHTML = html;
  document.querySelector('.links ul').innerHTML = html;
}

function isActiveLink(d) {
  return document.URL.indexOf(d.href) != -1 ||
    (document.URL.indexOf('.html') == -1 && d.href == 'index.html')
    ? 'active'
    : '';
}
/* Slider */

function showSlider() {
  $.ajax({
    url: 'data/slider.json',
    method: 'GET',
    dataType: 'json',
    success: function (data) {
      printSlider(data);
    },
    error: function (error) {
      console.log(error);
    },
  });
}
function printSlider(data) {
  let html = '';
  for (let d of data) {
    html += `
        <li class="${d.classLi}">
            <img src="${d.src}" alt="${d.alt}" class="${d.classImg}"/>
            <div class="text">
                <h2>${d.header}</h2>
                <p>${d.text}</p>
                <a href="${d.href}">${d.link}</a>
            </div>
        </li>`;
  }

  document.querySelector('.slider-ul').innerHTML = html;

  var container = document.querySelector('.slider-ul');
  var slides = Array.from(container.children);
  var nextButton = document.querySelector('.slider-button.right');
  var prevButton = document.querySelector('.slider-button.left');
  var dots = document.querySelector('.slider-indicators');
  var dot = Array.from(dots.children);

  var slideWidth = slides[0].getBoundingClientRect().width;

  slides.forEach((slide, index) => {
    slide.style.left = slideWidth * index + 'px';
  });

  function moveToSlide(container, currentSlide, targetSlide) {
    container.style.transform = 'translateX(-' + targetSlide.style.left + ')';
    currentSlide.classList.remove('current-slider');
    targetSlide.classList.add('current-slider');
  }
  function updateDots(currentDot, targetDot) {
    currentDot.classList.remove('current-slide');
    targetDot.classList.add('current-slide');
  }
  function hideShowArrows(slides, prevButton, nextButton, targetIndex) {
    if (targetIndex === 0) {
      prevButton.classList.add('is-hidden');
      nextButton.classList.remove('is-hidden');
    } else if (targetIndex === slides.length - 1) {
      prevButton.classList.remove('is-hidden');
      nextButton.classList.add('is-hidden');
    } else {
      prevButton.classList.remove('is-hidden');
      nextButton.classList.remove('is-hidden');
    }
  }
  prevButton.addEventListener('click', e => {
    let currentSlide = container.querySelector('.current-slider');
    let prevSlide = currentSlide.previousElementSibling;
    let currentDot = dots.querySelector('.current-slide');
    let prevDot = currentDot.previousElementSibling;
    let prevIndex = slides.findIndex(slide => slide === prevSlide);

    moveToSlide(container, currentSlide, prevSlide);
    updateDots(currentDot, prevDot);
    hideShowArrows(slides, prevButton, nextButton, prevIndex);
  });
  nextButton.addEventListener('click', e => {
    let currentSlide = container.querySelector('.current-slider');
    let nextSlide = currentSlide.nextElementSibling;
    let currentDot = dots.querySelector('.current-slide');
    let nextDot = currentDot.nextElementSibling;
    let nextIndex = slides.findIndex(slide => slide === nextSlide);

    moveToSlide(container, currentSlide, nextSlide);
    updateDots(currentDot, nextDot);
    hideShowArrows(slides, prevButton, nextButton, nextIndex);
  });

  dots.addEventListener('click', e => {
    let targetDot = e.target.closest('button');
    if (!targetDot) return;

    let currentSlide = container.querySelector('.current-slider');
    let currentDot = dots.querySelector('.current-slide');
    let targetIndex = dot.findIndex(d => d === targetDot);
    let targetSlide = slides[targetIndex];

    moveToSlide(container, currentSlide, targetSlide);
    updateDots(currentDot, targetDot);
    hideShowArrows(slides, prevButton, nextButton, targetIndex);
  });
}
function showSocials() {
  $.ajax({
    url: 'data/socials.json',
    method: 'GET',
    dataType: 'json',
    success: function (data) {
      printSocials(data);
    },
    error: function (error) {
      console.log(error);
    },
  });
}
function printSocials(data) {
  let html = '';
  for (let d of data) {
    html += `
        <a href="${d.href}" class="${d.name}"></a>
        `;
  }
  document.querySelector('.social').innerHTML = html;
}

function getArticles() {
  $.ajax({
    url: 'data/articals.json',
    method: 'get',
    dataType: 'json',
    success: function (articals) {
      printBlogs(articals);
    },
    error: function (error) {
      console.log(error);
    },
  });
}

function printBlogs(articals) {
  let html = '';
  for (let a of articals) {
    html += `
        <div class="col-md-6 col-sm-12">
            <div class="content">
                <h3>${a.name}</h3>
                <img src="${a.image}" alt="${a.name}"/>
                <p class="date">Posted on ${a.date}</p>
                <p class="textBlog text-hidden">${a.text}</p>
                <a class="js-show-more">Show More</a>
            </div>
        </div>
        `;
  }
  document.querySelector('.blogs .row').innerHTML = html;
}

$(document).on('click', function (event) {
  if (event.target.matches('.js-show-more')) {
    const linkText = event.target.textContent.toLowerCase();
    const blog = event.target.previousElementSibling;
    if (linkText == 'show more') {
      event.target.textContent = 'Show Less';
      blog.classList.remove('text-hidden');
      blog.classList.add('text-visible');
    } else {
      event.target.textContent = 'Show More';
      blog.classList.remove('text-visible');
      blog.classList.add('text-hidden');
    }
  }
});
/* Validation */

function Validation() {
  valid = true;
  nameValidation();
  lastNameValidation();
  emailValidation();
  textAreaValidation();
  if (valid) {
    document.querySelector('#box-overlay').style.visibility = 'visible';
    document.querySelector('#box-overlay').style.opacity = '1';
  }
}

function nameValidation() {
  var name = document.querySelector('#name');
  var regName = /^[A-ZŽŠĐČĆ][a-zšđčćž]{1,11}$/;

  if (name.value.trim() == '') {
    document.querySelector('#errorName').style.display = 'block';
    valid = false;
  } else if (!regName.test(name.value)) {
    document.querySelector('#errorName').style.display = 'block';
    valid = false;
  } else {
    document.querySelector('#errorName').style.display = 'none';
  }
}
function lastNameValidation() {
  var lastName = document.querySelector('#lastName');
  var regLastName =
    /^([A-ZŽŠĐČĆ][a-zšđčćž]{2,15})(\s[AZŽŠĐČĆ][a-zšđčćž]{2,15})*$/;

  if (lastName.value.trim() == '') {
    document.querySelector('#errorLastName').style.display = 'block';
    valid = false;
  } else if (!regLastName.test(lastName.value)) {
    document.querySelector('#errorLastName').style.display = 'block';
    valid = false;
  } else {
    document.querySelector('#errorLastName').style.display = 'none';
  }
}
function emailValidation() {
  var mail = document.querySelector('#mail');
  var regMail = /^(\w|\d)\S*@\S+\.(\w|\d){2,}$/;
  if (!regMail.test(mail.value)) {
    document.querySelector('#errorMail').style.display = 'block';
    valid = false;
  } else {
    document.querySelector('#errorMail').style.display = 'none';
  }
}
function textAreaValidation() {
  var text = document.querySelector('#message');
  if (text.value == '') {
    document.querySelector('#errorTextArea').style.display = 'block';
    valid = false;
  } else {
    document.querySelector('#errorTextArea').style.display = 'none';
  }
}
function emailValidationSubscribe() {
  var mail = document.querySelector('#mailSubscribe');
  var regMail = /^(\w|\d)\S*@\S+\.(\w|\d){2,}$/;
  valid = true;
  if (!regMail.test(mail.value)) {
    document.querySelector('#errorMailSubscribe').style.display = 'block';
    valid = false;
  } else {
    document.querySelector('#errorMailSubscribe').style.display = 'none';
  }
  if (valid) {
    document.querySelector('#box-overlay').style.visibility = 'visible';
    document.querySelector('#box-overlay').style.opacity = '1';
  }
}
var closeBtn = document.querySelector('.closeBtn');
closeBtn.addEventListener('click', function () {
  document.querySelector('#box-overlay').style.visibility = 'hidden';
  document.querySelector('#box-overlay').style.opacity = '0';
});
