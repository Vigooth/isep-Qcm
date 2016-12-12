import {Meteor} from 'meteor/meteor';
import {Stats} from '../../imports/api/stats';

Meteor.methods({
    insertStats:function(doc){
        Stats.insert(doc)
    },
    removeStats:function(id){
        Stats.remove(id);
    },
    //Switch the status from boolean to !boolean
    setStatsStatus:function(answer_id,answer_status){
        Stats.update({_id:answer_id},{$set:{status:!answer_status}})
    }

});