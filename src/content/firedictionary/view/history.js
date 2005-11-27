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
 
function initialize(){
 Init('history-Words-and-Excerpts.xsl', 'history');
 Init('history-Keywords-List.xsl', 'word-list');
}

function Init(xslName, id){
  var transformer = new XSLTProcessor();
  var xmlDoc = getXMLDocument(getHistoryFile().getURL());
  
  // load a style sheet.
  transformer.importStylesheet(getXMLDocument(xslName));
  var fragment = transformer.transformToFragment(xmlDoc, document);

  document.getElementById(id).innerHTML = "";
  document.getElementById(id).appendChild(fragment);
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