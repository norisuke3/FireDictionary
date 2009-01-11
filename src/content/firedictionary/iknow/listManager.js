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

var iKnowMyListManager = iKnowMyListManager || {};

(function(){
  this.initialize = function(){
    // visutal effects initialization
    $('ind-loading').hide();
    
    // main initialization
    var urlHistory = new FDDirectory("ProfD/FireDictionary").createFileInstance("history.xml").getURL();
    var xml = new XML(getXMLDocument(urlHistory));
    var hs = new Namespace('http://www.firedictionary.com/history');
    
    for each (var item in xml..hs::item){
      var temp = new Element('temp');
      
      temp.insert(
	<div class="history_item">
	  <div class="history_main">
	    <div class="keyword">{ item.hs::keyword.toString() }</div>
	    <div class="keyword_info">
	      <div class="result">{ item.hs::result.toString() }</div>
              <div class="sentence"> </div>
	      <div class="source">
	        <a href={ item.hs::url.toString() }>{ "---- " + item.hs::title.toString() }</a>
	      </div>
	    </div>
	  </div>
	  <div class="history_option"></div>
        </div>.toXMLString());
      
      var elmSentence = $A(temp.getElementsByTagName('div')).find(function(elm){
			  return elm.className == 'sentence';
			});
      var pickedupword = item.hs::pickedupword.toString();
      var sentence = item.hs::sentence.toString();
      
      if(elmSentence){
	$(elmSentence).insert(sentence.replace(pickedupword, '<span class="red">' + pickedupword + '</span>'));
      } 
      
      $('iknow_contents').insert(temp.firstChild);    
    }
  };

  /**
   * getMyList()
   *   get a list of the user whose name, and populate the My List drop down box.
   */
  this.getMyList = function(){
    $('ind-loading').show();
    var param = {
      created_by: $F('username')
    };
    
    $('iknow_my-list').update('<option value="">--- My List ---</option>');
    
    new Ajax.Request(
      'http://api.iknow.co.jp/lists.json?' + Object.toQueryString(param) ,
      { method: 'get',
      onSuccess: function(transport){
	populateMyList(transport.responseText);
	
        $('ind-loading').hide();
      },
      onFailure: function(transport){
    
      },
      onException: function(transport, ex){
    
      }
    })
  };

  this.getItemsInList = function(){
    if ( $F('iknow_my-list') == "" ) { return; }
    
    new Ajax.Request(
      'http://api.iknow.co.jp/lists/' + $F('iknow_my-list') + '/items.json',
      { method: 'get',
      onSuccess: function(transport){
        console.log(transport.responseText);
      },
      onFailure: function(transport){
    
      },
      onException: function(transport, ex){
    
      }
    })
  };
  
  function isRegistered(){
    return false;
  }
  
  function checkDeleted(){
    return false;
  }
   
  function checkAlreadyPresent(){
    return false;
  }
   
  function showItems(){
     
  };
   
  function showAllSet(){
     
  };
     
  function showDeleted(){
     // TODO
    showItems();
  };
   
  /**
   * populateMyList(json)
   *   populate the My List drop down box.
   * 
   * @param json string containing a list iniformation in json format
   */
  function populateMyList(json) {
    var mylist = json.evalJSON(true);
    
    mylist.each(function(list){
      $('iknow_my-list').insert('<option value="' + list.id + '">' + list.title + '</option>');
    });
    
    $('iknow_my-list').value = "";
  };

  /**
   * Document getXMLDocument(String url)
   *
   * @param url
   * @return XML string
   */
  function getXMLDocument(url){
    var xmlHttpRequest = new XMLHttpRequest();
  
    xmlHttpRequest.open("GET", url, false);
    xmlHttpRequest.send(null);

    return xmlHttpRequest.responseText;
  };
}).apply(iKnowMyListManager);
