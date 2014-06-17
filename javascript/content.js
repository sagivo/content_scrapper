// Generated by CoffeeScript 1.6.3
var filter, settings;

settings = {
  active: true
};

console.log('content');

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('content msg', request);
  if (request.type === "reFilter") {
    settings.filter = request.filter;
    filter();
  }
  return sendResponse({
    status: "ok"
  });
});

$(function() {
  return chrome.runtime.sendMessage({
    type: "getSettings"
  }, function(set) {
    console.log("content settings", set);
    settings = set;
    if (settings.enabled) {
      return filter();
    }
  });
});

filter = function() {
  var filterText;
  filterText = settings.filter;
  console.log('filtering by', filterText);
  $('[data-txt]').each(function(i, e) {
    return $(e).text($(e).attr('data-txt')).removeAttr('data-txt').removeClass('filter');
  });
  return filterText.split(',').forEach(function(text) {
    var htmlElements;
    htmlElements = [];
    return 'a,p,span,td,th,strong,b,bold,h1,h2,h3,h4,h5'.split(',').forEach(function(htmlElement) {
      htmlElements.push(htmlElement + ":contains('" + text + "')");
      return $(htmlElements.join(',')).each(function(i, e) {
        return $(e).attr('data-txt', $(e).text()).text('KABOOM').addClass('filter');
      });
    });
  });
};
