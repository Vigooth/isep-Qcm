
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
        $scope.alreadyExist=function(){

        };
        Meteor.subscribe('allUsers');
        $scope.logout=function(){
            Meteor.logout()
        }


        $scope.submit=function() {
            Meteor.call('insertUsers',this.user.name,this.user.password)
            //Meteor.call('isMail',this.user.name)
            Meteor.loginWithPassword(this.user.name, this.user.password);
            $state.go('qcmList')
        };
    
        
        this.helpers({

    });
     
    }
}

export default angular.module('login', [

    angularMeteor,angularBoostrap,'ui.bootstrap'

])
    .component('login',{
        templateUrl:template,
        controller:['$scope','$reactive','$state',LoginCtrl]
    })

