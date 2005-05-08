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
 * Class for using PDIC Text type dictionary.
 */
function PDICText(file, charset){
	var indexFileName = "indexPDICText.txt";
	var istream;
	var indexes = new Array();
	var fileIndex;
	var indexCharLength = 3;
	
	/**
	 * PDICText(FDFile file)
	 *  Constructor of this class.
	 *  Set the dictionary file object.
	 *
	 * @param path full path name of a dictionary file you use.
	 * @throws FILE_MISSING_EXCEPTION when there is no file.
	 */
	if( !file.exists() ){
		throw new Exception("FILE_MISSING_EXCEPTION");
	}
	
	// Initialize input stream.
 istream = new FDInputStream(file.getFile());
 istream.setCharset(charset);
	
	// Initialize Index file.
	fileIndex = file.getParentDirectoryInstance().createFileInstance(indexFileName);
	
	/**
	 * String lookup(String keyword)
	 *  Look the mean of this keyword up in this dictionary.
	 *
	 * @param keyword A word you want to look up in this dictionary.
	 * @return A mean of the keyword.
	 * @throws INDEX_MISSING_EXCEPTION when there is no index.
	 */
	this.lookup = function(keyword){
		var indexChar;
		var index;
		var line;
		
		// In a case there is no index.
		if(indexes.length == 0){
			throw new Exception("INDEX_MISSING_EXCEPTION");
		}
		
		// In a case keyword missing.
		if( !keyword || keyword.length == 0 ){
			return "";
		}
		
		// Lookup an index.
		indexChar = keyword.substr(0, indexCharLength);
		index = indexes[indexChar];
		if( !index ){
			return "";
		}
		
		// Lookup a mean.
		istream.setOffset(0, index.from);
		while( istream.getOffset() < index.to ){
			line = istream.readLine();
			
			if( line == keyword ){
				return istream.readLineAsUnicode();
			}
			
			istream.readLine(); 						// skip Japanese line
		}
		
		return "";	 
	}
	
	/**
	 * String next()
	 * Return the next one to the word you've looked up.
	 */
	this.next = function(){
		return "";
	}
	
	/**
	 * createIndex()
	 *  Create indexes of this dictionary from index file or dictionary itself.
	 */
	this.createIndex = function(){
		if ( !fileIndex.exists() ){
			// Create index from dictionary itself.
			createIndexFromDictionary();
			
		} else {
			// Craete index from index file.
			createIndexFromIndexFile()
			
		}
	}
	
	//
 // Private method ///////////////////////////////////////////////////////
 //
 
 /**
  * createIndexFromIndexFile()
  *  Creaet index from index file.
  *
  * @throws INDEX_FILE_MISSING_EXCEPTION when there is no index file.
  */
 function createIndexFromIndexFile(){
 	if ( !fileIndex.exists() ) throw new Exception("INDEX_FILE_MISSING_EXCEPTION");
 	
 	var istream = new FDInputStream(fileIndex.getFile());
 	var s = istream.read();
 	
 	var _array = s.match(/([^;]+);/g);
 	
 	for( i = 0 ; i < _array.length ; i++){
 		_array[i].match(/(.+),([0-9]+),([0-9]+);/);
 		var item = new IndexItem();
 		
 		item.from = RegExp.$2;
 		item.to = RegExp.$3;
 		indexes[RegExp.$1] = item;
 		indexes.length++;
 	}
 }
	
	/**
	 * createIndexFromDictionary()
	 *  Create index from dictionary file. This method is very hevy, so if you have a
	 *  index file, you can create index from the index file. It's faster way. If you
	 *  don't have index file, you need to use this method.
	 *  This method also crate the index file in the directory which is same as the 
	 *  dictionary file.
	 */
	function createIndexFromDictionary(){
		var firstIndexChar = "A";
		var indexChar;
		var s = "";															// String for Index file content.
		
		findFirstOffset(firstIndexChar);
		
		while(istream.available() > 0){
 		var item = new IndexItem();    // IndexItem is a inner class of this class.
 		
 		item.from = istream.getOffset(); 		
			indexChar = findNextIndexOffset(item.from, indexCharLength);
			item.to = istream.getOffset();
			
			indexes[indexChar] = item;
			indexes.length++;
			
			s += indexChar + "," + item + ";"
		}
		
		// Create index file.
		fileIndex.write(s);
		
	}
 
 /**
  * private findFirstOffset(String firstIndexChar)
  *  Find a offset for the first index, and move the input stream to the offset.
  *
  * @param firstIndexChar A character you assume as the first index.
  */
 function findFirstOffset(firstIndexChar){
 	var offset = 0;
 	istream.setOffset(0, 0);
 	var line = istream.readLine();
 	
 	while( line.charAt(0) != firstIndexChar ){
 		offset = istream.getOffset();
 		line = istream.readLine();
 	}
 	
 	istream.setOffset(0, offset);
 }
 
 /**
  * private String findNextIndexOffset(int pos, int indexCharLength)
  *  Find next index offset, and move the input stream to the offset.
  *
  * @param pos start position to find in the file.
  * @return index character.
  */
 function findNextIndexOffset(pos, indexCharLength){
 	if ( !indexCharLength ) indexCharLength = 1;
 	var offset = pos;
 	istream.setOffset(0, pos);
 	var line = istream.readLine();
 	var indexKey = line.substr(0, indexCharLength);
 	istream.readLine() 						// skip Japanese line
 	
 	while(line.substr(0, indexCharLength) == indexKey ){
 		offset = istream.getOffset();
 		line = istream.readLine();
 		istream.readLine();  			// skip Japanese line
 	}
 	istream.setOffset(0, offset);
 	
 	return indexKey;
 }
 
	//
 // Inner class  /////////////////////////////////////////////////////////
 //
 
 /**
  * Class IndexItem
  */
 function IndexItem(){
 	this.from = 0;
 	this.to = 0;
 	
 	this.toString = function(){
 		return this.from + "," + this.to;
 	}
 }
}

//
// Singleton  ////////////////////////////////////////////////////////////
//
PDICText.instance = null;

/**
 * getInstance(FDFile file, String charset)
 * 
 * @return singleton object of PDICText which is initialized.
 */
PDICText.getInstance = function(file, charset) {
	try{
    if (PDICText.instance == null) {
        PDICText.instance = new PDICText(file, charset);
    }
    return this.instance;
    
	}catch(e){
		if ( e == "FILE_MISSING_EXCEPTION" ) {
 		alert("No dictionary file");
 		
 	}
	}
}