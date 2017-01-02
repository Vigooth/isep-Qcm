import {Mongo} from 'meteor/mongo';
export const Qcms=new Mongo.Collection('qcms');
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
    saveAuthorizeUser:function(qcm_id,email){
        console.log(!Qcms.findOne({'user_authorize':email}));
        if(!Qcms.findOne({'user_authorize':email})){
            Qcms.update({_id:qcm_id},{$push:{user_authorize:email}});
        }
    },
    startQcm:function(qcm_id){
        Qcms.update({_id:qcm_id},{$set:{status:'open',beginAt:new Date()}})

    },
    removeQcm:function(id){
        Qcms.remove({_id:id});
        Meteor.call('removeQuestion',{question_id:id}, (err, res) => {
            if (err) {
                return(err);
            }})
    }
})
SyncedCron.add({

    name: 'Crunch some important numbers for the marketing department',
    schedule: function(parser) {
        var a=parser.text('every 5 sec');
        // fires on the 2nd minute every hour
        // parser is a later.parse object
        return parser.recur().every(5).second();
    },
    job: function() {
        var currentDatee = moment().add(1,'minutes');
        var currentDate = moment();

        var qcms_open = Qcms.find({type:'classroom',status: 'open'}).fetch();
        var nb_qcms_open = Qcms.find({type:'classroom',status: 'open'}).count();
        console.log(nb_qcms_open)
        for (var j = 0; j < nb_qcms_open; j++) {
            var duration=qcms_open[j].settings.duration*60;
            var totalPeriod = Math.round((currentDate - qcms_open[j].beginAt) / 1000);
            if(totalPeriod>duration){
                console.log("PLUS GRAND")
                Qcms.update({_id: qcms_open[j]._id},{$set:{status:'close'}})
                qcms_open[j].status='close';
            }
console.log(totalPeriod)
        
           
        }


        console.log("TIMER : " +currentDate)
        return true;
    }
});
//SyncedCron.start();