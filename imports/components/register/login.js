
import  angular from 'angular';
import { Accounts } from 'meteor/accounts-base';
import angularMeteor from 'angular-meteor';
import angularBoostrap from 'angular-ui-bootstrap';
import template from './login.html';

class LoginCtrl{
    constructor($scope,$reactive,$state){
        'ngInject';

        $scope.viewModel(this);
        $reactive(this).attach($scope);
        $scope.showRegister=false;
        Meteor.subscribe('allUsers');
        $scope.logout=function(){
            Meteor.logout()
        };
        $scope.register=function(){
            $scope.showRegister=true;
        };


        $scope.submit=function() {
            var username=this.user.name;
            var alreadyRegister=!!Meteor.users.findOne({'profile.email':username});
            if(alreadyRegister){
                Meteor.loginWithPassword(this.user.name, this.user.password);
            }else if(this.user.type){
                Meteor.call('insertUsers',this.user.name,this.user.password,this.user.type)
            }else{this.showRegister=true; }

            //
        };

    }
}

export default angular.module('login', [

    angularMeteor,angularBoostrap,'ui.bootstrap'

])
    .component('login',{
        templateUrl:template,
        controller:['$scope','$reactive','$state',LoginCtrl]
    })

