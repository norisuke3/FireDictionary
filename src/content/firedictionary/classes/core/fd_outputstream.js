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
 
function FDOutputStream(file){
 var stream = Components.classes['@mozilla.org/network/file-output-stream;1'].createInstance(Components.interfaces.nsIFileOutputStream);
 var unicodeConverter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
 
 /**
  * FDOutputStream(nsIFile file)
  *  Constructor of this class
  *
  * @param file
  */
 var mFile = file;
 
 /**
  * setCharset(String charset)
  *  set a character set for the file which is given as a attribute of this constructor.
  *
  * @param charset This is used for the method writeAsUnicode().
  */
 this.setCharset = function(charset){
  unicodeConverter.charset = charset;
 }
	
 /**
  * String getCharset()
  *  Return the current character set.
  *
  * @return the current character set.
  */
 this.getCharset = function(){
  return unicodeConverter.charset;
 }
	
 /**
  * close()
  *  Close this output stream.
  */
 this.close = function(){
  stream.close();
 }
 
 /**
  * write(char* s)
  *  Write texts to a file which is provided by constructor.
  *  If the file exists, it's overridden, and if the file doesn't exist,
  *  it's gonna be created.
  *
  * @param s Text you want to write into the file.
  */
 this.function = write(s){ 
  mFile.create();
  
  stream.init(mFile, 2, 0x200, false); // open the file as "write only"
  stream.write(s, s.length);
  stream.close();
 }
 
 /**
  * writeAsUnicode(String s)
  *  Write Unicode texts to a file which is provided by constructor.
  *  If the file exists, it's overridden, and if the file doesn't exist,
  *  it's gonna be created.
  *
  * @param s Unicode text you want to write into the file.
  */
 this.function = writeAsUnicode(s){
  if ( this.getCharset() == "" ){
   throw new Exception("CHARSET_INFORMATION_MISSING");
  }
  var os = unicodeConverter.ConvertFromUnicode(s) + unicodeConverter.Finish();
  
  write(os);
 }
}
