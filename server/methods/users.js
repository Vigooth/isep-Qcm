
Meteor.methods({
    insertUsers:function(email,password,type){
        if(Accounts.findUserByEmail(email)){
            //Meteor.loginWithPassword(email, password);
            //console.log(Meteor.userId());
           // Meteor.users.update({_id:Meteor.userId()},{$set:{type:'prof'}})

        }
        else{
            Accounts.createUser({email:email,password:password,profile:{type:type,email:email}})
            console.log(Meteor.userId());
        }

        
    },
    'createAdmin':function(){
        Accounts.createUser({email:'admin@isep.fr',password:'admin',profile:{type:'admin',email:'admin@isep.fr'}})
    }
});
Meteor.publish("allUsers", function () {
    return Meteor.users.find({});
});

Meteor.users.allow({
    insert(userId, party) {
        return userId && party.owner === userId;
    },
    update(userId, party, fields, modifier) {
        return userId && party.owner === userId;
    },
    remove(userId, party) {
        return userId && party.owner === userId;
    }
});