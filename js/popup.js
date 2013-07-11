
var getCookies = function(callback) {
  chrome.tabs.query({active : true, currentWindow: true}, function (tab) {
    var tabUrl = tab[0].url;
    chrome.cookies.getAll({'url': tabUrl, 'name': 'igloolb'}, function(cookies) {
      if(callback) {
        return callback(cookies);
      }
    });
  });
};

window.onload = function(){

  document.querySelector('#logCookies').addEventListener('click', function(e){
    getCookies(function(cookies){
      console.log(cookies);
      document.querySelector('#output').textContent = 'Nb cookie: ' + cookies.length;
    });
  });

  getCookies();
};
