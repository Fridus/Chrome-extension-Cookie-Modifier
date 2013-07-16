
$(function(){

  /* Functions */

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
    //

    var html = $('<div />');

    $.each(cookies, function(cookieName, cookieValues){
      html.append($('<h4 />').text(cookieName));
      cookieValues.forEach(function(valueObj){
        var input = $('<input type="radio" />').attr('name', cookieName).val(valueObj.value);
        getCookie(cookieName, function(c){
          if( c.value === valueObj.value ) {
            input.attr('checked', 'checked');
          }
        });
        var labelText = '';
        if( typeof valueObj == 'object' ) {
          if( valueObj.label && valueObj.label.length ) {
            labelText = valueObj.label;
          } else {
            labelText = valueObj.value;
          }
        } else {
          labelText = valueObj;
        }
        html.append(
          $('<label />').addClass('radio').append(input).append(labelText)
        )
      });
    });

    $el.append(html);
  };


  /* Load */

  var $container = $('.cookies-list');
  updateCookiesFiltered(function(){
    renderView($container, cookiesFiltered);
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