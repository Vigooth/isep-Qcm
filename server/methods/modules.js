import {Meteor} from 'meteor/meteor';
import {Modules} from '../../imports/api/modules';
Meteor.methods({
    insertModule:function(doc){
        Modules.insert(doc);
    },
    removeModule:function(id){
        Modules.remove(id);
    },
    updateModuleTag:function(id,text){
        Modules.update({_id:id},{$set:{tag:text}});
    },
    updateModuleText:function(id,text){
        Modules.update({_id:id},{$set:{text:text}});
    }
})