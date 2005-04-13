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
 * Noriaki Hamamoto <nori_dev@hotmail.com>.
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
 
function FDDirectory(property){
 // private
 var serviceProperties = Components.classes['@mozilla.org/file/directory_service;1'].getService(Components.interfaces.nsIProperties);
 
 /**
  * FDDirectory(String property)
  *  Constructor of this class.
  * 
  * @param property If it's fail value, it will be set as "ProfD".
  *   ProfD	: Current profile directory
  */
 if ( !property ) property = "ProfD";
 FDPermanent.call(this, serviceProperties.get(property, Components.interfaces.nsIFile));

 /**
  * nsIFile createNewDirectory(String name) 
  *
  * @param name The name of directory you want to create under the current directory.
  * @return clone of the directory.
  */
 this.createNewDirectory = function(name){
  this.permanent.append(name);
  if( !this.permanent.exists() ){
   this.permanent.create(this.permanent.DIRECTORY_TYPE, 0700);
  }
  return this.permanent.clone();
 }
 
 /**
  * Boolean changeDirectory(String name)
  *  Change the current directory to their child directory.
  *  If the argument name is not exist, this method return false.
  *
  * @param A string which is intended to be a child directory of the current directory.
  * @return success - true, otherwise - false.
  */
 this.changeDirectory = function(name){
 	var test = this.getDirectory();
 	var result = false;
 	
 	// test whether the directory which is mentioned by the argument name exists or not.
 	test.append(name); 	
 	if ( test.exists() ){
 		this.permanent.append(name);
 		result = true;
 	}
 	
 	return result;
 }

 /**
  * FDFile createFileInstance(String name)
  *  Create a instance of new file under this directory path.
  *  This method DOESN'T create file itself, but just instance of the calss nsILocalFile.
  *  You HAVE TO create the file itself by yourself using this file instance if you want.
  *
  * @param name the name of a file you want to create under this directory path.
  * @return success - file instance. fail - false.
  */
 this.createFileInstance = function(name){
 	var dir = this.getDirectory();
 	var file = new FDFile();
 	
 	dir.append(name);
 	file.setFile(dir);

  return file;
 }

 /**
  * nsIFile getDirectory()
  *
  * @return clone of this directory.
  */
 this.getDirectory = function(){
  return this.getPermanent();
 }
  
 /**
  * setDirectory(nsIFile _dir)
  *
  * @param _dir file object which is instance of nsIFile.
  */
 this.setDirectory = function(_dir){
  this.setPermanent(_dir);
 }
 
 /**
  * setDirectoryByPath(String path)
  *
  * @param path A string of a path.
  */
 this.setDirectoryByPath = function(path){
 	 var aDir = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
 	 aDir.initWithPath(path);
 	 this.setPermanent(aDir);
 }
}