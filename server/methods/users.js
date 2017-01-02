
Meteor.methods({
    insertUsers:function(email,password){
        if(Accounts.findUserByEmail(email)){
            //Meteor.loginWithPassword(email, password);
            console.log(Meteor.userId());
            Meteor.users.update({_id:Meteor.userId()},{$set:{type:'prof'}})

        }
        else{
            Accounts.createUser({email:email,password:password,profile:{type:"prof",email:email}})
            console.log(Meteor.userId());
        }

        
    },
   
    isMail:function(doc) {
        if(Accounts.findUserByEmail(doc)){console.log("OKOK")}
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