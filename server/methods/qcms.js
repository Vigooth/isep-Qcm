import {Qcms} from '/imports/api/qcms';

import _ from 'lodash';

Meteor.methods({
    insertQcm:function(doc){
        Qcms.insert(doc);
    },
    updateOption:function(qcm_id,number,penalty,bonus){
        Qcms.update({_id:qcm_id},{$set:{numberOfExamQuestions:number,penalty:penalty,bonus:bonus}})
    },
    updateSettings:function(qcm_id,duration,password,numberQuestion){
        Qcms.update({_id:qcm_id},{$set:{settings:{duration:duration,password:password},questions:{number:numberQuestion}}})
    },
    qcm_setTitle:function(qcm_id,title){
        Qcms.update({_id:qcm_id},{$set:{text:title}})
    },
    saveAuthorizeUser:function(qcm_id,email){
        console.log(!Qcms.findOne({'user_authorize':email}));
        if(!Qcms.findOne({'user_authorize':email})){
            Qcms.update({_id:qcm_id},{$push:{user_authorize:email}});
        }
    },
    startQcm:function(qcm_id){
        var date= new Date();
        Qcms.update({_id:qcm_id},{$set:{status:'open',beginAt:date}});
        Meteor.call('insertStat',{qcm_id:qcm_id,createdAt:date,status:'open'})


    },
    removeQcm:function(id){
        Qcms.remove({_id:id});
        Meteor.call('removeQuestion',{question_id:id}, (err, res) => {
            if (err) {
                return(err);
            }})
    }
})
