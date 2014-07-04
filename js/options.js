var objectSize = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

ejs.open = '{{';
ejs.close = '}}';

var cookieBlockTemplate = document.getElementById('cookieBlock').innerHTML;

$(function(){

  /* Vars */
  var cookies = {},
      $cookiesCount = $('.cookiesCount'),
      $cookiesViewContainer = $('#cookie-block-container'),
      $modalAdd = $('#modalAdd'),
      $modalEdit = $('#modalEdit'),
      $modalDel = $('#modalDel');

  /* Functions */
  var resetLocalStorage = function() {
    cookies = {};
    setCookies();
  };

  var getCookies = function() {
    if(!window.localStorage.cookies) {
      resetLocalStorage();
    }

    try {
      var c = JSON.parse(window.localStorage.cookies)
      return c;
    } catch(e) {
      console.warn('Invalid JSON, storage has been reseted.');
      resetLocalStorage();
      return cookies;
    }
  };

  var setCookies = function() {
    window.localStorage.cookies = JSON.stringify(cookies);
  };

  var setCookie = function(name, value) {
    cookies[name] = [value];
    setCookies();
  };

  var deleteCookie = function(name) {
    delete cookies[name];
    setCookies();
  };

  var addCookieValue = function(name, value) {
    cookies[name].push(value);
    setCookies();
  };

  var removeCookieValue = function(name, value) {
    cookies[name].forEach(function(val, i){
      if( val.value === value ) {
        cookies[name].splice(i, 1);
      }
    });
    setCookies();
  };

  var renderView = function() {
    $cookiesCount.text(objectSize(cookies));
    $cookiesViewContainer.html('');
    $.each(cookies, function(cookieName, cookieValues){
      if(!cookieValues) {
        cookieValues = [];
      }
      var html = ejs.render(cookieBlockTemplate, {cookieName: cookieName, cookieValues: cookieValues});
      $cookiesViewContainer.append(html);
      $('.cookie-block tbody', $cookiesViewContainer).sortable();
    });
  };

  /* Page Load */
  cookies = getCookies();
  renderView();
  chrome.browserAction.setBadgeText({text: objectSize(cookies).toString() });

  /* Events */
  // Reset
  $('#resetButton').click(function(e){
    e.preventDefault();
    if(confirm('Delete config ?')) {
      resetLocalStorage();
      renderView();
    }
  });

  // Add cookie
  $('#addCookieButton').click(function(e){
    e.preventDefault();
    $modalAdd.modal('show');
  });
  $('.saveButton', $modalAdd).click(function(e){
    e.preventDefault;
    var $inputs = $('form input', $modalAdd);
    var name = $inputs.filter('#cookie-name').val();
    var value = $inputs.filter('#cookie-value').val();
    var label = $inputs.filter('#cookie-label-value').val();

    $inputs.filter('#cookie-name').val('');
    $inputs.filter('#cookie-value').val('');
    $inputs.filter('#cookie-label-value').val('');

    setCookie(name, {value: value, label: label});
    renderView();
    $modalAdd.modal('hide');
  });

  // Add cookie value
  $cookiesViewContainer.on('click', '.cookiemodifier-edit', function(e){
    e.preventDefault();

    var $cookieBox = $(this).parents('.cookie-block:first');
    var cookiename = $cookieBox.data().cookiename;

    $modalEdit.find('input[name="name"]').val(cookiename);

    $modalEdit.modal('show');
  });
  $('.saveButton', $modalEdit).click(function(e){
    e.preventDefault;
    var $inputs = $('form input', $modalEdit);
    var name = $inputs.filter('[name="name"]').val();
    var value = $inputs.filter('[name="value"]').val();
    var label = $inputs.filter('[name="label"]').val();

    $inputs.filter('[name="name"]').val('');
    $inputs.filter('[name="value"]').val('');
    $inputs.filter('[name="label"]').val('');

    addCookieValue(name, {value: value, label: label});
    renderView();
    $modalEdit.modal('hide');
  });

  // Delete cookie value
  $cookiesViewContainer.on('click', '.cookiemodifier-delval', function(e) {
    e.preventDefault();

    if( !confirm('Delete ?') ) return;

    var $this = $(this),
        $cookieBox = $(this).parents('.cookie-block:first'),
        cookiename = $cookieBox.data().cookiename,
        cookievalue = $this.parent().find('.cookie-value').text();

    removeCookieValue(cookiename, cookievalue);
    renderView();
  });

  // Delete
  $cookiesViewContainer.on('click', '.cookiemodifier-delete', function(e){
    e.preventDefault();

    if( !confirm('Delete ??') ) return;

    var $cookieBox = $(this).parents('.cookie-block:first');
    var cookiename = $cookieBox.data().cookiename;

    deleteCookie(cookiename);
    renderView();
  });

  $('.cookie-block table tbody').sortable();
  $cookiesViewContainer.on("sortout", '.cookie-block table tbody', function(event, ui){
    var $this = $(this),
        $cookieBox = $(this).parents('.cookie-block:first'),
        cookiename = $cookieBox.data().cookiename;

    var _cookies = [];
    $this.find('tr').each(function(){
      var value = $(this).find('.cookie-value').text();
      for(var i = 0; i <= cookies[cookiename].length; i++) {
        if(cookies[cookiename][i].value == value) {
          _cookies.push(cookies[cookiename][i]);
          break;
        }
      }
    });

    cookies[cookiename] = _cookies;
    setCookies();
  });
});
