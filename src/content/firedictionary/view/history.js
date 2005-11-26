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