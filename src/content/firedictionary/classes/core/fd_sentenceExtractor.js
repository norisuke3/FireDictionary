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
 * A class for a function to extract both a sentence and a word
 * from mouse click event object.
 */
function FDSentenceExtractor(event){
	
	// define a test for non-space characters
	var gREWord = /\S/;
	
	// define range to test for CJK (chinese/japanese/korean) characters
	var gRECJK = /[\u2E80-\uFE4F]/;
	
	// define ranges for punctuation characters to be excluded from words
	// this should be everything except hyphens/dashes
	var gREPunct = /[\u0020-\u002c\u002e-\u002f\u003a-\u0040\u005b-\u0060\u007b-\u007e\u2000-\u200f\u2015-\u206f\u3000-\u303f\ufe30-\ufe4f\ufe50-\ufe6b\uff01-\uff0f\uff1a-\uff20\uff3b-\uff40\uff5b-\uff65\uffe0-\uffee]/;
	
	var mKeyword = "";
	var mSentence = "";
	
	getWordFromEvent(event);
	 
	//
	// Public functions  ///////////////////////////////////////////////////////
	//
	
	/**
	 * String getKeyword()
	 * 
	 * @return a keyword extracted from the event
	 */
	this.getKeyword = function(){
		return mKeyword;
	}
	
	/**
	 * String getSentence(){
	 * 
	 * @return a sentence extracted from the event
	 */
	this.getSentence = function(){
		return mSentence;
	}
	 
	//
	// Private functions  ///////////////////////////////////////////////////////
	//
	
	/**
	 * getWordFromEvent(Event event)
	 *  Extract a keyword from mouse over event.
	 * 
	 * Usage :
	 * 		var resultArray = getWordFromEvent(event);
	 * 		var keyword = resultArray[0];		// String keyword
	 * 		var sentence = resultArray[1];		// String sentence
	 * 
	 * @param event
	 */
	function getWordFromEvent(event){
		var parent = event.rangeParent;
		var offset = event.rangeOffset;
		var range;
		var str = "";
		var offsets = new Offsets(offset, offset + 1);
		var REWord = /[A-Z]/;
		
		if (parent == null || parent.nodeType != Node.TEXT_NODE)
			return;
		
		range = parent.ownerDocument.createRange();
		range.selectNode(parent);
		str = range.toString();
		
		if(offset < 0 || offset >= str.length)
			return;
		
		if(!gREWord.test(str.charAt(offsets.start)) || gREPunct.test(str.charAt(offsets.start)))
			return;
		
		// determine a offsets for the keyword.
		if(gRECJK.test(str.charAt(offsets.start))) {
			offsets = getEasternAsiaKeywordOffsets(str, offsets);
		
		} else {
			offsets = getWesternKeywordOffsets(str, offsets);
		}
		
		mKeyword = str.substring(offsets.start, offsets.end);
		
		// Extract sentence which contains the kyeword.
		while(offsets.start > 0 && 
			!(
				str.charAt(offsets.start - 1) == "." &&
				str.charAt(offsets.start) == " " &&
				REWord.test(str.charAt(offsets.start + 1))
			)
		)
		offsets.start--;
		
		while(offsets.end < str.length &&
			!(
				str.charAt(offsets.end) == "." &&
				str.charAt(offsets.end + 1) == " " &&
				REWord.test(str.charAt(offsets.end + 2))
			)
		)
		offsets.end++;
		
		
		while(str.charAt(offsets.end - 1) == " ") offsets.end--;
		
		mSentence = str.substring(offsets.start, offsets.end);
	}
	
	/**
	 * Offsets getEasternAsiaKeywordOffsets(String str, Offsets offsets)
	 *  Determine offsets for East Asian Keyword from context sentence.
	 *  CJK characters are not normally separated by spaces, so just take
	 *  a fixed number of characters up until the next space or non CJK char 
	 *  Extract up to 3 more characters beyond the current
	 *  This should be enough for most compounds in Chinese
	 *
	 * @param str context sentence
	 * @param offsets start offsets
	 * @return result offsets for Eastern Asian keyword.
	 */
	function getEasternAsiaKeywordOffsets(str, offsets){
		var result = new Offsets(offsets.start, offsets.end);
		var cnt = 0;
		
		while(cnt < 3 &&
			   result.end < str.length &&
			   gRECJK.test(str.charAt(result.end)) &&
			   gREWord.test(str.charAt(result.end)) &&
			   !gREPunct.test(str.charAt(result.end))
		){
			result.end++;
			cnt++;
		}
		 
		return result;
	}
	
	/**
	 * Offsets getWesternKeywordOffsets(String str, Offsets offsets)
	 *  Determine offsets for Western Keyword from  context sentence.
	 *
	 * @param str context sentence
	 * @param offsets start offsets
	 * @return result offsets for Western keyword.
	 */
	function getWesternKeywordOffsets(str, offsets){
		var result = new Offsets(offsets.start, offsets.end);
		
		while(result.start > 0 &&
			   !gRECJK.test(str.charAt(result.start - 1)) &&
			   gREWord.test(str.charAt(result.start - 1)) &&
			   !gREPunct.test(str.charAt(result.start - 1))
		) result.start--;
		
		while(result.end < str.length &&
			   !gRECJK.test(str.charAt(result.end)) &&
			   gREWord.test(str.charAt(result.end)) &&
			   !gREPunct.test(str.charAt(result.end))
		) result.end++;
		 
		return result;
	}
	
	//
	// Inner class  /////////////////////////////////////////////////////////
	//
	 
	/**
	 * Class Offsets
	 */
	function Offsets(start_, end_){
		this.start = start_;
		this.end = end_;
		
		this.toString = function(){
			return this.start + "," + this.end;
		}
	}
}