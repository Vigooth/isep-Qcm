
import angular from 'angular';

import angularMeteor from 'angular-meteor';
import template from './alert.html';
import {Qcms} from '/imports/api/qcms'

class AlertCtrl{
    constructor($scope,$stateParams) {
        'ngInject';
        $scope.viewModel(this);
        var user={};
        $scope.alert={
            professor:{
                classroomIsOpen:false
            }
        };
        this.helpers({

        });
        this.autorun(()=> {
            if(user=Meteor.user()){
                if(user.profile.type=='professeur'){
                    //Alert prof if he started a classroom qcm
                    var userOpensAclassroomTest=Qcms.findOne({createdBy:user.profile.email,status:'open'})
                    $scope.alert.professor.classroomIsOpen=!!userOpensAclassroomTest;
                }


            }
        })



    }

}

export default angular.module('alert', [

    angularMeteor,angularMeteor

])
    .component('alert',{
        templateUrl:template,
        controller:['$scope','$stateParams',AlertCtrl]
    })

