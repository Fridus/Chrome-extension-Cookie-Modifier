
/*
  Common functions
*/

var cookiesFiltered = {};

var objectSize = function(obj) {
  var size = 0, key;
  for (key in obj) {
      if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

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

var updateCookiesFiltered = function(callback) {
  cookiesFiltered = {};
  getCookies(function(cookies){
    var c = getCookiesStored();
    var cKeys = getCookiesStoredName(c);

    cookies.forEach(function(cookie) {
      if( cKeys.indexOf(cookie.name) >= 0 ) {
        cookiesFiltered[cookie.name] = c[cookie.name];
      }
    });

    if(callback) callback(cookiesFiltered);
  });
}