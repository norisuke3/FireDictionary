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
 
//
// FDDictionary mode ///////////////////////////////////////////////////
//
FDDictionarySidebar.FD_MODE_WORD_ENTERERD = 1;
FDDictionarySidebar.FD_MODE_WORD_PICKEDUP = 2;

/**
 * A class for dictionary sidebar.
 */
function FDDictionarySidebar(_fdDictionaryMode){
 this.resourceDirectory = getResourceDirectory();
 var sidebar = top.document.getElementById("sidebar");
 var dictionaryFactory = new FDDictionaryFactory();
 var config = new FDConfig(this.resourceDirectory);
 var history = new FDWordHistory();
 var prefs = new FDPrefs();
 var dic = null;
 var fdDictionaryMode;
 var mLastKeyword = "";
 var mKeyword = "";
 var mPickedUpWord = ""            // Keyword Information (the declention of the word will remain.)
 var mUrl;                         // Keyword Information
 var mTitle;                       // Keyword Information
 var mSentence;                    // Keyword Information
 
 // declare sidebar gadgets
 var mIndicatorMouseOverMode;
 
 // Override configuration file if it's old version.
 if(!config.verifyProperVersion()){
  config.remove();
  config = new FDConfig(this.resourceDirectory);
 }
 
 // Initialize dictionary.
 var dicName = getDictionaryName();
 
 var fileName = config.getFileName(dicName);
 var charset = config.getCharset(dicName);
 var format = config.getFormat(dicName);
 var indexDepth = config.getIndexDepth(dicName);
 
 try{
  dic = dictionaryFactory.newDictionary(format, indexDepth, fileName, charset);
 }catch(e){
  if ( e == "DICTINOARY_FILE_MISSING_EXCEPTION" ) {
    try{
     dic = dictionaryFactory.newDictionary(format, indexDepth, fileName.toLowerCase(), charset);
    }catch(e){
     if ( e == "DICTINOARY_FILE_MISSING_EXCEPTION" ) {
      dic = null
     }
    }
  }
 }
 
 /**
  * FDDictionarySidebar(int _fdDictionaryMode)
  *  Constructor of this class.
  *  The argument _fdDictionaryMode express dictionary mode.
  *  This value should be chosen from below.
  *
  *   FD_MODE_WORD_ENTERERD   The keyword is enterd by user from sidebar.
  *   FD_MODE_WORD_PICKEDUP   The keyword is picked up from browser.
  *
  *  When the constant FD_MODE_WORD_PICKUPED is used, Looking up will be
  *  rerun with modified word if there is no result in the dicitonary.
  *
  * @param  fdDictionaryMode A constant which express dictinoary mode.
  * @throws INVALID_DICTIONARY_MODE This exception is thrown when the 
  *         argument fdDictionaryMode is invalid.
  */
 if ( 
  fdDictionaryMode != this.FD_MODE_WORD_ENTERERD &&
  fdDictionaryMode != this.FD_MODE_WORD_PICKEDUP ){
  throw new Exception("INVALID_DICTIONARY_MODE");
 }
 fdDictionaryMode = _fdDictionaryMode;
 
 /**
  * initialize()
  *  Initialize dictionary sidebar. If there is no dictionary file, this
  *  method change the sidebar to the installation mode for dictinoary file.
  *  Moreover, initialize sidebar gadget objects.
  */
 this.initialize = function(){
  var prefs = new FDPrefs();
  var installationURI = "chrome://firedictionary/locale/install/" + dicName + ".htm"
  var mouseovermode;
  
  // initialize sidebar gadget objects
  mIndicatorMouseOverMode = new FDSidebarGadget("fd-mouseovermode-indicator");
  
  getInstallationPanel().style.display = ( dic == null ? "" : "none" );
  getMainBox().style.display = ( dic == null ? "none" : "" );

  // initialize iKnow panel
  this.InitIKnowPanel();
  
  if ( dic == null ){
   getTabBrowser().loadURI(installationURI);
  }
     
  // initialize mouse over mode indicator.
  mouseovermode = prefs.getCharPref("mouse-over-mode");
  mIndicatorMouseOverMode.setAttribute(
      "status", 
      mouseovermode == null || mouseovermode == "on" ? "on" : "off"
  );
  
  // set preference
  prefs.setCharPref("resetUndoBuffer", "false");
  
  // initialize history.
  history.initialize();
  
  // update undo and redo button state
  updateUndoRedoButtonState(
   history.getHistoryCount(),
   history.getUndoBufferCount()
  )
  
 }
 
 /**
  * Boolean isActive()
  *  @return a boolean value whether dictionary sidebar is active or not.
  */
 this.isActive = function(){
  var sidebarBox = top.document.getElementById("sidebar-box");
  sidebarcommand = sidebarBox.getAttribute("sidebarcommand");
  
  return (sidebarcommand == "viewFireDictionarySidebar");
 }
 
 /**
  * setKeyword(String keyword)
  *
  * @param keyword
  */
 this.setKeyword = function(keyword){
  mKeyword = keyword;
  mPickedUpWord = keyword;
 }
 
 /**
  * setKeywordFromTextbox()
  *  set a keyword from text box.
  */
 this.setKeywordFromTextbox = function(){
  mKeyword = getKeywordTextbox().value;
 }
 
 /**
  * setKeywordInformation(String url, String title, String sentence)
  *
  * @param url   The URL of a document which the keyword is belonging to.
  * @param title The title of a document which the keyword is belonging to. 
  * @param sentence A sentence which contains the keyword.
  */
 this.setKeywordInformation = function(url, title, sentence){
  mUrl = url;
  mTitle = title;
  mSentence = sentence;
 }
 
 /**
  * lookup()
  *  Lookup the dictionary using a word in keyword textbox.
  */
 this.lookup = function(){
  if( this.isActive() && dic != null && mKeyword != mLastKeyword){
   getKeywordTextbox().value = mKeyword;
   if( mKeyword != "" ){
    getPickupWordLabel().value = "";
    getResultTextbox().value = _lookup(mKeyword);
    
    mLastKeyword = mKeyword;
   }
  }
 }
 
 /**
  * registHistory()
  *  Regist the result to history.
  */
this.registHistory = function(){
	var prefs;
	var keyword;
	var result;
	var category;
	var acceptEmptyDefinitionInd;

	if ( !this.isActive() || dic == null) return;
	
	prefs = new FDPrefs();
	keyword = getKeywordTextbox().value;
	result = getResultTextbox().value;
	category = prefs.getUniCharPref("category");
	acceptEmptyDefinitionInd = prefs.getCharPref("accept-empty-definition-ind");
	
	if ( !category || category == "" ) category = "Unclassified";
   
	// load iKnow
	this.loadIKnow(keyword);

	if ( !keyword.match(/^( |\n)*$/i) && ( result != "" || acceptEmptyDefinitionInd == "true")){
		history.registWord(keyword, result, mUrl, mTitle, mSentence, mPickedUpWord, category);
  
		// update undo and redo button state
		updateUndoRedoButtonState(
			history.getHistoryCount(),
			history.getUndoBufferCount()
		);

		// set preference
		prefs.setCharPref("resetUndoBuffer", "true");
	}
}

/**
 * loadIKnow(keyword)
 *
 */
this.loadIKnow = function(keyword){
  var self = this;
  var file = new FDDirectory("ProfD/FireDictionary/tmp").createFileInstance('result.html');
  var url = new FDDirectory("ProfD/FireDictionary/skin").getURL() + 'iKnow.html';
  
  var prefs = new FDPrefs();

  var params = {
    language: prefs.getCharPref("iknow.cue-language"),
    translation_language: prefs.getCharPref("iknow.response-language"),
    include_sentences: false
  };
  var urlMatching = 'http://api.iknow.co.jp/items/matching/' + keyword + '.json?' + 
		    Object.toQueryString(params);
  
  if ( !keyword.match(/^( |\n)*$/i) ){ 
    getIKnowThrobber().setAttribute('status', 'on');

    new Ajax.Request(urlMatching, {
      method: 'get',
      onSuccess: function(transport){
	file.write(self.createIKnowHTML(transport.responseText), "UTF-8");
	getIKnowBody().setAttribute('src', '');
	getIKnowBody().setAttribute('src', url);
      },
      onFailure: function(transport){
	file.write(self.createIKnowErrorHTML('failure'), "UTF-8");
	getIKnowBody().setAttribute('src', '');
	getIKnowBody().setAttribute('src', url);
      },
      onException: function(transport, ex){
	file.write(self.createIKnowErrorHTML('Exception', ex), "UTF-8");
	getIKnowBody().setAttribute('src', '');
	getIKnowBody().setAttribute('src', url);
      }
    })
  }
};

  /**
   * createIKnowHTML(json)
   *   Creating an html from the json for iKnow panel.
   * 
   * @param json text formated as json
   * @return html string 
   */
  this.createIKnowHTML = function(json){
    var html;
    var rowType = ['odd', 'even'];
    var row = 0;
    var matchingResults = json.evalJSON(true);
      
    html = "<html><head>";
    html = html + '<link type="text/css" rel="Stylesheet" media="all" href="../skin/iknow-panel.css"/>';
    html = html + '</head><body>';
    if (matchingResults.length == 0) {
      html = html + '<div class="empty_match_result">This item doesn\'t exist yet in the iKnow! item bank.';
    } else {
      html = html + '<div id="item_lookup_results"><ul id="rich_item_list">';
      html = html + matchingResults.collect(function(item){
	var li = '<li class = "' + rowType[row++ % 2] + ' rich_item">';
	if (item.cue.sound){
	  li = li + '<a class="sound_icon" target="sound_player" href="' + item.cue.sound + '"><span>音声再生</span></a>';
	}else{   // for casees of null, undefnied and ''
	  li = li + '<a class="sound_icon_disabled"><span>音声再生</span></a>';
	}
	li = li + '<a target="_blank" onclick="" class="item_link" href="http://www.iknow.co.jp/items/' + item.id + '">';
	li = li + '<span lang="en" xml:lang="en" class="cue_text en">' + item.cue.text + '</span>';
	li = li + '</a>';
	li = li + '<div class="item_bank_row">';
	li = li + '  <span class="pos">(' + item.cue.part_of_speech + ')</span>';
      //    responsees の要素は常に一つ？
	li = li + '  <span class="response">' + item.responses[0].text + '</span>';
	li = li + '</div>';
	li = li + '</li>';
	return li;
      }).join('\n');

      html = html + "</ul>";
    }
    html = html + "</div></body></html>";
    
    return html;
  };

  /**
   * createIKnowErrorHTML = fucntion(status[, ex])
   *   Creating an html for a case of Ajax failure and exception.
   * 
   * @param status should be either of "failure" or "exception"
   * @param ex exception object (optional)
   */
  this.createIKnowErrorHTML = function(status, ex){
    var html;
    
    html = "<html><head>";
    html = html + '<link type="text/css" rel="Stylesheet" media="all" href="../skin/iknow-panel.css"/>';
    html = html + '</head><body>';
    html = html + '<div class="empty_match_result">Error: during searching<br>';
    html = html + 'status: ' + status;
    if (status == 'Exception'){
      html = html + ', ' + ex.message;
    }
    html = html + "</body></html>";
    
    return html;
  };
  
 /**
  * clearHistory()
  *  Clear the history of words and delete the history file.
  */
 this.clearHistory = function(){
  var strbundle=document.getElementById("fd-localized-strings");
  var msgConfirmation=strbundle.getString("confirmationToDeleteHistory");
  
  if( !window.confirm(msgConfirmation) ) return;
  
  history.clear();
  
  // update undo and redo button state
  updateUndoRedoButtonState(
    history.getHistoryCount(),
    history.getUndoBufferCount()
  );
  
   // At this time, clear the temporary files.
   new FDDirectory("ProfD/FireDictionary/tmp").remove(true);
 };
 
/**
 * viewHistory()
 *  View the history in the browser as a html.
 */
 this.viewHistory = function(){
  this.turnOffMouseOverMode();
  history.view();
 }
 
 /**
  * selectTab(int tabIndex)
  */
 this.selectTab = function(tabIndex){
  getTabPanels().selectedIndex = tabIndex;
  getTabs().selectedIndex = tabIndex;
 }
 
 /**
  * flipMouseOverModeSwitch()
  *  Change the switch of mouse over function.
  */
 this.flipMouseOverModeSwitch = function(){
  var mode = mIndicatorMouseOverMode.getAttribute("status");
  
  if ( mode == "on" ){
   mode = "off";
  } else {
   mode = "on";
  }
  
  mIndicatorMouseOverMode.setAttribute("status", mode);
  prefs.setCharPref("mouse-over-mode", mode);
 }
 
 /**
  *  turnOffMouseOverMode()
  *   Turn off the mouse over mode switch()
  */
 this.turnOffMouseOverMode = function(){
  var mode = "off";
  
  mIndicatorMouseOverMode.setAttribute("status", mode);
  prefs.setCharPref("mouse-over-mode", mode); }
 
 /**
  * Boolean getMouseOverMode()
  *  return the status of mouse over mode.
  */
 this.getMouseOverMode = function(){
  var modeIndicator = new FDSidebarGadget("fd-mouseovermode-indicator");
  
  if ( modeIndicator.isNull() )
   return false;
 
  return (modeIndicator.getAttribute("status") == "on");
 }
 
 /**
  * undoHistory()
  *  undo a process of registering a word to the history.
  **/
 this.undoHistory = function(){
	 var prefs = new FDPrefs();
	 if ( prefs.getCharPref("resetUndoBuffer") == "true" ){
	  history.resetUndoBuffer();
	  prefs.setCharPref("resetUndoBuffer", "false");
	 }
	 
  history.undoHistory();
  
  // update undo and redo button state
  updateUndoRedoButtonState(
   history.getHistoryCount(),
   history.getUndoBufferCount()
  )
 }
  
 /**
  * redoHistory()
  *  redo a process of registering a word to the history.
  */
 this.redoHistory = function(){
  history.redoHistory();
  
  // update undo and redo button state
  updateUndoRedoButtonState(
   history.getHistoryCount(),
   history.getUndoBufferCount()
  )
 }

 /**
  * InitIKnowPanel()
  *  change shown/hide status of iKnow panel
  */
 this.InitIKnowPanel = function(){
  var prefs = new FDPrefs();
  var userIKnow = prefs.getCharPref("useIKnow");

  getIKnowHeader().style.display = ( userIKnow == null || userIKnow == "true" ? "" : "none" );
  getIKnowBody().style.display = ( userIKnow == null || userIKnow == "true" ? "" : "none" );
 }
 
 
 //
 // Private method ///////////////////////////////////////////////////////
 //
 
 // 
 // --- functions for obtaining a reference of a gadget in Find tab. ---
 //
 function getKeywordTextbox(){
  return sidebar.contentDocument.getElementById("dictionary-keyword");
 }
 
 function getResultTextbox(){
  return sidebar.contentDocument.getElementById("dictionary-result");
 }
 
 function getPickupWordLabel(){
  return sidebar.contentDocument.getElementById("dictionary-pickup-word");
 }
 
 function getIKnowHeader(){
   return sidebar.contentDocument.getElementById("iknow-header");
 }

 function getIKnowBody(){
   return sidebar.contentDocument.getElementById("iknow-body");
 }

 function getIKnowThrobber(){
   return sidebar.contentDocument.getElementById("iknow-throbber");
 }

 // 
 // --- functions for obtaining a reference of other xul elements. ---
 // 
 function getInstallationPanel(){
  return sidebar.contentDocument.getElementById("firedictionary-installation-panel");
 }
 
 function getMainBox(){
  return sidebar.contentDocument.getElementById("firedictionary-mainbox");
 }
 
 function getTabBrowser(){
  return top.document.getElementById("content");
 }
 
 function getTabPanels(){
  return sidebar.contentDocument.getElementById("firedictionary-tabpanels");
 }
 
 function getTabs(){
  return sidebar.contentDocument.getElementById("firedictionary-tabs");
 }

 /**
  * String _lookup(String keyword)
  *
  * @param keyword Keyword.
  * @return A word which is the result of dictionary lookup.
  */
 function _lookup(keyword){
  var result = "";
  
  try {
   result = dic.lookup(keyword);
   
   // When there is no result in the dictionary and the dictionary mode is
   // FD_MODE_WORD_PICKEDUP, try agin with modified keyword.
   if ( result == "" && fdDictionaryMode == FDDictionarySidebar.FD_MODE_WORD_PICKEDUP){
    result = lookupwithModifiedKeyword(keyword);
   }
   
   return result;
   
  } catch(e) {
   if ( e == "INDEX_MISSING_EXCEPTION" ) {
    
    dic.createIndex();
    return _lookup(keyword);
    
   } else {
    throw e;
   }
  }
 }
 
 /**
  * String lookupwithModifydKeyword(String keyword)
  *
  * @param keyword
  * @return A word which is the result of dictionary lookup.
  */
 function lookupwithModifiedKeyword(keyword){
   var result = "";
   var modified;
   var RECJK = /[\u2E80-\uFE4F]/;             // handle cjk (chinese/japanese/korean) chars specially
   var normalizer = [
     { deletion: "s",   addition: ""    },
     { deletion: "ed",  addition: ""    },
     { deletion: "ied", addition: "y"   },
     { deletion: "r",   addition: ""    },
     { deletion: "er",  addition: ""    },
     { deletion: "ing", addition: ""    },
     { deletion: "d",   addition: ""    },
     { deletion: "est", addition: ""    },
     { deletion: "ism", addition: ""    }
   ];
   // sample
   // files, tired, booked, copied, eater, providing, forged, inspirer, fader, fadder
  
   if ( RECJK.test(keyword.substr(0,1)) ) {
     // try all truncations starting with the longest
     for ( len = keyword.length - 1 ; (result == "") && (len > 0) ; len-- ){
       modified = keyword.substr(0, len);
       result = dic.lookup(modified);
     }
   
   } else {
     modified = keyword.toLowerCase();
     result = dic.lookup(modified);

     // try to see if the normalizer works
     if ( result == "" ){
       normalizer.find(function(norm){
	 if ( keyword.match(new RegExp(norm.deletion + "$")) != null ){
	 modified = keyword.substr(0, keyword.length - norm.deletion.length) + norm.addition;
	 result = dic.lookup(modified);
       }
     
       return (result != "");
       });
     }
    
     if( result == "" ){
       // for double consonant. ex.)filterring, preferring, banning, etc...
       if(keyword.substr(-4, 1) == keyword.substr(-5, 1)){
	 modified = keyword.substr(0, keyword.length - 4);
	 result = dic.lookup(modified);
     
       } else {
	 modified = keyword.substr(0, keyword.length - 3) + "e";
	 result = dic.lookup(modified);
       }
     }
   }
  
   // After process only the case when the word found.
   if ( result != ""){
     getPickupWordLabel().value = keyword;
     getKeywordTextbox().value = modified;
   }
  
   return result;
 }
 
 /**
  * FDDirectory getResourceDirectory()
  *
  * @return a directory object whose directory contains resource file.
  */
 function getResourceDirectory(){
  var dir = new FDDirectory("ProfD");
  dir.createNewDirectory("FireDictionary");
  dir.createNewDirectory("res");
  
  return dir;
 }
 
 /**
  * String getDictinoaryName()
  *
  * @return A name of dictionary.
  */
 function getDictionaryName(){
  if ( prefs.getUniCharPref("dictionary-name") == null ){
   prefs.setUniCharPref("dictionary-name", config.getDefaultDictionaryName());
  }
  
  return prefs.getUniCharPref("dictionary-name");
 }
 
 /**
  * updateUndoRedoButtonState(int countHistory, int countBuffer)
  *  update states of Undo button and Redo button.
  *
  *  @param countHistory a number of registered words in history
  *  @param countBuffer a number of depth in undo buffer
  */
 function updateUndoRedoButtonState(countHistory, countBuffer){
  var buttonUndo = new FDSidebarGadget("fd-undo-history");
  var buttonRedo = new FDSidebarGadget("fd-redo-history");
  
  // set a state of undo button
  if ( countHistory == 0 ){
   buttonUndo.disable();
  } else {
   buttonUndo.enable();
  }
  
  // set a state of redo button
  if ( countBuffer == 0 ){
   buttonRedo.disable();
  } else {
   buttonRedo.enable();
  }
 }
}