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
 
function FDInputStream(file){
 var stream = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
 var seekable = stream.QueryInterface(Components.interfaces.nsISeekableStream);
 var scriptable = Components.classes['@mozilla.org/scriptableinputstream;1'].createInstance(Components.interfaces.nsIScriptableInputStream);
	var filesize;
	var unicodeConverter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
	
	/**
	 * FDInputStream(nsIFile file)
	 *  Constructor of this class
	 *
	 * @param file
	 */
 stream.init(file, 1, 0, 0);
 scriptable.init(stream);
 filesize = file.fileSize;
	
	/**
	 * setCharset(String charset)
	 *  set a character set for the file which is given as a attribute of this constructor.
	 *
	 * @param charset This is used for both of the method readLineAsUnicode() and the
	 *                method readAsUnicode().
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
  * Char* readLine();
  *  read line.
  * 
  * ** NOTICE **
  * This method assume new line code is "\r\n".
  *
  * @return A line of the string.
  */
	this.readLine = function(){	 
	 var line = "";
	 var c = "";
	 
	 c = scriptable.read(1);
	 
	 while(c != "\r" && scriptable.available() > 0){
	  line += c;
	  c = scriptable.read(1);
	 }
	 
	 // skip '\n'
	 c = scriptable.read(1);
	 
	 return line;
	}
	
	/**
	 * String readLineAsUnicode()
	 *  read line and convert them to Unicode.
	 *  You have to set the property 'charset' using the method setCharset()
	 *  before calling this method.
  * 
  * ** NOTICE **
  * This method assume new line code is "\r\n".
  *
  * @return A line of a unicode string.
	 * @throws CHARSET_INFORMATION_MISSING if the property 'charset' is empty.
  */
	this.readLineAsUnicode = function(){
		if ( this.getCharset() == "" ){
		 throw new Exception("CHARSET_INFORMATION_MISSING");
		}
		
		return unicodeConverter.ConvertToUnicode(this.readLine());
	}
	
	/**
	 * Char* read()
	 *  read whole content of the file.
	 *
	 * @return A string of the file.
	 */
	this.read = function(){
		this.setOffset(0);
		return scriptable.read(filesize);
	}
	
	/**
	 * String readAsUnicode()
	 *  read whole content of the file as Unicode.
	 *  You have to set the property 'charset' using the method setCharset()
	 *  before calling this method.
	 * 
	 * @param  charset Character set of the content.
	 * @return A unicode string of the file.
	 * @throws CHARSET_INFORMATION_MISSING if the property 'charset' is empty.
	 */
	this.readAsUnicode = function(){
		if ( this.getCharset() == "" ){
		 throw new Exception("CHARSET_INFORMATION_MISSING");
		}
		
		return unicodeConverter.ConvertToUnicode(this.read());
	}
	
	/**
 	* available()
 	*
	 * @return The number of bytes currently available in the stream
	 */
	this.available = function(){
		return scriptable.available();
	}
	
	/**
	 * setOffset(PRInt32 whence, PRInt32 offset)
	 *  This method moves the stream offset of the steam. This method is wrapper method of
	 *  nsISeekableStream#seek().
	 *
	 *  whence:
	 *   NS_SEEK_SET 	= 0
  *  	NS_SEEK_CUR 	= 1
  *  	NS_SEEK_END 	= 2
	 *
	 * @param whence specifies how to interpret the 'offset' parameter in setting the stream
	 *               offset associated with the implementing stream.
	 * @param offset specifies a value, in bytes, that is used in conjunction with the 'whence'
	 *               parameter to set the stream offset of the implementing stream. A negative
	 *               value causes seeking in the reverse direction.
	 */
	this.setOffset = function(whence, offset){
		seekable.seek(whence, offset);
	}
	
	/**
	 * getOffset()
	 *  This method reports the current offset, in bytes, from the start of the stream. 
	 *  This method is wrapper method ofnsISeekableStream#tell().
	 *
	 * @return offset.
	 */
	this.getOffset = function(){
		return seekable.tell();
	}
}