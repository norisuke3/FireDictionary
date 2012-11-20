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
 * 
 *    Noriaki Hamamoto <nori@firedictionary.com>.
 * 
 * Portions created by the Initial Developer are Copyright (C) 2005
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s) :
 * 
 *    Takeshi Hamasaki <hmatrjp@users.sourceforge.jp>
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

var FireDictionary = FireDictionary || {};

///////////////////////////////////////////////////

(function(){

  var sidebar;
   
  /**
   * initialize()
   *  function to initialize FireDictionary environment.
   */
  this.initialize = function(){
    var self = this;
    var version = "";
    var prefs = new FDPrefs();

    Components.utils.import("resource://gre/modules/AddonManager.jsm");
    AddonManager.getAddonByID("{ABA70AB8-D620-4cef-885B-559691663E23}",  function(addon){
      version = new String(addon.version);
      // alert("My extension's version is " + addon.version + ";  " + version);

      // Initialize a preference 'version' with a FireDictionary's version.
      if (prefs.version != version){
        prefs.create("updated", "true");
      }
      prefs.create("version", version);

      // Initialize tab browser and events.
      var tabbrowser = document.getElementById("content");

      if ( tabbrowser ) {
        tabbrowser.addEventListener("click", self.sendWordToHistory, false);
        tabbrowser.addEventListener("mousemove", self.sendContentWord, false);
      }

      // Initialize dictionary sidebar object.
      sidebar = new FDDictionarySidebar(FDDictionarySidebar.FD_MODE_WORD_PICKEDUP);

      // Initialize preference.
      prefs.initialize("accept-empty-definition-ind", "false");

      // emit iKnow files: css and png if it's not present
      emitIKnowFiles();
    });
  };
  
  /**
   * emitIKnowFiles()
   *   emitting resource files to ProfD/FireDictionary/skin.
   */
  function emitIKnowFiles(){
    var sourceURL = "chrome://firedictionary/skin/";
    var resources = [
      { name: "iknow-panel.css",              bin: false },
      { name: "iKnow.html",                   bin: false },
      { name: "empty.html",                   bin: false },
      { name: "sound_play_icon_disabled.png", bin: true },
      { name: "sound_play_icon_over.png",     bin: true },
      { name: "sound_play_icon_up.png",       bin: true }
    ];
    var dir = new FDDirectory("ProfD/FireDictionary/skin");

    for (var i = 0 ; i < resources.length ; i++){
      var res = resources[i];
      if(!(dir.createFileInstance(res.name).exists())){
        var emitter = new FDInstallFileEmitter(sourceURL + res.name, res.bin);
        emitter.emitTo(dir);
      }
    }
  };
  
  
  //
  // Event handler  ///////////////////////////////////////////////////////
  //
   
  /**
   * sendContentWord(event)
   *
   * @param event
   */
  this.sendContentWord = function(event){
    if ( !sidebar.isActive() || !sidebar.getMouseOverMode() ) return;
   
    var extractor = new FDSentenceExtractor(event);
    var keyword = extractor.getKeyword();
    var sentence = extractor.getSentence();
    var url = event.view.document.URL;
    var title = event.view.document.title;
    
    sidebar.setKeywordInformation(url, title, sentence);
    sidebar.setKeyword(keyword);
    sidebar.lookup();
  };
  
  /**
   * sendWordToHistory(event)
   *  Send the word to Find History.
   */
  this.sendWordToHistory = function(event){
    var prefs = new FDPrefs();
    var escKey = prefs["escape-history-key"];
  
    if ( !sidebar.getMouseOverMode() ) return;
  
    if((escKey == "ctrlKey" && event.ctrlKey) ||
       (escKey == "altKey"  && event.altKey)  ||
       (escKey == "shiftKey" && event.shiftKey) 
    ){
      sidebar.loadIKnow();
  
    } else {
      sidebar.registHistory();
    }
  
    return false;
  };
   
}).apply(FireDictionary);
