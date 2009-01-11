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
 
//////////// global variables /////////////////////

var dicSidebar = new FDDictionarySidebar(FDDictionarySidebar.FD_MODE_WORD_ENTERERD);  // Dictinoary sidebar object.

///////////////////////////////////////////////////

/**
 * lookup(event)
 */
function lookup(event){
	dicSidebar.setKeywordFromTextbox(); 
 dicSidebar.lookup();
}

/**
 * regist(event)
 */
function regist(event){
	dicSidebar.setKeywordInformation("", "");
	dicSidebar.registHistory();
}

/**
 * initialize()
 */
function initialize(){
  var prefs = new FDPrefs();
  var menuUseIKnow = document.getElementById("fd-use-iknow");

  dicSidebar.initialize();
	
  // initialize a status of iknow
  initPrefs("useIKnow", "true");
  initPrefs("iknow.response-language", "ja");
  initPrefs("iknow.cue-language", "en");
  initPrefs("escape-history-key", "ctrlKey");

  menuUseIKnow.setAttribute("checked", prefs.getCharPref("useIKnow"));
}

//
// Event handler  ///////////////////////////////////////////////////////
//

function install(){
 var installer = new FDDictionaryInstaller();

 try{
  if(installer.install()){
   alert("FireDictionary has been installed successfully!");
  }
  
 } catch (e) {
  var strbundle=document.getElementById("fd-localized-strings");
  
  if ( e == "THE_DICTIONARY_HAS_ALREADY_EXISTED" ) {
   alert(strbundle.getString("error.theDictionaryHasAreadyExists"));
   
  } else {
   throw e;
  }
 }
}

/**
 * clearHistory()
 *  Clear the history of words and delete the history file. 
 */
function clearHistory(){
	dicSidebar.clearHistory();
}

/**
 * viewHistory()
 *  View the history in the browser as a html.
 */
function viewHistory(){
	dicSidebar.viewHistory();
}

/**
 * loadGeneratedPage()
 *  Load the generated page from paste board.
 */
function loadGeneratedPage(){
	var pasteboard = new FDPasteBoard();
	var tabbrowser = top.document.getElementById("content");
	var file = new FDDirectory("ProfD/FireDictionary/tmp").createFileInstance("temp.html");
	var tab;
	
        file.write(pasteboard.getContentAsHtml(), "UTF-8");
	
	tab = tabbrowser.addTab(file.getURL());
	tabbrowser.selectedTab = tab;
	dicSidebar.selectTab(0);
}

/**
 * loadHomePage()
 *  Load the homepage of FireDictionary. 
 *   (http://www.firedictionary.com/)
 */
function loadHomePage(){
 var tabbrowser = top.document.getElementById("content");
 var tab = tabbrowser.addTab("http://www.firedictionary.com/");
 
 tabbrowser.selectedTab = tab;
}

/**
 * flipSwitch()
 *  change the switch of mouse over mode.
 */
function flipSwitch(){
	dicSidebar.flipMouseOverModeSwitch();
}

/**
 * setCategory()
 *  Open a dialog to set a category for the keywords.
 */
function setCategory(){
 var dialogURL = "chrome://firedictionary/content/inputCategory.xul"
 window.openDialog(dialogURL, "inputCategory", "chrome, centerscreen, dependent, dialog, modal");
}

/**
 * openDictionaryConfig()
 *  Open a dialog to configure the dictionary.
 */
function openDictionaryConfig(){
 var dialogURL = "chrome://firedictionary/content/dictionaryConfig.xul"
 window.openDialog(
  dialogURL,
  "dictionaryConfig",
  "chrome, centerscreen, dependent, dialog, modal",
  dicSidebar.resourceDirectory);
}

/**
 * undoHistory()
 */
function undoHistory(){
 dicSidebar.undoHistory();
}
 
/**
 * redoHistory()
 */
function redoHistory(){
 dicSidebar.redoHistory();
}

/**
 * viewIKnow()
 */
function viewIKnow(){
  var tabbrowser = top.document.getElementById("content");
  var tab = tabbrowser.addTab("http://www.iknow.co.jp/");
 
  tabbrowser.selectedTab = tab;
}

/**
 * checkIKnowMenu()
 */
function checkIKnowMenu(){
  var prefs = new FDPrefs();
  var menuUseIKnow = document.getElementById("fd-use-iknow");
 
  prefs.setCharPref("useIKnow", menuUseIKnow.getAttribute("checked"));

  dicSidebar.InitIKnowPanel();
}

function openMyListManager(){
  var tabbrowser = top.document.getElementById("content");
  var tab = tabbrowser.addTab("chrome://firedictionary/content/iknow/iKnowMyListManager.html");
 
  tabbrowser.selectedTab = tab;
}