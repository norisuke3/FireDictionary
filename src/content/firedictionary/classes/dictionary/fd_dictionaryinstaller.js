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
 * A class for dictionary contents installer.
 */
function FDDictionaryInstaller(){
 var picker = Components.classes["@mozilla.org/filepicker;1"].createInstance(Components.interfaces.nsIFilePicker);
 var showResult = 99999;	// picker's return value
 
 /**
  * Boolean install()
  *  Start install a dictionary contents.
  *
  * @return true : success, false : not success.
  */
 this.install = function(){
  this.pickupDictionary();
  return this.copyDictionary();
 }
 
 /**
  * pickupDictionary()
  *	 Pick up a dictionary using a file picker.
  */
 this.pickupDictionary = function(){
  picker.init(window, "Install", picker.modeOpen);
  picker.appendFilter("text file" + " (*.txt)", "*.txt");
  picker.appendFilters(picker.filterAll);

  showResult = picker.show();
 }
 
 /**
  * copyDictionary
  *  copy a dictionary file to the FireDictionary profile folder.
  *
  * @return true : success, false : not success
  * @throw THE_DICTIONARY_HAS_ALREADY_EXISTED
  */
 this.copyDictionary = function(){
  var dir = new FDDirectory("ProfD").createNewDirectory("FireDictionary");
  var result = false;
  
  try{
   if ( showResult == picker.returnOK ) {
    var file = picker.file;
    file.copyTo(dir, null)
   
    result = true;
   }
   
  } catch(e) {
   if ( e.toString().indexOf("0x80520008") != -1 ){
    throw new Exception("THE_DICTIONARY_HAS_ALREADY_EXISTED");
   } else {
    throw e;
   }
   
   result = false;
  }
  
  return result;
 }
 
 /**
  * String getFilename()
  *  a file name of the dictionary.
  *
  *  @return a file name of the dictionary
  */
 this.getFilename = function(){
  var filename = ""
  
  if ( showResult == picker.returnOK ) {
   filename = picker.file.leafName;
  }
  
  return filename;
 }
}