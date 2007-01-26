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
 * A class for a content which is pasted on paste board
 */
function FDPasteBoard(){
	var unicodeConverter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
	var sidebar = top.document.getElementById("sidebar");
 unicodeConverter.charset = "UTF-8";
 
	/**
	 * String getContentAsHtml()
	 *
	 * @return a pasted content which is formated as a html.
	 */
	this.getContentAsHtml = function(){
		var title = unicodeConverter.ConvertFromUnicode(this.getTitle())
					+ unicodeConverter.Finish();
		var content = unicodeConverter.ConvertFromUnicode(this.getContent().replace(/\n/g, "<br>\n")) +
					   unicodeConverter.Finish();
		var result;
		
		result = "<html><head><meta http-equiv='content-type' content='text/html; charset=UTF-8' /><title>" + title +
	          "</title></head><body>" +
	          "<table width='530' border='0'>" +
           "<tr>" +
							    "<td width='100'>&nbsp;</td>" +
							    "<td><p><font size='+1' face='Arial, Helvetica, sans-serif'><strong>" + title + "</strong></font></p>" +
							    "<p><font size='-1' face='Arial, Helvetica, sans-serif'>" + content + "</font></p>" +
							    "</td>" +
							    "</tr>" +
							    "</table>" +
	          "</body></html>";
		return result;
	}
	
	/**
	 * String getPasteBoardContent()
	 *
	 * @return a content text in the Paste Board.
	 */
	this.getContent = function(){
		return escapeText(getPasteBoardTextbox().value);
	}
	
	/**
	 * String getPasteBoardTitle()
	 *
	 * @return a title the Paste Board.
	 */
	this.getTitle = function(){
		 return escapeText(getPasteBoardTitleTextbox().value);
	}
	
	//
 // Private method ///////////////////////////////////////////////////////
 //
 function getPasteBoardTextbox(){
 	return sidebar.contentDocument.getElementById("dictionary-pasteboard-textbox");
 }
 
 function getPasteBoardTitleTextbox(){
 	return sidebar.contentDocument.getElementById("dictionary-pasteboard-title");
 }
 
 /**
  * String escapeText(String text)
  *   Change the following characters to escape
  *     &  ->  &amp;
  *     <  ->  &lt;
  *     >  ->  &gt;
  *     "  ->  &quot;
  *     '  ->  &#39;
  */
 function escapeText(text){
	text = text.replace(/&/g, "&amp;");
	text = text.replace(/</g, "&lt;");
	text = text.replace(/>/g, "&gt;");
	text = text.replace(/"/g, "&quot;");
	text = text.replace(/'/g, "&#39;");
	
	return text
 }
}