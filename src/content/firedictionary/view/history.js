var xslStylesheet;
var xmlDoc;

function initialize(){
 Init('history-Words-and-Excerpts.xsl', 'history');
 Init('history-Keywords-List.xsl', 'word-list');
}

function Init(xslName, id){
  var xsltProcessor = new XSLTProcessor();

  // load the xslt file, example1.xsl
  var myXMLHTTPRequest = new XMLHttpRequest();
  myXMLHTTPRequest.open("GET", xslName, false);
  myXMLHTTPRequest.send(null);

  xslStylesheet = myXMLHTTPRequest.responseXML;
  xsltProcessor.importStylesheet(xslStylesheet);

  // load the xml file
  var urlHistoryfile = getHistoryFile().getURL();
  myXMLHTTPRequest = new XMLHttpRequest();
  myXMLHTTPRequest.open("GET", urlHistoryfile, false);
  myXMLHTTPRequest.send(null);

  xmlDoc = myXMLHTTPRequest.responseXML;

  var fragment = xsltProcessor.transformToFragment(xmlDoc, document);

  document.getElementById(id).innerHTML = "";

  document.getElementById(id).appendChild(fragment);
}
 
/**
 * getHistoryFile()
 *  Return a file instance of 'history.xml'
 *
 * @return a file instance of 'History.xml'
 */
function getHistoryFile(){
 var dir = new FDDirectory("ProfD");
 dir.changeDirectory("FireDictionary");
 return dir.createFileInstance("history.xml"); 	
}