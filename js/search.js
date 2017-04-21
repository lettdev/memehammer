// Remove protocols + test logs
const PUBLIC_KEY = 'dc6zaTOxFJmzC';
const BASE_URL = 'https://api.giphy.com/v1/gifs/';
const ENDPOINT = 'search';
const LIMIT = 1;
const RATING = 'pg';

let $queryInput = $('.query');
let $resultWrapper = $('.result');
let $loader = $('.loader');
let $inputWrapper = $('.search-box');
let $clear = $('.clear');
let $another = $('.another');
let $copy = $('.copy');
let currentTimeout;
let userDefined = [];

function init() {
  $.getJSON('custom.json')
  .then(data => {
    let userDefined = data;
    $('.container').removeClass('ninja');
    console.log(userDefined);
  })
  .fail(error => {
    console.log(error);
    $('.container').removeClass('ninja');
  });
}
init();

let query = {
  text: null,
  offset: 0,
  request() {
    return `${BASE_URL}${ENDPOINT}?q=${this.text}&limit=${LIMIT}&rating=${RATING}&offset=${this.offset}&api_key=${PUBLIC_KEY}`;
  },
  fetch(callback) {
    console.log(${this.text});
    if (userDefined.length) {
      console.log('okay');
      // let result = userDefined.filter(function( obj ) {
      //   for (var i = 0; i < obj.tags.length; i++) {
      //     if (obj.tags[i] == this.text) {
      //       return obj;
      //     }
      //   }
      // });
      // let url = result[0].url;
      // callback(url);
    } else {
      $.getJSON(this.request())
        .then(data => {
          let results = data.data;
          
          if (results.length) {
            let url = results[0].images.downsized.url;
            console.log(results);
            callback(url);
          } else {
            callback('');
          }
        })
        .fail(error => {
          console.log(error);
        });
    }
  }
}

function buildImg(src = '//giphy.com/embed/xv3WUrBxWkUPC', classes = 'gif hidden') {
  return `<img src="${src}" class="${classes}" alt="gif" />`;
}

$clear.on('click', e => {
  $queryInput.val('');
  $inputWrapper.removeClass('active').addClass('empty');
  $('.gif').addClass('hidden');
  $('.no-results').addClass('hidden');
  $loader.removeClass('done');
  $copy.attr('disabled', '');
  $another.attr('disabled', '');
  $copy.removeClass('button-success');
  $another.removeClass('button-success');
});

$another.on('click', e => {
  query.offset = Math.floor(Math.random() * 25);
  
  query.fetch(url => {
    if (url.length) {
      $resultWrapper.html(buildImg(url));

      $copy.removeAttr('disabled');
      $another.removeAttr('disabled');
      $copy.addClass('button-success');
      $another.addClass('button-success');
    } else {
      $resultWrapper.html(`<p class="no-results hidden">There is nothing related to <strong>${query.text}</strong>. Are you fucking high?</p>`);

      $copy.attr('disabled', '');
      $another.attr('disabled', '');
      $copy.removeClass('button-success');
      $another.removeClass('button-success');
    }

    $loader.addClass('done');
    currentTimeout = setTimeout(() => {
      $('.hidden').toggleClass('hidden');
    }, 1000);
  });
});

$queryInput.on('keyup', e => {
  let key = e.which || e.keyCode;
  query.text = $queryInput.val();
  query.offset = Math.floor(Math.random() * 25);
  
  if (currentTimeout) {
    clearTimeout(currentTimeout);
    $loader.removeClass('done');
  }
  
  currentTimeout = setTimeout(() => {
    currentTimeout = null;
    $('.gif').addClass('hidden');
    
    if (query.text && query.text.length) {
      $inputWrapper.addClass('active').removeClass('empty');
      
      query.fetch(url => {
        if (url.length) {
          $resultWrapper.html(buildImg(url));
          
          $copy.removeAttr('disabled');
          $another.removeAttr('disabled');
          $copy.addClass('button-success');
          $another.addClass('button-success');
        } else {
          $resultWrapper.html(`<p class="no-results hidden">There is nothing related to <strong>${query.text}</strong>. Are you fucking high?</p>`);
          
          $copy.attr('disabled', '');
          $another.attr('disabled', '');
          $copy.removeClass('button-success');
          $another.removeClass('button-success');
        }
        
        $loader.addClass('done');
        currentTimeout = setTimeout(() => {
          $('.hidden').toggleClass('hidden');
        }, 1000);
      });
    } else {
      $inputWrapper.removeClass('active').addClass('empty');
      $copy.attr('disabled', '');
      $another.attr('disabled', '');
      $copy.removeClass('button-success');
      $another.removeClass('button-success');
    }
  }, 1000);
});

let clipboard = new Clipboard('.copy', {
  text: function(trigger) {
    return $resultWrapper.find('.gif').attr('src');
  }
});
clipboard.on('success', function(e) {
    $copy.text('Copied!');
    $copy.addClass('button-note');
    setTimeout(function() {
      $copy.text("Copy URL");
      $copy.removeClass('button-note');
    }, 2000);
});
clipboard.on('error', function(e) {
    console.log('fail vcl');
});