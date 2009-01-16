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
  
//////////// global variables /////////////////////

var FireDictionary = FireDictionary || {};

///////////////////////////////////////////////////

(function(){

 /**
  * xhr(String url, String content)
  *
  * A wrapper class for xmlHttpRequest.
  *
  * @param url
  * @parma content
  */
this.xhr = function(url, content){
  this.url = url;
  this.content = content;
  this.xmlHttpRequest = new XMLHttpRequest();
  this.callback = null;
  this.errorCallback = null;
}

this.xhr.prototype = {
  /**
   * setCallback(function func)
   * 
   * setter method of callback function
   */
  setCallback: function(func){
    this.callback = func; 
  },
  
  /**
   * setErrorCallback(function func)
   * 
   * setter method of error callback runction
   */
  setErrorCallback: function(func){
    this.errorCallback = func;	
  },
  
  /**
   * post()
   *
   * sends a http request with a post method asynchronously. callback function will called
   * when it recieves the response. 
   */
  post: function(){
    var self = this;
    this.xmlHttpRequest.onreadystatechange = function() {
      if ( self.xmlHttpRequest.readyState == 4 ){
	if ( self.xmlHttpRequest.status == 200 ){
	  if (self.callback != null) {
	    self.callback();
	  }
	} else {
	  if (self.errorCallback != null){
	    self.errorCallback();
	  }
	}
      }
    };
    this.xmlHttpRequest.open("POST", this.url, true);
    this.xmlHttpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    this.xmlHttpRequest.send(this.content);
    
    //debug.print(url, "xmlHttpRequest");
    //debug.print(content, "xmlHttpRequest");
  },
  
  /**
   * get()
   *
   * sends a http request as a get method asynchronously. callback function will called
   * when it recieves the response. 
   */
  get: function(){
    var self = this;
    this.xmlHttpRequest.onreadystatechange = function() {
      if ( self.xmlHttpRequest.readyState == 4 ){
	if ( self.xmlHttpRequest.status == 200 ){
	  if (self.callback != null) {
	    self.callback();
	  }
	} else {
	  if (self.errorCallback != null){
	    self.errorCallback();
	  }
	}
      }
    };
    
    this.xmlHttpRequest.open("GET", this.url, true);
    this.xmlHttpRequest.send(this.content);
  },

  /**
   * addParameter(String name, String value)
   *
   * add an url paremter. the value is encoded using encodeURIComponent()
   *
   * @param name	a name of the parameter.
   * @param vlaue a value of the parameter. This value is encoded by encodeURIComponent()
   */
  addParameter: function(name, value){
    if (this.content == null){
      this.lcontent = "";
    }
    
    if (this.content != "") {
      this.content += "&";
    }
    
    this.content += name + "=" + encodeURIComponent(value);
  },
  
  /**
   * String getResponseText()
   * 
   * @return returns the response as text
   */
  getResponseText: function(){
    return this.xmlHttpRequest.responseText;
  },
  
  /**
   * Document getResponseXML()
   * 
   * @return returns the response as DOM Document
   */
  getResponseXML: function(){
    return this.xmlHttpRequest.responseXML;
  }
};

}).apply(FireDictionary);
