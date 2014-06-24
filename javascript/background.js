// Generated by CoffeeScript 1.6.3
var getSettings, sendRefilter, setSettings;

getSettings = function() {
  var settings;
  settings = localStorage.getItem('settings');
  if (settings) {
    return JSON.parse(settings);
  } else {
    settings = {
      enabled: true,
      sites: ['fb', 'twitter']
    };
    localStorage.setItem('settings', JSON.stringify(settings));
    return settings;
  }
};

chrome.extension.onMessage.addListener(function(request, sender, cb) {
  if (request.type === 'getSettings') {
    return cb(getSettings());
  }
});

$(function() {
  var settings;
  settings = getSettings();
  console.log('settings', settings);
  if (settings.enabled) {
    $("#options").show();
    $("#cb_active").attr('checked', 'checked');
  } else {
    $("#options").hide();
    $("#cb_active").removeAttr('checked');
  }
  $("#filter").val(settings.filter).tagsInput({
    minChars: 3,
    onChange: function(e, t) {
      setSettings({
        filter: $.map($(".tag span"), function(e, i) {
          return $(e).text().trim();
        }).join(",")
      });
      return sendRefilter();
    }
  });
  $("#cb_active").click(function() {
    if ($("#cb_active").is(":checked")) {
      $("#options").slideDown();
    } else {
      $("#options").slideUp();
    }
    return setSettings({
      enabled: $("#cb_active").is(":checked")
    });
  });
  return setSettings({
    enabled: $("#cb_active").is(":checked")
  });
});

setSettings = function(set) {
  return localStorage.setItem('settings', JSON.stringify($.extend(getSettings(), set)));
};

sendRefilter = function() {
  if (!getSettings().enabled) {
    return;
  }
  return chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tabs) {
    return chrome.tabs.sendMessage(tabs[0].id, {
      type: "reFilter",
      filter: getSettings().filter,
      enabled: true
    }, function(response) {});
  });
};
