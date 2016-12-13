import {Mongo} from 'meteor/mongo';
export const Qcms=new Mongo.Collection('qcms');
Meteor.methods({
    insertQcm:function(doc){
        Qcms.insert(doc);
    },
    updateOption:function(qcm_id,number,penalty,bonus){
        Qcms.update({_id:qcm_id},{$set:{numberOfExamQuestions:number,penalty:penalty,bonus:bonus}})
    },
    removeQcm:function(id){
        Qcms.remove({_id:id});
        Meteor.call('removeQuestion',{question_id:id}, (err, res) => {
            if (err) {
                return(err);
            }})
    }
})