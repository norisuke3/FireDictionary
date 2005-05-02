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
 
function FDFile(name){	
 // private
 var aFile = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
 var stream = Components.classes['@mozilla.org/network/file-output-stream;1'].createInstance(Components.interfaces.nsIFileOutputStream);
	if (aFile && name){
  aFile.initWithPath(name);
	}
	
 /**
  * FDFile(String name)
  *  Constructor of this class.
  * 
  * @param name file name as full path.
  */
 FDPermanent.call(this, aFile);

 /**
  * nsIFile getFile()
  *
  * @return clone of this file.
  */
 this.getFile = function(){
  return this.getPermanent();
 }
  
 /**
  * setFile(nsIFile _file)
  *
  * @param _file file object which is instance of nsIFile.
  */
 this.setFile = function(_file){
  this.setPermanent(_file);
 }
 
 /**
  * create()
  *  Create new file. If the file is already exist, it's overridden.
  *
  */
 this.create = function(){
  if (this.permanent.exists()){
   this.remove(true);
  }
  
  this.permanent.create(aFile.NORMAL_FILE_TYPE, 0666);
 }
 
 /**
  * write(String s)
  *  Write text to this file. If the file exists, it's overridden, and if
  *  the file doesn't exist, it's created.
  *
  * @param s Text you want to write into the file.
  */
 this.write = function(s){
 	if ( this.permanent.exists() ) {
 		this.remove(true);
 	}
 	
 	this.create();
  
  stream.init(this.permanent, 2, 0x200, false); // open as "write only"
  stream.write(s, s.length);
  stream.close();
 }
 
 /**
  * int getSize()
  *
  * @return file size as byte.
  */
 this.getSize = function(){
 	return this.permanent.fileSize;
 }
 
 /**
  * FDDirectory getParentDirectoryInstance()
  *  Return the directory object of this file.
  *
  * @return Directory object of this file.
  */
 this.getParentDirectoryInstance = function(){
 	var leafName = this.permanent.leafName;
 	var fullName = this.permanent.path;
 	var re = new RegExp("^(.*)" + leafName + "$");
 	fullName.match(re);
 	var path = RegExp.$1;
 	
 	var dir = new FDDirectory();
 	
 	dir.setDirectoryByPath(path);
 	return dir;
 }
}