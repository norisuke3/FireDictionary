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

var gCategory;
var gDate;
var gKeyword;
var gFirstLetterOfTheKeyword;
var gControlPanelEnable;

/**
 * initialize(category, date, keyword, firstLetterOfTheKeyword)
 * 
 * @param category
 * @param date
 * @param keyword
 * @param firstLetterOfTheKeyword
 */
function initialize(category, date, keyword, firstLetterOfTheKeyword){
 gControlPanelEnable = false;
 
 Init(getStylesheetOfMainArea(), 'history');
 Init('sidebar/history-Keywords-List.xsl', 'word-list');
 Init('sidebar/history-Categories.xsl', 'categories');
 Init('sidebar/history-date-List.xsl', 'date-list');
 Init('sidebar/history-controlpanel.xsl', 'controlpanel')
 
 // set stylesheet
 var prefs = new FDPrefs;
 var name = prefs.getCharPref("firedictionary-stylesheet-type");
 
 setColor(name);
 
 initServerInformation()
}

/**
 * setFilter(category, date, keyword, firstLetterOfTheKeyword)
 * 
 * @param category
 * @param date
 * @param keyword
 * @param firstLetterOfTheKeyword
 */
function setFilter(category, date, keyword, firstLetterOfTheKeyword){
 Init(getStylesheetOfMainArea(), 'history', category, date, keyword, firstLetterOfTheKeyword);
 Init('sidebar/history-Keywords-List.xsl', 'word-list', category, date, keyword, firstLetterOfTheKeyword);
 
 gCategory = category;
 gDate = date;
 gKeyword = keyword;
 gFirstLetterOfTheKeyword = firstLetterOfTheKeyword;
}

/**
 * getStylesheetOfMainArea()
 */
function getStylesheetOfMainArea(){
 var prefs = new FDPrefs;
 var stylesheet = prefs.getCharPref("firedictionary-history-main-stylesheet");
 
 if(!stylesheet) stylesheet = "main/history-Words-and-Excerpts.xsl";
 if( !stylesheet.match(/^main\//) ) stylesheet = "main/" + stylesheet;

 return stylesheet;
}

/**
 * initServerInformation()
 */
function initServerInformation(){
 var parameters = new Array(1);
 var xsl = getXMLDocument('server-info/history-server-information.xsl');
 var xslGetNumber = getXMLDocument("server-info/numberOfInfo.xsl");
 var url = "http://www.firedictionary.com/ad/";
 
 try{
  var xml = getXMLDocument(url);
 
  var fragment = getXMLFragment(xml, xslGetNumber);
  var maxNum = fragment.textContent;
  var num = Math.floor(Math.random() * maxNum) + 1;
 
  parameters[0] = new Array("number", num);
 
  fragment = getXMLFragment(xml, xsl, parameters);
 
  document.getElementById('server-infomation').innerHTML = "";
  document.getElementById('server-infomation').appendChild(fragment);
 } catch(e) {
 }
}

/**
 * Init(xslName, id, category, date, keyword, firstLetterOfTheKeyword)
 * 
 * @param xslName
 * @param id
 * @param category
 * @param date
 * @param keyword
 * @param firstLetterOfTheKeyword
 */
function Init(xslName, id, category, date, keyword, firstLetterOfTheKeyword){
 var parameters = new Array(4);
 var xml = getXMLDocument(getHistoryFile().getURL());
 var xsl = getXMLDocument(xslName);
 var fragment;

 parameters[0] = new Array("category", category)
 parameters[1] = new Array("date", date)
 parameters[2] = new Array("keyword", keyword)
 parameters[3] = new Array("first-letter-of-the-keyword", firstLetterOfTheKeyword)
 
 fragment = getXMLFragment(xml, xsl, parameters);
 
 document.getElementById(id).innerHTML = "";
 document.getElementById(id).appendChild(fragment);
}

/**
 * XMLDocumentFragment getXMLFragment(XMLDocument xml, XMLDocument xsl, Array parameters)
 *
 * @param xml 
 * @param xsl
 * @param parameters Array of xsl transform parameters.
 *                   This array is two dimensions and contains a name and a value.
 *                   If a parameter is null, it is replaced as empty string.
 * @return result of the transformation.
 */
function getXMLFragment(xml, xsl, parameters){
 var transformer = new XSLTProcessor();
 var i;
 
 transformer.importStylesheet(xsl);
 
 if( parameters ) {
  for( i=0 ; i<parameters.length ; i++){
   transformer.setParameter(
       null,
       parameters[i][0],
       getNonNullString(parameters[i][1])
   );
  }
 }
  
 return transformer.transformToFragment(xml, document);
}

/**
 * String getNonNullString(String s)
 * 
 * @param any string
 * @return result
 */

function getNonNullString(s){
 return (s == null) ? "" : s;
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

/**
 * setColor(String name)
 * 
 * @param name
 */
function setColor(name){
 var prefs = new FDPrefs;
 var base = "chrome://firedictionary/skin/";
 
 if( !name ){
  url = base + "history-default.css";
 } else {
  prefs.setCharPref("firedictionary-stylesheet-type", name);
  url = base + name;
 }
 
 document.getElementsByTagName("link")[0].href = url;
}

/**
 * setStyle(String name)
 * 
 * @param name
 */
function setStyle(name){
 var prefs = new FDPrefs;
 
 if (name){
  prefs.setCharPref("firedictionary-history-main-stylesheet", name);
 }
 
 Init(getStylesheetOfMainArea(), 'history', gCategory, gDate, gKeyword, gFirstLetterOfTheKeyword);
}

function streachSidebar(){
 var prefs = new FDPrefs;
 var parameters = new Array(1);
 var xml = getXMLDocument(getHistoryFile().getURL());
 var xsl = getXMLDocument('sidebar/history-controlpanel.xsl');
 var id = 'controlpanel';
 var fragment;

 gControlPanelEnable = !gControlPanelEnable;
 
 parameters[0] = new Array("enable", gControlPanelEnable)
 
 fragment = getXMLFragment(xml, xsl, parameters);
 
 document.getElementById(id).innerHTML = "";
 document.getElementById(id).appendChild(fragment);
 
 if( gControlPanelEnable ) {
  document.getElementById("form-color").firstChild.value = prefs.getCharPref("firedictionary-stylesheet-type");
  document.getElementById("form-style").firstChild.value = prefs.getCharPref("firedictionary-history-main-stylesheet");
 }
}