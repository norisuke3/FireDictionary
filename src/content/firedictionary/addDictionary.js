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
 
 var installer;
 
/**
 * initialize()
 *  set a Default value of the dictionary-name text box
 */
function initialize(){
 var config = new FDConfig(window.arguments[0]);
 var menuPopUp = document.getElementById("format-list");
 var formats = config.getSupportFormats();
 
 installer = new FDDictionaryInstaller();
 
 // create menu items.
 for( i=0 ; i < formats.length ; i++ ){
  var menuItem=document.createElement("menuitem");

  menuItem.setAttribute("label" , formats[i]);
  menuItem.setAttribute("value" , formats[i]);
  
  menuPopUp.appendChild(menuItem);
 }
 
 //set default value.
 document.getElementById("format").value = formats[0];
} 

/**
 * pickupDictionary()
 */
function pickupDictionary(){
 installer.pickupDictionary();
 document.getElementById("file-name").value = installer.getFilename();
} 

/**
 * doOK()
 */
function doOK(){
 var config = new FDConfig(window.arguments[0]);
 var dicNames = config.getDictionaryNames();
 var dicName = document.getElementById("fd-dictionary-name").value;
 var format = document.getElementById("format").value;
 var indexDepth = document.getElementById("index-depth").value;
 var fileName = document.getElementById("file-name").value;
 var url = document.getElementById("url").value;
 var charset = document.getElementById("charset").value;
 var result = false;
 
 try{
  // check the dictionary name entered if it's already used or not.
  for( i=0 ; i < dicNames.length ; i++ ){
   if ( dicNames[i] == dicName ) {
    throw new Exception("THE_NAME_HAS_ALREADY_USED");
   }
  }
  
  if (
   dicName == "" ||
   indexDepth == "" ||
   fileName == "" ||
   charset == "" ||
   indexDepth.search(/^\d+$/) == -1
  ) {
   throw new Exception("MANDATORY_FIELD_IS_MISSING");
  
  } else {
   installer.copyDictionary();
   config.appendDictionary(dicName, format, indexDepth, url, fileName, charset);
  
  }
  result = true; 
  
 } catch(e) {
  var strbundle=document.getElementById("fd-localized-strings");
  
  if ( e == "MANDATORY_FIELD_IS_MISSING" ) {
   alert(strbundle.getString("error.mandatoryFields"));
   
  } else if ( e == "THE_DICTIONARY_HAS_ALREADY_EXISTED" ) {
   // alert(strbundle.getString("error.theDictionaryHasAreadyExists"));
   
   // this is no problem because we might need to make new index profile for different
   // index depth with same dictionary file.
   config.appendDictionary(dicName, format, indexDepth, url, fileName, charset);
   
   result = true;
  } else if ( e == "THE_NAME_HAS_ALREADY_USED" ){
   alert(strbundle.getString("error.theNameHasAlreadyBeenRegistered") + "  \"" + dicName + "\"");
   
  }else {
   throw e;
  }
  
 } finally {
  return result;
 }
}

/**
 * doCancel()
 */
function doCancel(){
  return true; 
}