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
 * Noriaki Hamamoto <nori_dev@hotmail.com>.
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
 * A class for modified local document.
 */
function FDModifiedLocalDocument(document, tabId, dir){
	// XPCOM
	var URI = Components.classes['@mozilla.org/network/standard-url;1']
                        .createInstance(Components.interfaces.nsIURI);
	var unicodeConverter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"]
	                       .createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
 
 // Initialize
 var htmlParser = new FDHtmlParser();
 var REProtocol = new RegExp("^(http|ftp|chrome):", "i");
 
	/**
	 * FDModifiedLocalDocument(HTMLDocument document, String tabId, FDDirectory dir)
	 *  Constructor of this class.
	 *
	 * @param document document object.
	 * @param tabId Unique tab id. This id is used for local file name.
	 * @param dir The directory in which local file will be created.
	 */
 var localFileName = tabId + ".html";
	var file = dir.createFileInstance(localFileName);
	unicodeConverter.charset = document.characterSet;
	
	// resolve relative URI in the document.
	resolveURI(document);
	
	// create local file.
	var content = htmlParser.getContent(document.documentElement);
 content = unicodeConverter.ConvertFromUnicode(content);
	file.write(content);
	
	/**
	 * String getFileURL()
	 *
	 * @return a URL of the local file.
	 */
	this.getFileURL = function(){
		return file.getURL();
	}
	
	//
 // Private method ///////////////////////////////////////////////////////
 //

 /*
  *
  */
 function resolveURI(element){
  URI.spec = element.location; 
	
 	resolve(element.getElementsByTagName("link"), "href", URI);
 	resolve(element.getElementsByTagName("a"), "href", URI);
 	resolve(element.getElementsByTagName("img"), "src", URI);
 }

 /*
  *
  */
 function resolve(targetElements, attrName, URI){
 	var attr;
  for ( i=0 ; i<targetElements.length ; i++ ){
  	attr = targetElements[i].getAttributeNode(attrName);
  	if(attr){
  	 if( !attr.value.match(REProtocol)) {
  	 	attr.value = URI.resolve(attr.value);
  	 }
  	}
  }
 }
}