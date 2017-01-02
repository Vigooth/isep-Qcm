import {Meteor} from 'meteor/meteor';
import {Stats} from '../../imports/api/stats';

Meteor.methods({
    insertStat:function(doc){
        if(!Stats.findOne({qcm_id:doc.qcm_id,status:doc.status})){
            Stats.insert(doc)

        }
    },
    removeStat:function(id){
        Stats.remove(id);
    },
    closeStatsStatus:function(qcm_id){
        Stats.update({qcm_id:qcm_id,status:'open'},{$set:{status:'close'}})
    },
    updateStat:function(qcm_id,questions,numberOfQuestions){
        //Stats.update({qcm_id:qcm_id,status:'open'},{$set:questions})
        var stats=Stats.findOne({qcm_id:qcm_id,status:'open'});
        var nb_success=stats.nb_success;
        var total=stats.total;
        for(var id in questions){
            var question_false=0;
            var questionIsTrue=questions[id];
            if(!stats[id]){Stats.update({qcm_id:qcm_id,status:'open'},{$set:{[id]:{nb_success:0,total:0}}});
                console.log("OK YA PAS ENCORE DID")}
            console.log("MONTRE S")
            console.log(questions[id])
            if(questionIsTrue){
                question_false=1
            }
            stats=Stats.findOne({qcm_id:qcm_id,status:'open'});
            console.log(stats)
            console.log(stats[id].nb_success)

            stats[id].nb_success+=question_false;
            console.log(stats[id].nb_success)
            stats[id].total++;
            Stats.update({qcm_id:qcm_id,status:'open'},{$set:{[id]:{nb_success:stats[id].nb_success,total:stats[id].total}}})

        }
    }

});
function updateStat(qcm_id,success) {
    var stats=Stats.update({qcm_id:qcm_id,status:'open'},{$set:{}});
    (stats.nb_success+success)/(stats.total+1)
}