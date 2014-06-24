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
  var f, injectedScript, main;
  chrome.runtime.sendMessage({
    type: "getSettings"
  }, function(set) {
    console.log("content settings", set);
    settings = set;
    if (settings.enabled) {
      return filter();
    }
  });
  main = function() {
    var fireCustomEvent, myEvent;
    fireCustomEvent = function() {
      return document.body.dispatchEvent(myEvent);
    };
    myEvent = document.createEvent("Event");
    myEvent.initEvent("CustomEvent", true, true);
    jQuery(document).ajaxComplete(function(event, request, settings) {
      fireCustomEvent();
    });
  };
  injectedScript = document.createElement("script");
  injectedScript.type = "text/javascript";
  injectedScript.text = "(" + main + ")(\"\");";
  (document.body || document.head).appendChild(injectedScript);
  f = null;
  return document.body.addEventListener("CustomEvent", function() {
    if (f) {
      clearTimeout(f);
    }
    f = setTimeout(filter, 500);
  });
});

filter = function() {
  var filterText;
  filterText = settings.filter;
  console.log('filtering by', filterText);
  $('[data-txt]').each(function(i, e) {
    return $(e).text($(e).attr('data-txt')).removeAttr('data-txt').removeClass('filter');
  });
  if (filterText.length === 0) {
    return;
  }
  return filterText.split(',').forEach(function(text) {
    var htmlElements;
    htmlElements = [];
    return 'p,a'.split(',').forEach(function(htmlElement) {
      htmlElements.push(htmlElement + ":contains('" + text + "')");
      return $(htmlElements.join(',')).each(function(i, e) {
        return $(e).attr('data-txt', $(e).text()).text('KABOOM').addClass('filter');
      });
    });
  });
};

$.expr[":"].contains = jQuery.expr.createPseudo(function(arg) {
  return function(elem) {
    return jQuery(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
  };
});
