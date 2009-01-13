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

var FireDictionary = FireDictionary || {};

(function(){
  this.DBConn = function(dir_name, file){
    this.storageService = Components.classes["@mozilla.org/storage/service;1"]
			   .getService(Components.interfaces.mozIStorageService);
    
    if ( !dir_name ) dir_name = "ProfD";

    this.dir = new FDDirectory(dir_name);
    this.file = this.dir.createFileInstance(file).getFile();
    this.conn = this.storageService.openDatabase(this.file);
    this.statements = {};
  };

  this.DBConn.prototype = {
    /**
     * execute(sql[, label])
     *   execute the sql statement.
     *   if the label is specified, the statement is saved with the 
     *   label for later use.
     * 
     * @param sql sql statement
     * @param name of the statement (optional)
     */
    execute: function(sql, label){
      var stmt = this.conn.createStatement(sql);
      stmt.execute();
      if (label){
	this.statements[label] = stmt;
      }
    },
   
    /**
     * executeStep(sql, func[, label])
     *   execute the sql statement and call the function for each result
     *   row with the statement object as the function's parameter.
     *   if the label is specified, the statement is saved with the 
     *   label for later use.
     * 
     * @param sql sql statement
     * @param func call back function called for the each row.
     * @param name of the statement (optional)
     */
    executeStep: function(sql, func, label){
      var stmt = this.conn.createStatement(sql);
     
      try{
	while(stmt.executeStep()){
	  func(stmt);
	}
      } catch(e) {
	if(console){
	  console.log(e.description);
	  
	} else {
	  alert(e.description);
	  
	}
      } finally {
	stmt.reset();
	
	if (label){
	  this.statements[label] = stmt;
	}

      }
    },
    
    executeLabeled: function(label){
      if(this.statements[label]){
	this.statements[label].execute();
      }
    },
    
    executeLabeledStep: function(label, func){
      if(this.statements[label]){
	try{
	  while(this.statements[label].executeStep()){
	    func(this.statements[label]);
	  }
	} catch(e) {
	  if(console){
	    console.log(e.description);
	  
	  } else {
	    alert(e.description);
	  
	  }
	} finally {
	  this.statements[label].reset();
	}
      }
    }
  };
}).apply(FireDictionary);