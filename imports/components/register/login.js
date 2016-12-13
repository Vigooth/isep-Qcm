
import  angular from 'angular';

import angularMeteor from 'angular-meteor';
import angularBoostrap from 'angular-ui-bootstrap';
import template from './login.html'
class LoginCtrl{
    constructor($scope,$reactive){
        'ngInject';

        $scope.viewModel(this);
        $reactive(this).attach($scope);

        
        this.helpers({

        });
     
    }
}

export default angular.module('login', [

    angularMeteor,angularBoostrap,'ui.bootstrap'

])
    .component('login',{
        templateUrl:template,
        controller:['$scope','$reactive',LoginCtrl]
    })

