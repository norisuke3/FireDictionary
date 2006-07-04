/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is FireDictionary.
 *
 * The Initial Developer of the Original Code is 
 * Noriaki Hamamoto <nori@firedictionary.com>.
 * Portions created by the Initial Developer are Copyright (C) 2005
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */
 
/**
 * initialize()
 *  set a Default value of the dictionary-name text box
 */
function initialize(){
 var prefs = new FDPrefs();
 
 createMenuItem();
 
 // set the values.
 var dicName = prefs.getUniCharPref("dictionary-name");
 document.getElementById("dictionary-name").value = dicName;
 refleshWindow(dicName);
}

/**
 * createMenuItems()
 */
function createMenuItem(){
 var config = new FDConfig(window.arguments[0]);
 var menuPopUp = document.getElementById("dictionary-list");
 var dicNames = config.getDictionaryNames();
 
 // If there are old menue items, remove them first.
 var oldItems = menuPopUp.childNodes;
 var itemLength = oldItems.length
 for( i=0 ; i < itemLength ; i++ ){
  menuPopUp.removeChild(oldItems.item(0));
 }
 
 // create menu items.
 for( i=0 ; i < dicNames.length ; i++ ){
  var menuItem=document.createElement("menuitem");

  menuItem.setAttribute( "label" , dicNames[i]);
  menuItem.setAttribute( "value" , dicNames[i]);

  menuPopUp.appendChild(menuItem);
 }
}

/**
 * refleshWindow(String dicName)
 *
 *@dicName a dictionary name.
 */
function refleshWindow(dicName){
 var config = new FDConfig(window.arguments[0]);
 
 document.getElementById("format").value = config.getFormat(dicName);
 document.getElementById("index-depth").value = config.getIndexDepth(dicName);
 document.getElementById("file-name").value = config.getFileName(dicName);
 document.getElementById("url").value = config.getURL(dicName); 
 document.getElementById("charset").value = config.getCharset(dicName);
 
 document.getElementById("url").setAttribute("href", config.getURL(dicName));
}
 
 
/**
 * doOK()
 */
function doOK(){
 var prefs = new FDPrefs();
 var strbundle=document.getElementById("fd-localized-strings");
 var message = strbundle.getString("message.toActivateDictionary");
 var dictionaryName = document.getElementById("dictionary-name");
 var result = true;
 
 prefs.setUniCharPref("dictionary-name", dictionaryName.value);
 
 alert(message);
 return result; 
}

/**
 * doCancel()
 */
function doCancel(){
  return true; 
}

/**
 * openAddDictionary()
 *  Open a dialog to add a dictionary.
 */
function openAddDictionary(){
 var dialogURL = "chrome://firedictionary/content/addDictionary.xul"
 window.openDialog(
  dialogURL,
  "addDictionary",
  "chrome, centerscreen, dependent, dialog, modal",
  window.arguments[0]);
  
 createMenuItem();
}

/**
 * removeDictionary()
 */
function removeDictionary(){
 var config = new FDConfig(window.arguments[0]);
 var strbundle=document.getElementById("fd-localized-strings");

 if ( document.getElementById("dictionary-name").value == "GENE95" ){
  alert(strbundle.getString("message.youCantDeleteGENE95"));
 } else {
 
  config.removeDictionary(document.getElementById("dictionary-name").value);
 
  var names = config.getDictionaryNames();
  document.getElementById("dictionary-name").value = names[0];
 
  createMenuItem();
 }
}