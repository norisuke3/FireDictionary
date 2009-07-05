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
 var ns = "http://www.firedictionary.com/history";
 var strbundle = document.getElementById("fd-localized-strings");
  
 /**
  * FDXmlHistory()
  *  Constructor of this class.
  *  Initialize a dom tree.
  */
 FDDomBase.call(this);
 
 var top = this.domDocument.createElementNS(ns, "hs:firedictionary");
 this.domDocument.appendChild(top);

 // Add a history node.
 var history = this.domDocument.createElementNS(ns, "hs:history");
 top.appendChild(history);

 // Add a items node.
 var items = this.domDocument.createElementNS(ns, "hs:items");
 history.appendChild(items);

 /**
  * create(history as Hash)
  *   add a history to this FDXmlHistory object.
  *   The hash should have the foloowing entry. Otherwise, 
  *   the each empty or null entries are going to be "".
  * 
  *     > keyword
  *     > result
  *     > url
  *     > title
  *     > sentence
  *     > pickedupword
  *     > category
  * 
  * 
  * @param history a hash of a history
  * @return the history hash, but history.category is set to "unclassified" if it's originally null.
  */
  this.create = function(history){
    var items = this.domDocument.getElementsByTagNameNS(ns, "items").item(0);
    if ( !history.category ) history.category = strbundle.getString("unclassified");
    if ( !history.timestamp ) history.timestamp = new Date().getTime();
    if ( !history.date ) history.date = getDate();
    
    var new_item = this.create_element("item", null);

    new_item.appendChild(this.create_element("keyword",      history.keyword));
    new_item.appendChild(this.create_element("result",       history.result));
    new_item.appendChild(this.create_element("url",          history.url));
    new_item.appendChild(this.create_element("title",        history.title));
    new_item.appendChild(this.create_element("sentence",     history.sentence));
    new_item.appendChild(this.create_element("pickedupword", history.pickedupword));
    new_item.appendChild(this.create_element("category",     history.category));
    new_item.appendChild(this.create_element("timestamp",    history.timestamp));
    new_item.appendChild(this.create_element("date",         history.date));

    items.insertBefore(new_item, items.firstChild);

    return history;
  };
  
  /**
   * create_element(element_name as string, text as string)
   *   creates an element of this dom tree without any parent, which means 
   *   the created element needs to be inserted to some element of this tree.
   *   A name space prefix 'hs:' is added to the element_name. 
   *   Also, the text is inserted to the created element is the text is not null.
   *   
   * @param element_name a name of the element
   * @param text a text string to be added to the element.
   * @return the created element.
   */
  this.create_element = function(element_name, text){
    var element = this.domDocument.createElementNS(ns, "hs:" + element_name);

    if (text) {
      var textNode = this.domDocument.createTextNode(text);
      element.appendChild(textNode);
    }

    return element;
  };
 
  
 /**
  * addItem(String keyword, String result)
  *
  * @param keyword Dictionary keyword.
  * @paran result Result of dictionary.
  * @return added element.
  */
 this.addItem = function(keyword, result, category){
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

	items.insertBefore(newNode, items.firstChild);
 	
 	return item;
 }
 
 /**
  * Hash removeLastAddedItem()
  *  remove an item object which is added last time. If there are no items, return null.
  *
  * @return the removed item.
  */
 this.removeLastAddedItem = function(){
   var items = this.domDocument.getElementsByTagNameNS(ns, "items").item(0);
   var result = null;

   if ( items.hasChildNodes() ){
     var h = new XML(this.serializeToString());
     
     result = {
       keyword:      h..ns::item[0].ns::keyword,
       result:       h..ns::item[0].ns::result,
       url:          h..ns::item[0].ns::url,
       title:        h..ns::item[0].ns::title,
       sentence:     h..ns::item[0].ns::sentence,
       pickedupword: h..ns::item[0].ns::pickedupword,
       category:     h..ns::item[0].ns::category,
       timestamp:    h..ns::item[0].ns::timestamp,
       date:         h..ns::item[0].ns::date
     };
     
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
 };

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