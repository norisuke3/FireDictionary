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
   /**
    *  Scope variable keywords
    *    Hoding the following attributes of each keywords in the history.
    *    member of the array is reffered as a variable 'k' in this code.
    * 
    * @param keyword a keyword itself
    * @param id      a keyword id which is actually a timestamp of registerd time
    * @param itemId  an item id related to the keyword
    * @param status  taking either of the value 'initial', 'selected', 'registered' and 'failed'
    */
   var keywords = new Array();
   
   keywords.getStatus = function(){
     return '総単語数: ' + this.length + ', '  +
            '選択: '    + this.findAll(function(k){return k.status == "selected";  }).length + ', '  +
	    '登録済:   ' + this.findAll(function(k){return k.status == "registered";}).length + ', '  +
	    '失敗: '    + this.findAll(function(k){return k.status == "failed";    }).length;
   };
   
   keywords.updateStatus = function(){
     $('keyword-status').update(this.getStatus());
   };
   
   var conn = new FireDictionary.DBConn("ProfD/FireDictionary", "firedictionary.sqlite");
   
   // creating table RegisterInfo with an index (kId, listId)
   //   kId - keyword id
   //   listId - iknow list id
   //   itemId - iknow item id
   conn.execute('CREATE TABLE IF NOT EXISTS RegisterInfo (' + 
		    'kId    TEXT NOT NULL, ' + 
		    'listId TEXT NOT NULL, ' + 
		    'itemId TEXT NOT NULL)');
   
   conn.execute('CREATE INDEX IF NOT EXISTS keyRegisterInfo ON RegisterInfo (kId, listId)');

   
   // initialize e4x object of history.xml
   var urlHistory = new FDDirectory("ProfD/FireDictionary").createFileInstance("history.xml").getURL();
   var xml = new XML(getXMLDocument(urlHistory));
   var hs = new Namespace('http://www.firedictionary.com/history');
    

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
    $('submit-items').disabled = true;
    
    // main initialization
    for each (var item in xml..hs::item){
      var temp = new Element('temp');
      
      temp.insert(
	<div class="history_item">
	  <div class="history_main">
	    <div class="keyword">{ item.hs::keyword.toString() }<div class="keyword_ind"> </div></div>
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
      
      var elmSentence = $(temp).down('div[class=sentence]');
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
    if ( $F('username') == "" ) { return; }
    
    var prefs = new FDPrefs();
    $('ind-loading').show();
    var param = {
      created_by: $F('username')
    };
    
    prefs.setCharPref("iKnow-username", $F('username'));
    
    // get lists by a user name.
    new Ajax.Request(
      'http://api.iknow.co.jp/lists.json?' + Object.toQueryString(param) , {  // getMyList (Ajax call)
	method: 'get',
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

    // initialize keywords Object
    keywords.clear();
    
    for each (var item in xml..hs::item){
      // preparing keyword information
      keywords.push({
	keyword: item.hs::keyword.toString(),
	id     : item.hs::timestamp.toString(),
	status : "initial"
      });
    }
    
    keywords.updateStatus();
    
    keywords.each(function(k){
      $(k.id).update('<img src="chrome://firedictionary/skin/loading_16.png"/>');
    });

    // get items in a list.
    new Ajax.Request(
      'http://api.iknow.co.jp/lists/' + $F('iknow_my-list') + '/items.json', {// getItemsInList (Ajax call)
	method: 'get',
	onSuccess: function(transport){
	  keywords.each(function(k){
	    if( isRegistered(k) ) {
	      if ( isDeleted(k, transport.responseText) ){
		showDeleted(k);
	      } else {
		showAllSet(k);
	      }
	    } else {
	      var items = transport.responseText.evalJSON(true);
	      
	      showItems(k, items.pluck("id"));
	    }
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
    var k = keywords.find(function(k){ return k.id == keywordId; });

    k.itemId = itemId;	    
    k.status = 'selected';
    keywords.updateStatus();
  };

   /**
    * submitItems()
    *   submit the selected items to the iKnow! server.
    */
   this.submitItems = function(){
     var timer = 0;
     
     if(keywords.any(function(k){ return k.status == "selected"; })){
       $('submit-items').disabled = true;
     }
     
     keywords.findAll(function(k){ return k.status == "selected";})
             .each(function(k){
       (function(){                // This anonymous function is for calling delay().
         // submit the selected items to register them to the iKnow server.
         new Ajax.Request(
           'http://api.iknow.co.jp/lists/' + $F('iknow_my-list') + '/items', {  // submit Items (Ajax call)
	     method: 'post',
	     parameters: {
	       id: k.itemId,
	       api_key: "gs3rzbq2n5e9pgt6nuq5shvp"
	     },
	     requestHeaders: {
	       Authorization: ' Basic '+ base64encode($('username').value + ':' + $('password').value) 
	     },
             onSuccess: function(transport){
	       $(k.id).update('<div class="msg_green">登録されました。</div>');

	       $(k.id).up('div[class=history_item]')
		      .down('div[class=keyword_ind]')
		      .update('<div class="image"><img src="chrome://firedictionary/skin/adding_completed.png"/></div>' + 
			      '<div class="keyword_ind_msg"><a href="http://www.iknow.co.jp/items/' + 
			      k.itemId + '" target="_blank">登録済み</a></div>');

	       k.status = 'registered';
	       keywords.updateStatus();
	       
	       if( keywords.all(function(k){ return k.status != 'selected'; }) ){
		 $('submit-items').disabled = false;
	       }
	       
	       conn.execute(
		 'INSERT INTO RegisterInfo (kId, listId, itemId) VALUES (' + 
		   k.id + ', ' + 
		   $F('iknow_my-list') + ', ' + 
		   k.itemId + '  )');
             },
             onFailure: function(transport){
	       $(k.id).update('<div class="msg_red">failed: ' + transport.responseText + '</div>');
	       k.status = 'failed';
	       keywords.updateStatus();
             },
             onException: function(transport, ex){
	       $(k.id).update('<div class="msg_red">failed: ' + transport.responseText + '</div>');
	       k.status = 'failed';
	       keywords.updateStatus();
             }
	   })
	  
	}).delay(timer += 0.6);  // The anonymous function end.
     });
   };
  
  /**
   * enableSubmit()
   *   change an enability of the send submit button.
   *   if the password input box is not empty, the submit botton is enabled.
   */
  this.enableSubmit = function(){
    $('submit-items').disabled = ( $('password').value == '' );
  };
   
  /**
   * filterRegistered()
   *   filters keyword registered out.
   */
  this.filterRegistered = function(){
    keywords.findAll(function(k){return k.status =='registered';})
            .collect(function(k){
	      return $(k.id).up('div[class=history_item]');
	    })
	    .invoke($('filter-registered').checked ? 'hide' : 'show');
  };
   
  /**
   * _showItems(kid)
   *   show items only for a keyword which used to have a error/notification message 
   *   rather than item list.
   */
  this._showItems = function(kid){
    var keyword = keywords.find(function(k){return k.id == kid;});
    
    showItems(keyword, []);
  };
   
  //
  ///////  provate functions /////////////////////////////////////////////
  //
  
  /**
   * isRegistered(k)
   *   checks if an item related to the keyword k has already been registered by this My List Manager.
   *   It doesn't matter at this point if an item has been registered at the iknow website.
   * 
   * @param k a keyword
   * @return true - if it's already been registered, otherwise false
   */
  function isRegistered(k){
    var result = false;

    conn.executeStep(
      'SELECT * from RegisterInfo WHERE kId = "' + k.id + '" AND listId = "' + $F('iknow_my-list') + '"', 
      function(stmt){
	result = true;
      });

    return result;
  }
  
  /**
   * isDeleted(k, json)
   *   checks if the registered item has been deleted at the iknow website.
   * 
   * @param k a keyword
   * @param json text formated as json of an API http://api.iknow.co.jp/lists/:listId/items.json
   * @return true - if it's deleted, otherwise false
   */
  function isDeleted(k, json){
    var items = json.evalJSON(true);
    var registered = getItemId(k);
    
    return !(items.any(function(item){ return item.id == registered; }));
  }
   
  /**
   * isAlreadyPresent(items, kitems)
   *   checks if any of items related to the keyword has not been registered.
   * 
   * @param items an array of all items already registered
   * @param kitems an array of all items related to the keyword.
   * @return true - if it's already present, otherwise false
   */
   function isAlreadyPresent(items, kitems){

     return items.any(function(id){ return kitems.include(id); });
  }
   
   /**
    * showItems(k, ItemIds)
    *   Shows items if any of items related to the keyword has not been registered.
    * 
    * @param k a keyword
    * @param ItemIds an array of items in the list 
    */
   function showItems(k, ItemIds){
    // get items matching to the keyword.
    new Ajax.Request(
      'http://api.iknow.co.jp/items/matching/' + k.keyword + '.json', {   // Matching a keyword (Ajax call)
	method: 'get',
	onSuccess: function(transport){
 	  var kitems = transport.responseText.evalJSON(true);
	  if ( isAlreadyPresent(ItemIds, kitems.pluck("id"))){
	    k.itemId = ItemIds.filter(function(i){return kitems.pluck("id").indexOf(i)!=-1;})[0];  // intersection
	    
	    conn.execute(
	      'INSERT INTO RegisterInfo (kId, listId, itemId) VALUES (' + 
		k.id + ', ' + 
		$F('iknow_my-list') + ', ' + 
		k.itemId + '  )');

	    showAllSet(k);
	    
	  } else {
	    $(k.id).update('');
	    $(k.id).insert(createIKnowHTML(transport.responseText, k.id));
	    
	    $(k.id).up('div[class=history_item]')
                   .down('div[class=keyword_ind]')
	           .update('');
	  }
	},
	onFailure: function(transport){
    
	},
	onException: function(transport, ex){
    
	}
      })
  };
   
  function showAllSet(k){
    $(k.id).update('');

    $(k.id).up('div[class=history_item]')
           .down('div[class=keyword_ind]')
	   .update('<div class="image"><img src="chrome://firedictionary/skin/adding_completed.png"/></div>' + 
		   '<div class="keyword_ind_msg"><a href="http://www.iknow.co.jp/items/' + 
		    getItemId(k) + '" target="_blank">登録済み</a></div>');
    
    k.status = 'registered';
    keywords.updateStatus();
  };
     
  function showDeleted(k){
    k.status = "initial";
    keywords.updateStatus();
    
    $(k.id).update('<div class="msg_yellow right-align">' + 
		   '<span style="float:left;">FireDictionary からは登録済みですが、iKnow サイト上で削除された可能性があります。</span>' + 
		   '<input type="submit" value="再登録" onClick="iKnowMyListManager._showItems(' + k.id + ')"/></div>');
    
    $(k.id).up('div[class=history_item]')
           .down('div[class=keyword_ind]')
	   .update('');

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
    * getItemId(kId, listId)
    *   database access wrapper
    */
   function getItemId(k){
    var itemId;
     
    conn.executeStep(
      'SELECT itemId from RegisterInfo WHERE kId = "' + k.id + '" AND listId = "' + $F('iknow_my-list') + '"', 
      function(stmt){
	itemId = stmt.getString(0);
      });
     
     return itemId;
   }
   
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
