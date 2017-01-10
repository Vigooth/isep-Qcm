
import  angular from 'angular';
import angularMeteor from 'angular-meteor';
import angularBoostrap from 'angular-ui-bootstrap';
import template from './theme_add.html';

class ThemeAddCtrl{
    constructor($scope,$reactive,$state){
        'ngInject';

        $scope.viewModel(this);
        $reactive(this).attach($scope);
        $scope.addTheme=function(){
            Meteor.call('insertTheme',{text:this.theme.text})
            this.theme.text="";
        }
     
    }
}

export default angular.module('themeAdd', [

    angularMeteor,angularBoostrap,'ui.bootstrap'

])
    .component('themeAdd',{
        templateUrl:template,
        controller:['$scope','$reactive','$state',ThemeAddCtrl]
    })

