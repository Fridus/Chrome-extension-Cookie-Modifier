var ObjectSize = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

ejs.open = '{{';
ejs.close = '}}';

var cookieBlockTemplate = '<div class="cookie-block" id="cookie-{{= cookieName }}"><table class="table table-bordered table-striped"><tr><th rowspan="3">{{= cookieName }}</th><td>{{= cookieValues[0]}}</td></tr>{{ for(var i = 1; i < cookieValues.length; i++) { }}      <tr>        <td>{{= cookieValues[1]}}</td>      </tr>      {{ } }}    </table>    <button class="cookiemodifier-delete btn btn-danger"><i class="icon-trash icon-white"></i> Delete...</button>    <button class="cookiemodifier-edit btn btn-primary" data-toggle="modal" data-target="#myModal"><i class="icon-pencil icon-white"></i> Edit...</button><div/>';

$(function(){
  
  /* Vars */
  var cookies = {},
      $cookiesCount = $('.cookiesCount'),
      $cookiesViewContainer = $('#cookie-block-container'),
      $modalAdd = $('#modalAdd');

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
    window.localStorage.cookies[name].forEach(function(val, i){
      console.log(val, i);
      if( val === value) {
        // delete
        // break
      }
    });
    //setCookies();
  };

  var renderView = function() {
    $cookiesCount.text(ObjectSize(cookies));
    $cookiesViewContainer.html('');
    var template = cookieBlockTemplate;
    $.each(cookies, function(cookieName, cookieValues){
      var html = ejs.render(template, {cookieName: cookieName, cookieValues: cookieValues});
      $cookiesViewContainer.append(html);
    });
  };

  /* Page Load */
  cookies = getCookies();
  renderView();

  /* Events */
  // Reset
  $('#resetButton').click(function(e){
    e.preventDefault();
    if(confirm('Delete config ?')) {
      resetLocalStorage();
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

    setCookie(name, value);
    renderView();
    $modalAdd.modal('hide');
  });
  // edit and delete => show modal
  // $().on('click', ..., function(){})
  //$('#myModal').modal('show')

  // modal button -> action



});

/*
  
  - reset storage: delete all + ...

  - set cookie tracked
    - set possibles values for this cookie

  - get cookie tracked and values

*/