import {Meteor} from 'meteor/meteor';
import {Answers} from '../../imports/api/answers';

Meteor.methods({
    insertAnswer:function(doc){
        Answers.insert(doc)
    },
    removeAnswer:function(id){
        Answers.remove(id);
    },
    //Switch the status from boolean to !boolean
    setAnswerStatus:function(answer_id,answer_status){
        Answers.update({_id:answer_id},{$set:{status:!answer_status}})
    },
    importAnswers:function(question_id,qcm_id){
        Answers.update({question_id:question_id},{$set:{qcm_id:qcm_id}},{ multi: true })

    }

});