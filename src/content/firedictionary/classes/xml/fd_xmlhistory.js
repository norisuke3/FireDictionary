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
 * A class for a xml element of a history which can contain history items.
 */
function FDXmlHistory(){
 var ns = "http://www.firedictionary.com/history"
 
 /**
  * FDXmlHistory()
  *  Constructor of this class.
  *  Initialize a dom tree.
  */
 FDDomBase.call(this);

	// Add a top node.
 var top = this.domDocument.createElementNS(ns, "hs:firedictionary"); 
 this.domDocument.appendChild(top);
 
 // Add a history node.
 var history = this.domDocument.createElementNS(ns, "hs:history");
 top.appendChild(history);
 
 // Add a items node.
 var items = this.domDocument.createElementNS(ns, "hs:items");
 history.appendChild(items);
 
 
 /**
  * addItem(String keyword, String result)
  *
  * @param keyword Dictionary keyword.
  * @paran result Result of dictionary.
  * @return added element.
  */
 this.addItem = function(keyword, result, category){
    var strbundle=document.getElementById("fd-localized-strings");
 	var item = new FDXmlHistoryItem();
 	
 	if ( !category ) category = strbundle.getString("unclassified");
 	
 	item.setKeyword(keyword);
 	item.setResult(result);
 	item.setUrl("");
 	item.setTitle("");
 	item.setCategory(category);
 	
 	this.addHistoryItem(item);
  
  return item;
 }
 
 /**
  * FDXmlHistoryItem addHistoryItem(FDXmlHistoryItem item)
  *
  * @param item a object of history item
  */
 this.addHistoryItem = function(item){
 	var items = this.domDocument.getElementsByTagNameNS(ns, "items").item(0);
        var newNode = this.domDocument.importNode(item.getDocumentElement(), true)

 	if ( !items.hasChildNodes() ){
 		items.appendChild(newNode);
 	} else {
 		items.insertBefore(newNode, items.firstChild);
 	}
 	
 	return item;
 }
 
 /**
  * FDXmlHistoryItem getLastAddedItem()
  *  Return an item object which is added last time. If there are no items, return null.
  *
  * @return an item object which is added last time.
  */
 this.getLastAddedItem = function(){
 	var items = this.domDocument.getElementsByTagNameNS(ns, "items").item(0);
 	var item = new FDXmlHistoryItem();
 	var result = null;
 	
 	if ( items.hasChildNodes() ){
 		item.setDocumentElement(items.firstChild);
 		result = item;
 	}
 	
 	return result;
 }
 
 /**
  * FDXmlHistoryItem removeLastAddedItem()
  *  remove an item object which is added last time. If there are no items, return null.
  *
  * @return the removed item.
  */
 this.removeLastAddedItem = function(){
 	var items = this.domDocument.getElementsByTagNameNS(ns, "items").item(0);
 	var item = new FDXmlHistoryItem();
 	var result = null;
 	
 	if ( items.hasChildNodes() ){
 		item.setDocumentElement(items.firstChild);
 		result = item;
 		
 		// remove the last one
 		items.removeChild(items.firstChild);
 	}
 	
 	return result;
 }
 
 /**
  * int getItemCount()
  *  return amount of item elements.
  *
  * @return amount of item elements
  */
 this.getItemCount = function(){
     var items = this.domDocument.getElementsByTagNameNS(ns, "items").item(0);

 	return items.childNodes.length;
 }
}