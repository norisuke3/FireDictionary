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

var dicSidebar;

///////////////////////////////////////////////////

/**
 * initialize()
 *  function to initialize FireDictionary environment.
 */
function initialize(){
		// Initialize tab browser and events.
	var tabbrowser = document.getElementById("content");

	if ( tabbrowser ) {
	 tabbrowser.addEventListener("click", sendWordToHistory, false);
 	tabbrowser.addEventListener("mousemove", sendContentWord, false);
	}	
                     
	// Initialize dictionary sidebar object.
	dicSidebar = new FDDictionarySidebar(FDDictionarySidebar.FD_MODE_WORD_PICKEDUP);
}
 
//
// Event handler  ///////////////////////////////////////////////////////
//
 
/**
 * sendContentWord(event)
 *
 * @param event
 */
function sendContentWord(event){
 if ( !dicSidebar.isActive() || !dicSidebar.getMouseOverMode() ) return;
 
	var extractor = new FDSentenceExtractor(event);
	
	var keyword = extractor.getKeyword();
	var sentence = extractor.getSentence();
	var url = event.view.document.URL;
	var title = event.view.document.title;
	
	dicSidebar.setKeywordInformation(url, title, sentence);
	dicSidebar.setKeyword(keyword);
	dicSidebar.lookup();
}

/**
 * sendWordToHistory()
 *  Send the word to Find History.
 */
function sendWordToHistory(){
 if ( !dicSidebar.getMouseOverMode() ) return;
 
	dicSidebar.registHistory();
	return false;
}