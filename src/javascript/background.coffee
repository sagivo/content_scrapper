getSettings = ->  
  settings = localStorage.getItem('settings')
  if settings
    return JSON.parse(settings)
  else
    settings = {enabled:true, sites:['fb','twitter']}
    localStorage.setItem('settings', JSON.stringify(settings))
    settings 
  
chrome.extension.onMessage.addListener (request, sender, cb) ->  
  if request.type == 'getSettings'
    cb getSettings()

$ ->
  settings = getSettings()
  console.log 'settings', settings
  #init  
  if settings.enabled
    $("#options").show(); $("#cb_active").attr('checked', 'checked')
  else
    $("#options").hide();  $("#cb_active").removeAttr('checked')
  $("#filter").val(settings.filter).tagsInput minChars: 3, onChange: (e,t) ->
    setSettings filter: $.map($(".tag span"), (e, i) -> $(e).text().trim()).join(",")
    sendRefilter()
    
  #clicks
  $("#cb_active").click ->
    if $("#cb_active").is(":checked")      
      $("#options").slideDown()
    else
      $("#options").slideUp()
    setSettings(enabled: $("#cb_active").is(":checked"))
  
  setSettings(enabled: $("#cb_active").is(":checked"))

setSettings = (set)->  
  localStorage.setItem( 'settings', JSON.stringify($.extend(getSettings(), set)) )

sendRefilter = ->
  return unless getSettings().enabled
  chrome.tabs.query active: true, currentWindow: true, (tabs) ->
    chrome.tabs.sendMessage tabs[0].id, {type: "reFilter", filter: getSettings().filter, enabled: true}, (response) ->