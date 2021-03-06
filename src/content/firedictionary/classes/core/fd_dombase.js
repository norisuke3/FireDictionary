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
 * A class which deal with dom document
 */
function FDDomBase(){
 var ostream = Components.classes['@mozilla.org/network/file-output-stream;1'].createInstance(Components.interfaces.nsIFileOutputStream);
 var serializer = new XMLSerializer();
	var charset = "UTF-8";

 this.domDocument = Components.classes["@mozilla.org/xul/xul-document;1"].createInstance(Components.interfaces.nsIDOMDocument);
  
 /**
  * Element getDocumentElement()
  *
  * @return a root element of the xml for a history item.
  */
 this.getDocumentElement = function(){
 	return this.domDocument.documentElement;
 }
 
 /**
  * setDocumentElement(Element element)
  *
  * @param a element which will be a document Element of this tree.
  */
 this.setDocumentElement = function(element){
  var newNode;

  this.domDocument = Components.classes["@mozilla.org/xul/xul-document;1"].createInstance(Components.interfaces.nsIDOMDocument);
  
  newNode = this.domDocument.importNode(element, true);
  this.domDocument.appendChild(newNode);
 }
	
 /**
  * String serializeToString()
  *
  * @return serialized dom tree.
  */
 this.serializeToString = function(){
 	return serializer.serializeToString(this.getDocumentElement());
 }
 
 /**
  * parseFromString(String s)
  *
  * @param a string of an xml which will be a document of this class.
  */
 this.parseFromString = function(s){
 	var parser = new DOMParser();
 	
 	this.domDocument = parser.parseFromString(s, "text/xml");
 }
 
 /**
  * writeToFile(FDFile file)
  *  write the dom tree to a file. If the file is already exist, it's overridden.
  *
  * @param file
  */
 this.writeToFile = function(file){
		file.create();
 	
  ostream.init(file.getFile(), 2, 0x200, false); // open as "write only"
 	serializer.serializeToStream(this.getDocumentElement(), ostream, charset);
  ostream.close();
 }
 
 /**
  * readFromFile(FDFile file)
  *  read a xml from a file.
  *
  * @param file
  */
 this.readFromFile = function(file){ 	
		var istream = new FDInputStream(file.getFile());
		istream.setCharset(charset);
		
		this.parseFromString(istream.readAsUnicode());
		
		istream.close();
 }
 
 /**
  * Element createElementwithTextNodeNS(String namespace, String elementName, String text)
  *  create an element which has a text node as a child.
  *
  * @param namespace a namespace of the element
  * @param elementName a name of the element
  * @param text text contained as a text node
  */
  this.createElementwithTextNodeNS = function(namespace, elementName, text){
  var element = this.domDocument.createElementNS(namespace, elementName);
  var textNode = this.domDocument.createTextNode(text);
  
  element.appendChild(textNode);
  
  return element;
 }
}