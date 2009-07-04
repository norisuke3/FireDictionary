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
 * A class for words history.
 */
function FDWordHistory(){
 var sidebar = top.document.getElementById("sidebar");
 var urlWordHistoryAndExcerpts = "chrome://firedictionary/content/view/WordHistoryAndExcerpt.html";
	var mUndoBuffer = new FDXmlHistory();
	var mHistoryCount = 0;                         // a number of history
	
	/**
	 * initialize()
	 *  Load the words which is stored to history file.
	 */
	this.initialize = function(){
	 var xmlHistory = new FDXmlHistory();
		var file = getHistoryFile();
		
		if( file.exists() ){
			xmlHistory.readFromFile(file);
		 setText(formatHistory(xmlHistory));
			mHistoryCount = xmlHistory.getItemCount();
			
		} else {
			var oldfile = getHistoryFileEx();
			if( oldfile.exists() ){
				var translator = new FDHistoryTranslator(oldfile);
				xmlHistory = translator.getXmlHistory();
				
 		 setText(formatHistory(xmlHistory));
 		 xmlHistory.writeToFile(file);
			}
		}
	}
	
    /**
     * registWord(
     *     String keyword,
     *     String result,
     *     String url,
     *     String title,
     *     String sentence,
     *     String pickedupword,
     *     String category
     * )
     */
    this.registWord = function(keyword, result, url, title, sentence, pickedupword, category){
        var file = getHistoryFile();
        var xmlHistory = new FDXmlHistory();
    
        if( file.exists() )
            xmlHistory.readFromFile(file);
        
        var h = new XML(xmlHistory.serializeToString());
        var ns = new Namespace("http://www.firedictionary.com/history");
        // If the keyword is registered just before, do noghing and return.
        var lastWord = h..ns::item[0] ? h..ns::item[0].ns::keyword : null;
        if ( lastWord == keyword ) 
            return;
     
        var item = new FDXmlHistoryItem();
        item.setKeyword(keyword);
        item.setResult(result);
        item.setUrl(url);
        item.setTitle(title);
        item.setSentence(sentence);
        item.setPickedUpWord(pickedupword);
        item.setCategory(category);
        
        xmlHistory.addHistoryItem(item);
        
        setText(formatHistory(xmlHistory));
        xmlHistory.writeToFile(file);
        
        mHistoryCount = xmlHistory.getItemCount();
    };
    
	/**
	 * clear()
	 *  Clear the history and delete the history file.
	 */
	this.clear = function(){
		var oldfile = getHistoryFileEx();
		
		if ( oldfile.exists() ) oldfile.remove();		
		getHistoryFile().remove();
		setText("");
		
		mUndoBuffer = new FDXmlHistory();
		mHistoryCount = 0;
	}
	
	/**
	 * resetUndoBuffer()
	 *  reset undo buffer.
	 */
	this.resetUndoBuffer = function(){
		mUndoBuffer = new FDXmlHistory();
	}

/**
 * view()
 *  View the history in the browser as a html.
 */
 this.view = function(){
  var tabbrowser = top.document.getElementById("content");
  var tab = tabbrowser.addTab(urlWordHistoryAndExcerpts);
 
  tabbrowser.selectedTab = tab;
 }
 
 /**
  * undoHistory()
  *  undo a process of registering a word to the history.
  **/
 this.undoHistory = function(){
		var file = getHistoryFile();
	 var xmlHistory = new FDXmlHistory();
	 var item;
	 
		if( !file.exists() ){
		 return;
		}
		
		xmlHistory.readFromFile(file);
		
		item = xmlHistory.removeLastAddedItem();
		if( item ){
		 mUndoBuffer.addHistoryItem(item);
		}
				
		setText(formatHistory(xmlHistory));
		xmlHistory.writeToFile(file);
		mHistoryCount = xmlHistory.getItemCount();
 }
  
 /**
  * redoHistory()
  *  redo a process of registering a word to the history.
  */
 this.redoHistory = function(){
		var file = getHistoryFile();
	 var xmlHistory = new FDXmlHistory();
	 var item;
	
		if( file.exists() ){
			xmlHistory.readFromFile(file);
		}
		
		item = mUndoBuffer.removeLastAddedItem();
		if( item ){
		 xmlHistory.addHistoryItem(item);
		}
				
		setText(formatHistory(xmlHistory));
		xmlHistory.writeToFile(file);
		mHistoryCount = xmlHistory.getItemCount();
 }
 
 /**
  * int getHistoryCount()
  *  return amount of registered words to the history.
  *
  * @return amount of registered words to the history.
  */
 this.getHistoryCount = function(){
		return mHistoryCount;
 }
 
 /**
  * int getUndoBufferCount()
  *  return amount of registered words to the undo buffer.
  *
  * @return amount of registered words to the undo buffer.
  */
 this.getUndoBufferCount = function(){
  return mUndoBuffer.getItemCount();
 }
	
 //
 // Private method ///////////////////////////////////////////////////////
 //
 
 function setText(s){
 	sidebar.contentDocument.getElementById("dictionary-result-history").value = s;
 }
 
 function getText(){
 	return sidebar.contentDocument.getElementById("dictionary-result-history").value;
 }
 
 /**
  * FDFile getHistoryFile()
  *  Return a file instance of 'history.xml'
  *
  * @return a file instance of 'History.xml'
  */
 function getHistoryFile(){
  var dir = new FDDirectory("ProfD");
  dir.changeDirectory("FireDictionary");
  return dir.createFileInstance("history.xml"); 	
 }
 
 /**
  * FDFile getHistoryFileEx()
  *  -- This method is for the old style history file, which is written in
  *  -- plain text and used until FireDictionry 0.8.2.
  * 
  *  Return a file instance of 'history.txt'
  *
  * @return a file instance of 'History.txt'
  */
 function getHistoryFileEx(){
  var dir = new FDDirectory("ProfD");
  dir.changeDirectory("FireDictionary");
  return dir.createFileInstance("history.txt"); 	
 }
 
 /**
  * String formatHistory(FDXmlHistory history)
  */
 function formatHistory(history){
  var urlXsl = "chrome://firedictionary/content/classes/dictionary/res/history.xsl"
  var transformer = new XSLTProcessor();
  var fragment;
  
  if ( history.getItemCount() == 0 ){
   return "";
  }
  
  transformer.importStylesheet(getXMLDocument(urlXsl));
  fragment = transformer.transformToFragment(history.getDocumentElement(), document);
  
  return fragment.firstChild.nodeValue;
 }

 /**
  * Document getXMLDocument(String url)
  *
  * @param url
  * @return XML Document
  */
 function getXMLDocument(url){
   var xmlHttpRequest = new XMLHttpRequest();
   
   xmlHttpRequest.open("GET", url, false);
   xmlHttpRequest.send(null); 

   return xmlHttpRequest.responseXML;
 }
}