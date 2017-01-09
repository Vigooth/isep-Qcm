
import angular from 'angular';

import angularMeteor from 'angular-meteor';
import template from './classroom.html';
import _ from 'lodash';

import angularBootstrap from 'angular-ui-bootstrap';

import {Questions} from '/imports/api/questions'
import {Answers} from '/imports/api/answers'
import {Themes} from '/imports/api/themes'
import {Qcms} from '/imports/api/qcms'
import {Modules} from '/imports/api/modules'
import {Stats} from '/imports/api/stats'
class ClassroomCtrl{
    constructor($scope,$stateParams,$state) {
        'ngInject';
        $scope.viewModel(this);
        var user_mail=Meteor.user().emails[0].address;
        var qcms=Qcms.find({createdBy:user_mail,type:'classroom'});
        var modules=[];
        var themes=[];
        var arrayOfModulesId=[];
        var arrayOfThemesId=[];
        qcms.forEach(function(qcm){
            console.log(qcm.module_id);
            var module_id=qcm.module_id;
            var theme_id=qcm.theme_id;
            if(_.indexOf(arrayOfModulesId,module_id)==-1){
                arrayOfModulesId.push(module_id)
                var module=Modules.findOne({_id:module_id});
                modules.push(module)

            }
            if(_.indexOf(arrayOfThemesId,theme_id)==-1){
                arrayOfThemesId.push(theme_id)

                var theme=Themes.findOne({_id:theme_id});
                themes.push(theme)


            }
        })
        console.log(modules)

        this.helpers({
            modules(){
                console.log(modules)
                return modules
            },
            qcms(){
                if (Meteor.user()) {
                    var user_mail=Meteor.user().emails[0].address
                    return qcms
                }
            },

            themes(){
                return themes
            }

        });
        $scope.qcmHasBeenSet=function(){
            var qcm_settings=this.qcm.settings;
            return!((qcm_settings.duration==0)&&(qcm_settings.password==""))
        };
        $scope.startTest=function(){
            Meteor.call('startQcm',this.qcm._id);

        };

        $scope.removeQcm=function(){
            if( confirm("Êtes-vous sûr de vouloir supprimer ce qcm?")){
                Meteor.call('removeQcm',this.qcm._id)
            }
        };
        $scope.gotToStats=function(){
            var stat_id=Stats.findOne({qcm_id:this.qcm._id})._id;
            $state.go('qcmStats',{qcmId :this.qcm._id,statId:stat_id})
        }
    }

}

export default angular.module('classroom', [

    angularMeteor,angularMeteor

])
    .component('classroom',{
        templateUrl:template,
        controller:['$scope','$stateParams','$state',ClassroomCtrl]
    })

