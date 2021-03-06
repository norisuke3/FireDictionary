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
  * A class of preference accessing for FireDictionary.
  */
function FDPrefs(){
 var prefService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService); 
 this.mBranch = prefService.getBranch("firedictionary.");
 
 this.initValues = {};
 var children = this.mBranch.getChildList("", {});

 for (var i = 0 ; i < children.length ; i++ ) {
   this[children[i]] = this.mBranch.getComplexValue(children[i], Components.interfaces.nsISupportsString).data;
   this.initValues[children[i]] = this.mBranch.getComplexValue(children[i], Components.interfaces.nsISupportsString).data;
 }
}

/**
 * register()
 *   register the updated values to the preference system.
 */
FDPrefs.prototype.register = function(){
  for (var prop in this.initValues) {
    if (this[prop] != this.initValues[prop]){
      this.setUniCharPref(prop, this[prop]);
      this.initValues[prop] = this[prop];
    }
  }
};

/**
 * initialize(name, value)
 *  initialize preference of the name with the value. If a value has already set
 *  on the preference, doing nothing and returning false.
 *
 * @param name  A name of a preference
 * @param value A value for the preference.
 * @return  true - successfully set, false - otherwise.
 */
FDPrefs.prototype.initialize = function(name, value){
  var result = false;

  if ( this[name] == null ) {
    this[name] = value;
    this.initValues[name]  = "";
    
    this.register();
    result = true;
  }

  return result;
}

/**
 * create(name, value)
 *   create a preference of the name with the value. If a preference of the name has already been present,
 *   its value is overridden.
 */
FDPrefs.prototype.create = function(name, value){
  this[name] = value;
  this.initValues[name] = "";
  this.register();
}

/**
 * setCharPref(name, value)
 *  set a preference with a String type value.
 *  
 * @param name a name of the preference
 * @param value a value of the preference
 */
FDPrefs.prototype.setCharPref = function(name, value){
 this.mBranch.setCharPref(name, value);
}

/**
 * String getCharPref(name)
 *  get a value of the preference. If there is no value related to the name,
 *  return null.
 *
 * @param name a name of the preference
 * @return a value of it, or null if there is no value related to the name.
 */
FDPrefs.prototype.getCharPref = function(name){
 var value;
 
 try{
  value = this.mBranch.getCharPref(name);
 } catch(e) {
  value = null;
 }
 
 return value;
}

/**
 * setUniCharPref(String name, String value)
 *  set a preference with a Unicode String type value.
 *
 * @param name a name of the preference
 * @param value a value of the preference which type is Unicode.
 */
FDPrefs.prototype.setUniCharPref = function(name, value){
 var nsISupportsString = Components.interfaces.nsISupportsString;
 var string = Components.classes["@mozilla.org/supports-string;1"].createInstance(nsISupportsString);

 string.data = value;
 this.mBranch.setComplexValue(name, nsISupportsString, string); 
}

/**
 * String getUniCharPref(String name)
 *  get a value of the preference. If there is no value related to the name,
 *  return null.
 *
 * @param name a name of the preference
 * @return a value of it, or null if there is no value related to the name.
 */
FDPrefs.prototype.getUniCharPref = function(name){
 var nsISupportsString = Components.interfaces.nsISupportsString;
 var value;
 
 try{
  value = this.mBranch.getComplexValue(name, nsISupportsString).data;
 } catch(e) {
  value = null;
 }
 
 return value;
}