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
   var keywords = new Array();
   
  /**
   * initialize()
   *   initialize a page of iKnow! My List Manager
   */
  this.initialize = function(){
    // initializing the User Name text box and the My List drop down box.
    var prefs = new FDPrefs();
    if (prefs.getCharPref("iKnow-username")){
      $('username').value = prefs.getCharPref("iKnow-username");
      this.getMyList();
    }
     
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
	  <div id={item.hs::timestamp.toString()} class="history_option"></div>
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
      
      // preparing keyword information
      keywords.push({
	keyword: item.hs::keyword.toString(),
	id     : item.hs::timestamp.toString(),
	element: $(item.hs::timestamp.toString())
      });
    }
  };

  /**
   * getMyList()
   *   get a list of the user whose name, and populate the My List drop down box.
   */
  this.getMyList = function(){
    if ( $F('username') == "" ) { return; }
    
    var prefs = new FDPrefs();
    $('ind-loading').show();
    var param = {
      created_by: $F('username')
    };
    
    prefs.setCharPref("iKnow-username", $F('username'));
    
    // get lists by a user name.
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

  /**
   * getItemsInList()
   *   get items in the selected list. Then, show them for each keyword in the page.
   */
  this.getItemsInList = function(){
    if ( $F('iknow_my-list') == "" ) { return; }

    keywords.each(function(k){
      $(k.id).update('<img src="chrome://firedictionary/skin/loading_16.png"/>');
    });
    
    // get items in a list.
    new Ajax.Request(
      'http://api.iknow.co.jp/lists/' + $F('iknow_my-list') + '/items.json',
      { method: 'get',
      onSuccess: function(transport){
	keywords.each(function(k){
	  showItems(k);
	});
      },
      onFailure: function(transport){
    
      },
      onException: function(transport, ex){
    
      }
    })
  };
   
  /**
   * selectItem()
   *   specify an id of selected item to a keyword with the keywordId in an array keywords.
   * 
   * @param keywordId an id of the keyword, actually it's a timestamp of the keyword.
   * @param itemId an id of the item in the iKnow item bank.
   */
  this.selectItem = function(keywordId, itemId){
    var keyword = keywords.find(function(k){
      return k.id == keywordId;
    });
    
    keyword.itemId = itemId;
  };

   /**
    * submitItems()
    *   submit the selected items to the iKnow! server.
    */
   this.submitItems = function(){
     console.log('submitItems is called.');
     keywords.findAll(function(k){ return k.itemId;})
             .each(function(k){
   
       var params = {
	 id: k.itemId,
	 api_key: "gs3rzbq2n5e9pgt6nuq5shvp"
       };

       var reqHeaders = { 
	 Authorization: ' Basic '+ base64encode($('username').value + ':' + $('password').value) 
       };

       // submit the selected items to register them to the iKnow server.
       new Ajax.Request(
         'http://api.iknow.co.jp/lists/' + $F('iknow_my-list') + '/items',
         { method: 'post',
	   parameters: params,
	   requestHeaders: reqHeaders,
         onSuccess: function(transport){
           console.log(transport.responseText);
         },
         onFailure: function(transport){
	   console.log('failed');
           console.log(transport.responseText);
         },
         onException: function(transport, ex){
	   console.log(ex.message);
           console.log(transport.responseText);
         }
       })
       
     });
   };
  
  //
  ///////  provate functions /////////////////////////////////////////////
  //
  
  function isRegistered(){
    return false;
  }
  
  function checkDeleted(){
    return false;
  }
   
  function checkAlreadyPresent(){
    return false;
  }
   
  function showItems(kInfo){
    // get items matching to the keyword.
    new Ajax.Request(
      'http://api.iknow.co.jp/items/matching/' + kInfo.keyword + '.json',
      { method: 'get',
      onSuccess: function(transport){
	$(kInfo.id).update('');
	$(kInfo.id).insert(createIKnowHTML(transport.responseText, kInfo.id));
      },
      onFailure: function(transport){
    
      },
      onException: function(transport, ex){
    
      }
    })
  };
   
  function showAllSet(){
     
  };
     
  function showDeleted(){
     // TODO
    showItems();
  };

  /**
   * createIKnowHTML(json, kid)
   *   Creating an html from the json for iKnow panel.
   * 
   * @param json text formated as json of an API http://api.iknow.co.jp/items/matching/
   * @param kid an id identifying the keyrowd, actually it's a timestamp of the keyword.
   * @return html string 
   */
  function createIKnowHTML(json, kid){
    var html = '';
    var rowType = ['odd', 'even'];
    var row = 0;
    var matchingResults = json.evalJSON(true);
      
    if (matchingResults.length == 0) {
      html = html + '<div class="empty_match_result">This item doesn\'t exist yet in the iKnow! item bank.';
    } else {
      html = html + '<div id="item_lookup_results"><ul id="rich_item_list">';
      html = html + matchingResults.collect(function(item){
	var li = '<div class="iknow_item">';
	li = li + '<li class = "' + rowType[row++ % 2] + ' rich_item">';
	li = li + '<input type="radio" class="radio_item" name="' + kid + '" value="' + item.id + 
			      '" onClick="iKnowMyListManager.selectItem(' + kid + ', ' + item.id + ');"/>';
	li = li + '<a target="_blank" onclick="" class="item_link" href="http://www.iknow.co.jp/items/' + item.id + '">';
	li = li + '<span lang="en" xml:lang="en" class="cue_text en">' + item.cue.text + '</span>';
	li = li + '</a>';
	li = li + '<div class="item_bank_row">';
	li = li + '  <span class="pos">(' + item.cue.part_of_speech + ')</span>';
      //    responsees の要素は常に一つ？
	li = li + '  <span class="response">' + item.responses[0].text + '</span>';
	li = li + '</div>';
	li = li + '</li>';
	li = li + '</div>';
	return li;
      }).join('\n');

      html = html + '<div class="iknow_item_end"/></ul>';
    }
    html = html + "</div>";
    
    return html;
  };
   
  /**
   * populateMyList(json)
   *   populate the My List drop down box.
   * 
   * @param json string containing a list iniformation in json format
   */
  function populateMyList(json) {
    var mylist = json.evalJSON(true);
    
    $('iknow_my-list').update('<option value="">--- My List ---</option>');
    
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
