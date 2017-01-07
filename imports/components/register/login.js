
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
        },
        $scope.register=function(){
            $scope.showRegister=true;
        }


        $scope.submit=function() {
            Meteor.call('insertUsers',this.user.name,this.user.password,this.user.type||"")
            //Meteor.call('isMail',this.user.name)
            Meteor.loginWithPassword(this.user.name, this.user.password);
        };

        this.autorun(()=>{
          if(Meteor.userId()){
              $state.go('home')

          }
        });
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

