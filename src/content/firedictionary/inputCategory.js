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
 * initialize()
 *  set a Default value of the Category text box if it's writtent in
 *  the preference.
 */
function initialize(){
 var prefs = new FDPrefs();
 var category = document.getElementById("category");

 var escapeKey = prefs.getCharPref("escape-history-key");
 var escapeKeyGroup = document.getElementById("fd-escape-key-group");

 var acceptEmptyDefInd = prefs.getCharPref("accept-empty-definition-ind");
 var chkAcceptEmptyDef = document.getElementById("accept-empty-definition");

 var pCueLanguage = prefs.getCharPref("iknow.cue-language");
 var pResLanguage = prefs.getCharPref("iknow.response-language");
 var cueLanguage = document.getElementById("cue-language");
 var resLanguage = document.getElementById("response-language");

 category.value = prefs.getUniCharPref("category");

 escapeKeyGroup.selectedIndex =
  (escapeKey == "ctrlKey") ? 0 :
   (escapeKey == "altKey") ? 1 : 2;

 chkAcceptEmptyDef.checked = acceptEmptyDefInd == "true" ? true : false;

 cueLanguage.value = pCueLanguage;
 resLanguage.value = pResLanguage;
}

function doOK(){
 var prefs = new FDPrefs();
 var category = document.getElementById("category");
 var strbundle=document.getElementById("fd-localized-strings");
 var errorMessage = strbundle.getString("error.usingIllegalCharacter");
 var escapeKeyGroup = document.getElementById("fd-escape-key-group");
 var chkAcceptEmptyDef = document.getElementById("accept-empty-definition");
 var cueLanguage = document.getElementById("cue-language");
 var resLanguage = document.getElementById("response-language");
 var result = true;
 
 if( category.value.indexOf("\"") == -1 ){
  prefs.setUniCharPref("category", category.value);
  
 } else{
  alert(errorMessage);
  result = false;
 }

 // set escape key
 prefs.setCharPref("escape-history-key", escapeKeyGroup.selectedItem.value);

 // set Accept Empty Definition Indicator
 prefs.setCharPref("accept-empty-definition-ind", chkAcceptEmptyDef.checked);

 // set iKnow! cue/response language
 prefs.setCharPref("iknow.cue-language", cueLanguage.value);
 prefs.setCharPref("iknow.response-language", resLanguage.value);

 return result; 
}

function doCancel(){
  return true; 
}