var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
//var cir =require("./cirilica");
var data = require("sdk/self").data;

/*
require("sdk/tabs").on("ready", runScript);
 
function runScript(tab) {
  tab.attach({
    contentScript: "if (document.body) document.body.style.border = '5px solid red';"
  });
}
*/

var button = buttons.ActionButton({
  id: "mozilla-link",
  label: "Visit Mozilla",
  icon: {
    "16": "./cir_16.png",
    "32": "./cir_.png",
    "64": "./cir_64.png"
  },
  //cir: require("./cirilica"),
  onClick: function() {
    tabs.activeTab.attach({
      contentScriptFile: data.url("cirilica.js")
	  //contentScript: contentScriptString
	  
    });
	//console.log("cir: "+Object.prototype.toString.apply(CIR))
  }
});

