
import  angular from 'angular';
import angularMeteor from 'angular-meteor';
import angularBoostrap from 'angular-ui-bootstrap';
import template from './theme_add.html';

class ThemeAddCtrl{
    constructor($scope,$reactive,$state){
        'ngInject';

        $scope.viewModel(this);
        $reactive(this).attach($scope);
        console.log(!Meteor.user());
        var user_type='';
        $scope.addTheme=function(){
            Meteor.call('insertThemes',{text:this.theme.text})
        }
        this.autorun(()=> {

            if (!Meteor.user()) {
                $state.go('home')
            } else {
                user_type = Meteor.user().profile.type;

            }

        })
     
    }
}

export default angular.module('themeAdd', [

    angularMeteor,angularBoostrap,'ui.bootstrap'

])
    .component('themeAdd',{
        templateUrl:template,
        controller:['$scope','$reactive','$state',ThemeAddCtrl]
    })

