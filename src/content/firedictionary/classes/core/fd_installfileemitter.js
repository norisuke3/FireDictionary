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
  * The role of this class is copying a file from chrome to some directory.
  * It's useful on the installation process.
  */
function FDInstallFileEmitter(uri){
	var	URL = Components.classes["@mozilla.org/network/standard-url;1"].createInstance(Components.interfaces.nsIURL);
	var IOService = Components.classes['@mozilla.org/network/io-service;1'].getService(Components.interfaces.nsIIOService);
	var scriptableIStream = Components.classes['@mozilla.org/scriptableinputstream;1'].createInstance(Components.interfaces.nsIScriptableInputStream);
	var fileName = "";
	
	/**
	 * FDInstallFileEmitter(String uri)
	 *  Constructor of this class.
	 */
	URL.spec = uri;
	fileName = URL.fileName;
	
	/**
	 * setFileName(String name)
	 *  set new file name.
	 */
	this.setFileName = function(name){
		fileName = name;
	}
	
	/**
	 * String getFileName()
	 *  return new file name.
	 */
	this.getFileName = function(){
		return fileName;
	}
	
	/**
	 * Boolean emitTo(FDDirectory dir)
	 *
	 * @param dir A directory object to which you want to copy the file in the chrome.
	 * @return true if it's success.
	 */
	this.emitTo = function(dir){
		var result = true;
		
		try{
  	var stream = IOService.newChannelFromURI(URL).open();
  	scriptableIStream.init(stream);
 	
  	var content = scriptableIStream.read(scriptableIStream.available())
 	
  	scriptableIStream.close();
  	stream.close();
 	
  	var file = dir.createFileInstance(fileName);
  	file.write(content);
 	
 	} catch(e) {
 		if ( file != null ){
  		file.remove();
 		}
 		
 		result = false;
 		
 	}
 	
		return result;
	}
}