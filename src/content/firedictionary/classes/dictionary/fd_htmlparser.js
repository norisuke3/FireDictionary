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
 * A class for html parser.
 */
function FDHtmlParser(){
 /**
  * FDHtmlParser()
  *  Constructor of this class. Just initialize private values.
  */
	var entityConverter = Components.classes["@mozilla.org/intl/entityconverter;1"].createInstance(Components.interfaces.nsIEntityConverter);
	var entityVersion = Components.interfaces.nsIEntityConverter.entityW3C;
 var mREWord = new RegExp('([a-z]|[A-Z]|[0-9]|-)+ ?', "m");
	
	// element flags.
 var mHead;
 var mScript;
 var mNoscript;
	
 /**
  * String getContent(HTMLElement element)
  *  Parse HTML Content.
  *
  * @param element
  * @return parsed html content whose text is separated with <span> tag.
  */
 this.getContent = function(element)
 {
	 if (element.localName)
 	 var elmName = element.localName.toLowerCase();
	 
	 // Control the element flags.
  if ( elmName == "head" ) mHead = true;
  if ( elmName == "script" ) mScript = true;
  if ( elmName == "noscript" ) mNoscript = true;
    
	 var s = this.parse(element);
   
  if ( elmName == "head" ) mHead = false;
  if ( elmName == "script" ) mScript = false;
  if ( elmName == "noscript" ) mNoscript = false;
  
  return s
 }
  
 /**
  * String parse(HTMLElement element)
  *  Parse HTML Text with <span>.
  *
  * @param element
  * @return parsed html content whose text is separated with <span> tag.
  */
 this.parse = function(element)
 {
   if (!element) return "";
   
   // Initialize
   var s = "";   
    
   // ELEMENT_NODE
   if (element.nodeType == Node.ELEMENT_NODE) {
     var line = "";
      
   	 if ( element.localName.toLowerCase() == "br" ){
	    	 // Only for <br> tag.
   	 	 s += "<BR/>";
    	 	 
   	 } else {
   	 	 // Other tags - Begin Tag
       line += "<" + element.localName;

       var attrIndent = "";
       for (var i = 0; i < line.length; ++i)
         attrIndent += " ";
  
       for (i = 0; i < element.attributes.length; ++i) {
         var a = element.attributes[i];
         var attr = " " + a.localName + '="' + escape(a.nodeValue) + '"';
         if (line.length + attr.length > 80) {
           s += line + (i < element.attributes.length-1 ? "\n"+attrIndent : "");
           line = "";
         }
        
         line += attr;
       }
       s += line + ">";
        
       for (i = 0; i < element.childNodes.length; ++i)
         s += this.getContent(element.childNodes[i]);
       
   	 	 // Other tags - End Tag
       s += "</" + element.localName + ">";
   	 }
    
   // TEXT_NODE
   } else if (element.nodeType == Node.TEXT_NODE) {
   	 if( mHead || mScript || mNoscript ){
   	  s += element.data;
   	 } else {
   	  var texts = extractText(element.data);
   	  s += texts.toString()
   	 }
			 
		 // COMMENT_NODE
   } else if (element.nodeType == Node.COMMENT_NODE) {
     s += "<!--" + escape(element.data) + "-->\n";
   }
    
   return s;
 }
	
	//
 // Private method ///////////////////////////////////////////////////////
 //

 /**
  * FDTextNodeArray extractText(String s)
  *
  * @param s
  * @return the Array of each word which is contained in s.
  */
 function extractText(s){
 	var texts = new FDTextNodeArray();
 	var right = "";
 	var left = "";
 	var hit = "";
	
 	if(s.match(mREWord)){
 		right = RegExp.rightContext;
 		left = RegExp.leftContext;
 		hit = RegExp.lastMatch;
		
 		if(left != ""){
 			texts.push(escape(left), false);
 		}
		
 		texts.push(escape(hit), true);
				
 		if(right != ""){
 			texts = texts.concat(extractText(right));
 		}
 	} else {
 		texts.push(escape(s), false);
 	}
	
 	return texts;
 }

 /**
  * String escape(String s)
  *  escape chars which are the XML special character.
  *
  * @param s
  * @return
  */
 function escape(s)
 {
  s = s.replace(/&/g, "&amp;");
  s = s.replace(/</g, "&lt;");
  s = s.replace(/>/g, "&gt;");
  s = s.replace(/'/g, "&apos;");
  s = s.replace(/"/g, "&quot;");

  // replace chars > 0x7f via nsIEntityConverter
  s = s.replace(/[^\0-\u007f]/g, convertEntity);

  return s;
 
  function convertEntity(_str) {
   try {
    return entityConverter.ConvertToEntity(_str, entityVersion);
   } catch (ex) {
     return _str;
   }
  }
 }
}
