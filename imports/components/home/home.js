
import  angular from 'angular';
import angularMeteor from 'angular-meteor';
import angularBoostrap from 'angular-ui-bootstrap';
import template from './home.html';

class HomeCtrl{
    constructor($scope,$reactive,$state){
        'ngInject';

        $scope.viewModel(this);
        $reactive(this).attach($scope);
        var user_type='';
        this.autorun(()=> {

            if (!Meteor.user()) {
                $state.go('home')
            } else {
                user_type = Meteor.user().profile.type;

            }

            if (user_type == 'professeur') {
                $state.go('qcms')
            }
            if (user_type == 'eleve') {
                $state.go('qcmChoose')
            }
            if (user_type == 'admin') {
                $state.go('admin')
            }
        })
     
    }
}

export default angular.module('home', [

    angularMeteor,angularBoostrap,'ui.bootstrap'

])
    .component('home',{
        templateUrl:template,
        controller:['$scope','$reactive','$state',HomeCtrl]
    })

