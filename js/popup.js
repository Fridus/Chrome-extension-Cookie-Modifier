
var objectSize = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

$(function(){

  /* Functions */

  var getCookies = function(callback) {
    chrome.tabs.query({active : true, currentWindow: true}, function (tab) {
      var tabUrl = tab[0].url;
      chrome.cookies.getAll({'url': tabUrl}, function(cookies) {
        if(callback) {
          return callback(cookies);
        }
      });
    });
  };

  var getCookie = function(name, callback) {
    chrome.tabs.query({active : true, currentWindow: true}, function (tab) {
      var tabUrl = tab[0].url;
      chrome.cookies.get({'url': tabUrl, 'name': name}, function(cookies) {
        if(callback) {
          return callback(cookies);
        }
      });
    });
  };

  var getCookiesStored = function() {
    if(!window.localStorage.cookies) {
      {};
     }

    try {
      var c = JSON.parse(window.localStorage.cookies)
      return c;
    } catch(e) {
      console.warn('Invalid JSON, storage has been reseted.');
      return {};
    }
  };

  var getCookiesStoredName = function(cookies) {
    var cNames = [];
    $.each(cookies, function(cookieName){
      cNames.push(cookieName);
    });
    return cNames;
  }

  var setCookieValue = function(name, value, callback) {
    chrome.tabs.query({active : true, currentWindow: true}, function (tab) {
      var tabUrl = tab[0].url;

      getCookies(function(cookies) {
        cookies.forEach(function(cookie){
          if(cookie.name === name) {
            cookie.url = tabUrl;

            var cParams = {
              url: tabUrl,
              name: cookie.name,
              value: value,
              domain: cookie.domain,
              path: cookie.path,
              secure: cookie.secure,
              httpOnly: cookie.httpOnly,
              storeId: cookie.storeId,
              expirationDate: cookie.expirationDate
            };

            chrome.cookies.set(cParams, function(c) {
              if(callback) {
                return callback(c);
              }
            });
          }
        });
      });

    });
  };

  var renderView = function($el, cookies) {
    $el.html('');

    if( !objectSize(cookies) ) {
      // TODO: disable module
      $el.text('No cookies found.');
      return;
    }

    // TODO: enable module

    var html = $('<div />');

    $.each(cookies, function(cookieName, cookieValues){
      html.append($('<h4 />').text(cookieName));
      cookieValues.forEach(function(value){
        var input = $('<input type="radio" />').attr('name', cookieName).val(value);
        getCookie(cookieName, function(c){
          if( c.value === value ) {
            input.attr('checked', 'checked');
          }
        });
        html.append(
          $('<label />').addClass('radio').append(input).append(value)
        )
      });
    });

    $el.append(html);
  };


  /* Load */

  var cookiesFiltered = {};
  var $container = $('.cookies-list');
  getCookies(function(cookies){
    var c = getCookiesStored();
    var cKeys = getCookiesStoredName(c);
    

    cookies.forEach(function(cookie) {
      if( cKeys.indexOf(cookie.name) >= 0 ) {
        cookiesFiltered[cookie.name] = c[cookie.name];
      }
    });

    renderView($container, cookiesFiltered);
    chrome.browserAction.setBadgeText({text: objectSize(cookiesFiltered).toString() });
  });


  /* Events */

  $container.on('change', 'input', function(e) {
    var $this = $(this),
        name = $this.attr('name'),
        value = $this.val();

    setCookieValue(name, value, function(cookie) {
      $container.html('Reloading...');
      chrome.tabs.reload(null, null, function(){
        setTimeout(function(){
          window.location = 'popup.html'
        }, 1000);
        console.log('reload');
      })
    });
  });

  $('.optionsLink').click(function(e){
    e.preventDefault();
    chrome.tabs.create({'url': chrome.extension.getURL('options.html')}, function(tab) {
      // Tab opened.
    });
  });

});