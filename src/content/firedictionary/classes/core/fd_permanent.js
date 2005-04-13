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
 
/**
 * This is virtual class for class FDFile and class FDDirectory, so you MUST NOT
 * create the instance of this class.
 */
function FDPermanent(_permanent){
	var fileProtocolHandler = Components.classes['@mozilla.org/network/protocol;1?name=file'].getService(Components.interfaces.nsIFileProtocolHandler);

 /**
  * FDPermanent(nsIFile _permanent)
  *  Constructor of this class.
  * 
  * @param _permanent permanent object like a file or a directory.
  */
	this.permanent = _permanent;
 
 /**
  * Boolean exists()
  *
  * @return exists - true, otherwise - false.
  */
 this.exists = function(){
 	return this.permanent.exists();
 }
 
 /**
  * remove(Boolean recursive)
  *  Remove this permanent.
  *
  * @param recursive This flag must be true to delete directories which are not empty.
  */
 this.remove = function(recursive){
 	if ( this.permanent.exists() ) {
 		this.permanent.remove(recursive);
 	}
 }

 /**
  * nsIFile getPermanent()
  *
  * @return clone of the permanent.
  */
 this.getPermanent = function(){
  return this.permanent.clone();
 }
  
 /**
  * setPermanent(nsIFile _permanent)
  *
  * @param _permanent file object which is instance of nsILocalFile.
  */
 this.setPermanent = function(_permanent){
  this.permanent = _permanent;
 }
 
 /**
  * String getPath()
  *
  * @return The location of this directory as path expresion.
  */
 this.getPath = function(){
 	return this.permanent.QueryInterface(Components.interfaces.nsILocalFile).path;
 }
 
 /**
  * String getURL()
  *
  * @return The location of this directory as URL expresion.
  */
 this.getURL = function(){
 	var URL;
  try {
   URL =fileProtocolHandler.getURLSpecFromFile(this.permanent);
  } catch(e) {
   URL  = false;
  }
  
  return URL;
 }
}