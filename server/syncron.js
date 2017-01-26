import {Qcms} from '/imports/api/qcms';

SyncedCron.add({

    name: 'A class test is open',
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
                Meteor.call('closeStatsStatus',qcms_open[j]._id);


            }
            console.log(totalPeriod)


        }


        console.log("TIMER : " +currentDate)
        return true;
    }
});
SyncedCron.start();