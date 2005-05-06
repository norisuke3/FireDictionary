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
  * A class for configuration file whose name is 'dictionary-config.xml'
  */
function FDConfig(dir){
	var	URI = Components.classes["@mozilla.org/network/standard-url;1"].createInstance(Components.interfaces.nsIURI);
	var IOService = Components.classes['@mozilla.org/network/io-service;1'].getService(Components.interfaces.nsIIOService);
	var scriptableIStream = Components.classes['@mozilla.org/scriptableinputstream;1'].createInstance(Components.interfaces.nsIScriptableInputStream);
 var filenameConfig = "dictionary-config.xml"
 
	var file = dir.createFileInstance(filenameConfig); 
 if ( !file.exists() ) createConfigFile(dir, filenameConfig); 	
 var istream = new FDInputStream(file.getFile());
 istream.setCharset("UTF-8");
 
 /**
  * FDConfig(FDDirectory dir)
  *  Constructor of this class.
  *
  * @param dir A directory which contains the file 'dictionary-config.xml'.
  */
 var parser = new DOMParser();
 var document = parser.parseFromString(istream.readAsUnicode(), "text/xml");
 
 // Initialize XPath objects.
 var evaluator = new XPathEvaluator();
 var nsresolver = evaluator.createNSResolver(document.documentElement);
 
 /**
  * Array getDictionaryNames()
  *  Return an array of dictionary names which are written in the configuration file.
  *
  * @return an array of dictiionary names.
  */
 this.getDictionaryNames = function(){
 	var dicNames = new Array();
 	var nodes = document.getElementsByTagName("dictionary");
 	
  for( i=0 ; i < nodes.length ; i++ ){
  	dicNames.push(nodes[i].getAttribute("name"));
  }
  
 	return dicNames;
 }
 
 /**
  * String getURL(String dicName)
  *  Return an URL where we can get the dictionary mentioned by the attribute 'dicName'.
  *
  * @param dicName a name of the dictionary 
  * @return An URL where we can get the dictinoary.
  *         In case no dictinoary name in the configuration file, return null.
  */
 this.getURL = function(dicName){
 	var xpath = "string(/info:dictionaries/info:dictionary[@name = '" + dicName + "']/info:url)";
 	var result = evaluator.evaluate(xpath, document, nsresolver, 0, null);
 	
 	return result.stringValue == "" ? null : result.stringValue ;
 }
 
 /**
  * String getFileName(String dicName)
  *  Return a file name of the dictionary mentioned by the attribute 'dicName'.
  *
  * @param dicName a name of the dictionary.
  * @return A file name of the dictionary.
  */
 this.getFileName = function(dicName){
 	var xpath = "string(/info:dictionaries/info:dictionary[@name = '" + dicName + "']/info:file-name)";
 	var result = evaluator.evaluate(xpath, document, nsresolver, 0, null);
 	
 	return result.stringValue == "" ? null : result.stringValue ;
 }
 
 /**
  * String getCharset(String dicName)
  *  Return a character set of the dictionary mentioned by the attribute 'dicName'.
  *
  * @param dicName a name of the dictionary.
  * @return a character set of the dictinoary.
  */
 this.getCharset = function(dicName){
 	var xpath = "string(/info:dictionaries/info:dictionary[@name = '" + dicName + "']/info:charset)";
 	var result = evaluator.evaluate(xpath, document, nsresolver, 0, null);
 	
 	return result.stringValue == "" ? null : result.stringValue ;
 }
	
	//
 // Private method ///////////////////////////////////////////////////////
 //
 
 /**
  * function createConfigFile(FDDirectory dir, String name)
  *
  * @param dir
  * @param naem
  */
 function createConfigFile(dir, name){
 	URI.spec = "chrome://firedictionary/content/classes/dictionary/res/dictionary-config.xml";
 	var stream = IOService.newChannelFromURI(URI).open();
 	scriptableIStream.init(stream);
 	
 	var content = scriptableIStream.read(scriptableIStream.available())
 	
 	scriptableIStream.close();
 	stream.close();
 	
 	var file = dir.createFileInstance(name);
 	file.write(content);
 }
}