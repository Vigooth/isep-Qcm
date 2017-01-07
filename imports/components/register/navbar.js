
import  angular from 'angular';
import { Accounts } from 'meteor/accounts-base';
import angularMeteor from 'angular-meteor';
import angularBoostrap from 'angular-ui-bootstrap';
import template from './navbar.html';

class NavbarCtrl{
    constructor($scope,$reactive,$state){
        'ngInject';

        $scope.viewModel(this);
        $reactive(this).attach($scope);
        $scope.goToHome=function(){
            $state.go('home');

        }

        this.helpers({

        });

    }
}

export default angular.module('navbar', [

    angularMeteor,angularBoostrap,'ui.bootstrap'

])
    .component('navbar',{
        templateUrl:template,
        controller:['$scope','$reactive','$state',NavbarCtrl]
    })

