
import {Qcms}from '/imports/api/qcms';

 export var Prof= {
     "getQcms":function(id){return Qcms.findOne({_id:id})},
     "getMyQcms":function(mail){return Qcms.find({createdBy:mail}).fetch()}
    
 }
         