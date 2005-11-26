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
 * A class for a xml element of a history item.
 * The element 'item' can contain following elements.
 *
 *   keyword
 *   result
 *   url
 *   title
 *   category
 *   timestamp
 */
function FDXmlHistoryItem(){
 var ns = "http://www.firedictionary.com/history"
 
 /**
  * FDXmlHistoryItem()
  *  Constructor of this class.
  *  Initialize a dom tree with an Item element.
  */
 FDDomBase.call(this);
 
	// Add a top node.
 var item = this.domDocument.createElementNS(ns, "hs:item");
 this.domDocument.appendChild(item);
 
 // add timestamp element
 var timestamp = this.domDocument.createElementNS(ns, "hs:timestamp");
 timestamp.appendChild(this.domDocument.createTextNode(new Date().getTime()));
 item.appendChild(timestamp);
 
 // add date element
 var date = this.domDocument.createElementNS(ns, "hs:date");
 date.appendChild(this.domDocument.createTextNode(getDate()));
 item.insertBefore(date, timestamp);
 
 /**
  * setKeyword(String keyword)
  *
  * @param keyword
  */
 this.setKeyword = function(keyword){
 	var element = this.domDocument.createElementNS(ns, "hs:keyword");
 	element.appendChild(this.domDocument.createTextNode(keyword));
 	item.insertBefore(element, date);
 }
 
 /**
  * String getKeyword()
  *  Return a string of keyword. If there are no keyword in this tree, return null.
  *
  * @return keyword
  */
 this.getKeyword = function(){
 	return this.getTextContent("keyword");
 }
 
 /**
  * setResult(String result)
  *
  * @param result
  */
 this.setResult = function(result){
 	var element = this.domDocument.createElementNS(ns, "hs:result");
 	element.appendChild(this.domDocument.createTextNode(result));
 	item.insertBefore(element, date);
 }
 
 /**
  * String getResult()
  *  Return a string of result. If there are no result in this tree, return null.
  *
  * @return result
  */
 this.getResult = function(){
 	return this.getTextContent("result");
 }
 
 /**
  * setUrl(String url)
  *
  * @param url
  */
 this.setUrl = function(url){
 	var element = this.domDocument.createElementNS(ns, "hs:url");
 	element.appendChild(this.domDocument.createTextNode(url));
 	item.insertBefore(element, date);
 }
 
 /**
  * String getUrl()
  *  Return a string of url. If there are no url in this tree, return null.
  *
  * @return url
  */
 this.getUrl = function(){
 	return this.getTextContent("url");
 }
 
 /**
  * setTitle(String title)
  *
  * @param title
  */
 this.setTitle = function(title){
 	var element = this.domDocument.createElementNS(ns, "hs:title");
 	element.appendChild(this.domDocument.createTextNode(title));
 	item.insertBefore(element, date);
 }
 
 /**
  * String getTitle()
  *  Return a string of title. If there are no title in this tree, return null.
  *
  * @return title
  */
 this.getTitle = function(){
 	return this.getTextContent("title");
 }
 
 /**
  * setSentence(String sentence)
  *
  * @param sentence
  */
 this.setSentence = function(sentence){
 	var element = this.domDocument.createElementNS(ns, "hs:sentence");
 	element.appendChild(this.domDocument.createTextNode(sentence));
 	item.insertBefore(element, date);
 }
 
 /**
  * String getSentence()
  *  Return a string of sentence. If there are no sentence in this tree, return null.
  *
  * @return sentence
  */
 this.getSentence = function(){
 	return this.getTextContent("sentence");
 }
 
 /**
  * String getPickedUpWord()
  *  Return a string of pickedupword. If there are no pickedupword in this tree, return null.
  *
  * @return pickedupword
  */
 this.getPickedUpWord = function(){
 	return this.getTextContent("pickedupword");
 }
 
 /**
  * setPickedUpWord(String pickedupword)
  *
  * @param pickedupword
  */
 this.setPickedUpWord = function(pickedupword){
 	var element = this.domDocument.createElementNS(ns, "hs:pickedupword");
 	element.appendChild(this.domDocument.createTextNode(pickedupword));
 	item.insertBefore(element, date);
 }
 
 /**
  * setCategory(String category)
  *
  * @param category
  */
 this.setCategory = function(category){
 	var element = this.domDocument.createElementNS(ns, "hs:category");
 	element.appendChild(this.domDocument.createTextNode(category));
 	item.insertBefore(element, date);
 }
 
 /**
  * String getCategory()
  *  Return a string of category. If there are no category in this tree, return null.
  *
  * @return category
  */
 this.getCategory = function(){
 	return this.getTextContent("category");
 }
 
 /**
  * String getTimestamp()
  *  Return a string of timestamp. If there are no timestamp in this tree, return null.
  *
  * @return timestamp
  */
 this.getTimestamp = function(){
 	return this.getTextContent("timestamp");
 }
 
 /**
  * String getTextContent(String elementName)
  *  Return the text content of an element whose name is passed as a attribute 'elementName'
  *
  * @param element name
  * @return text content
  */
 this.getTextContent = function(elementName){
 	var nodes = this.domDocument.getElementsByTagNameNS(ns, elementName);
 	var result = null;
 	
 	if ( nodes.length != 0 ){
 		result = nodes.item(0).textContent;
 	}
 	
 	return result;
 }
	
 //
 // Private method ///////////////////////////////////////////////////////
 //
 
 /**
  * String getDate()
  *  return a string which express current date. The format is "yyyy/mm/dd".
  *
  * @return a string of date.
  */
 function getDate(){
 	var today = new Date();
 	
 	return today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate();
 }
}