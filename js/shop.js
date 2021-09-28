$(document).ready(function () {
  showProducts();
  showCategories();
  showModal();

  $('#sort').click(sort);
  $('#search').keyup(search);

  $(window).on('scroll', function () {
    if ($(window).scrollTop()) {
      $('#top-header').addClass('scroll');
    } else {
      $('#top-header').removeClass('scroll');
    }
  });
});

function hover() {
  $('.product').hover(
    function () {
      $(this).find('.details').stop(true, true).fadeIn();
      $(this).find('.second').stop(true, true).fadeIn();
    },
    function () {
      $(this).find('.details').stop(true, true).fadeOut();
      $(this).find('.second').stop(true, true).fadeOut();
    }
  );
}
function showProducts() {
  $.ajax({
    url: 'data/products.json',
    method: 'GET',
    dataType: 'json',
    success: function (products) {
      printNewProducts(products);
      printAllProducts(products);
    },
    error: function (error) {
      console.log(error);
    },
  });
}
function printNewProducts(products) {
  let html = '';
  for (let d of products) {
    if (d.newest == 1) {
      html += printOne(d);
    }
  }
  hover();
  $('#container .row').html(html);
  $('.details').click(function (e) {
    e.preventDefault();
    showModal($(this).attr('data-idp'));
  });
}

function printOne(d) {
  return `
    <div class="col-md-3 col-sm-6 single">
        <div class="product">
            <button type="button" class="btn btn-lg details" data-idp="${d.id}">Quick view</button>
            <img src="${d.img}" alt="${d.name}"/>
            <h3>${d.name}</h3>
            <p>&#36;${d.price}.00</p>
            <img src="${d.imgHover}" alt="${d.name}" class="second"/>
        </div>
      </div>
    `;
}

function showCategories() {
  $.ajax({
    url: 'data/categories.json',
    method: 'GET',
    dataType: 'json',
    success: function (data) {
      printCategories(data);
    },
    error: function (error) {
      console.log(error);
    },
  });
}
function printCategories(data) {
  let html = '';
  for (let d of data) {
    html += `
            <li><a href="#" class="cat" data-id="${d.id}">${d.name}</a></li>
        `;
  }
  $('#categories').html(html);
  $('.cat').click(filter);
}
function printAllProducts(products) {
  let html = '';
  for (let d of products) {
    html += `
        <div class="col-md-4 col-sm-6 shop">
            <div class="product">
                <button type="button" class="btn btn-lg details" data-idp="${d.id}">Quick view</button>
                <img src="${d.img}" alt="${d.name}">                
                <h3>${d.name}</h3>
                <p>&#36;${d.price}.00</p>
                <img src="${d.imgHover}" alt="${d.name}" class="second">
            </div>
        </div>
        `;
  }
  $('#all .row').html(html);
  hover();
  $('.details').click(function (e) {
    e.preventDefault();
    showModal($(this).attr('data-idp'));
  });
}

function filter(e) {
  e.preventDefault();
  let idCat = $(this).data('id');
  $.ajax({
    url: 'data/products.json',
    method: 'GET',
    dataType: 'json',
    success: function (data) {
      data = data.filter(x => x.category.id == idCat);
      printAllProducts(data);
    },
    error: function (error) {
      console.log(error);
    },
  });
}
function sort() {
  let option = $(this).val();
  $.ajax({
    url: 'data/products.json',
    method: 'GET',
    dataType: 'json',
    success: function (data) {
      if (option == 'a-z') {
        data.sort(function (a, b) {
          let nameA = a.name.toLowerCase();
          let nameB = b.name.toLowerCase();
          if (nameA > nameB) return 1;
          else if (nameA < nameB) return -1;
          else return 0;
        });
      }
      if (option == 'z-a') {
        data.sort(function (a, b) {
          let nameA = a.name.toLowerCase();
          let nameB = b.name.toLowerCase();
          if (nameA < nameB) return 1;
          else if (nameA > nameB) return -1;
          else return 0;
        });
      }
      if (option == 'lowHigh') {
        data.sort(function (a, b) {
          let priceA = a.price;
          let priceB = b.price;
          if (priceA > priceB) return 1;
          else if (priceA < priceB) return -1;
          else return 0;
        });
      }
      if (option == 'highLow') {
        data.sort(function (a, b) {
          let priceA = a.price;
          let priceB = b.price;
          if (priceA < priceB) return 1;
          else if (priceA > priceB) return -1;
          else return 0;
        });
      }
      printAllProducts(data);
    },
  });
}
function search() {
  const word = $(this).val();
  $.ajax({
    url: 'data/products.json',
    method: 'GET',
    dataType: 'json',
    success: function (data) {
      const result = data.filter(x => {
        if (x.name.toLowerCase().indexOf(word.toLowerCase()) !== -1) {
          return true;
        }
      });
      printAllProducts(result);
    },
  });
}

function showModal(idp) {
  $.ajax({
    url: 'data/products.json',
    method: 'GET',
    dataType: 'json',
    success: function (data) {
      var product;
      for (p of data) {
        if (p.id == idp) {
          product = p;
          break;
        }
      }
      printModal(product);
    },
    error: function (error) {
      console.log(error);
    },
  });
}
function printModal(d) {
  var html = '';
  html += `
    <div class="col-sm-6">
        <img src="${d.img}" alt="${d.name}">
    </div>
    <div class="col-sm-6 description">
        <h5>${d.name}</h5>
        <span class="linija"></span>
        <p>Price: &#36;${d.price}.00</p>
        <p>${d.description}</p>
        <select id="sizes">
            ${displaySizes(d.sizes)}
        </select>
        <button type="button" data-id="${
          d.id
        }" id="add-to-cart">Add To Cart</button>
        <span class="modalProduct-close">X</span>
    </div>
    `;
  document.querySelector('.modalProduct').innerHTML = html;

  var modalBg = document.querySelector('.modalProduct-bg');

  $('.details').click(function () {
    modalBg.classList.add('product-active');
  });
  $('.modalProduct-close').click(function () {
    modalBg.classList.remove('product-active');
  });
}
function displaySizes(sizes) {
  let html = '';
  let br = 0;
  sizes.forEach(element => {
    html += `<option value="${++br}">${element.name}</option>`;
  });
  return html;
}

$('#cart').click(function () {
  document.querySelector('.cart-overlay').classList.add('transparentBcg');
  document.querySelector('.cart').classList.add('showCart');
});

$('.close-cart').click(function () {
  document.querySelector('.cart-overlay').classList.remove('transparentBcg');
  document.querySelector('.cart').classList.remove('showCart');
});

$('.modalProduct').on('click', function (event) {
  if (event.target.matches('#add-to-cart')) {
    const id = event.target.closest('#add-to-cart').dataset.id;
    document.querySelector('.cart-overlay').classList.add('transparentBcg');
    document.querySelector('.cart').classList.add('showCart');
    document
      .querySelector('.modalProduct-bg')
      .classList.remove('product-active');
    addToCart(parseInt(id));
  }
});
