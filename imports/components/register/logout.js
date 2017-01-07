
import  angular from 'angular';
import angularMeteor from 'angular-meteor';
import angularBoostrap from 'angular-ui-bootstrap';
import template from './logout.html';

class LogoutCtrl{
    constructor($scope,$reactive,$state){
        'ngInject';

        $scope.viewModel(this);
        $reactive(this).attach($scope);
        $scope.alreadyExist=function(){

        };
        Meteor.subscribe('allUsers');
        $scope.logout=function(){
            Meteor.logout();
            //$(location).attr('href',"login")
        }
        $scope.user = {
        mail: function() {
            if (Meteor.user()) {
                return Meteor.user().emails[0].address
            }
        }
    };
        this.autorun(()=>{
            if(Meteor.userId()) {
                $scope.login=true;
                $state.go("home")
            }else{$scope.login=false;
                $state.go("login")
            };
        });
        console.log(Meteor.users.findOne(Meteor.userId()));
    }
}

export default angular.module('logout', [

    angularMeteor,angularBoostrap,'ui.bootstrap'

])
    .component('logout',{
        templateUrl:template,
        controller:['$scope','$reactive','$state','$meteor',LogoutCtrl]
    })

