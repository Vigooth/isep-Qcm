
import angular from 'angular';

import angularMeteor from 'angular-meteor';
import template from './training.html';
import _ from 'lodash';

import angularBootstrap from 'angular-ui-bootstrap';

import {Questions} from '/imports/api/questions'
import {Answers} from '/imports/api/answers'
import {Themes} from '/imports/api/themes'
import {Qcms} from '/imports/api/qcms'
import {Modules} from '/imports/api/modules'
class TrainingCtrl{
    constructor($scope,$stateParams) {
        'ngInject';
        $scope.viewModel(this);
        var user_mail=Meteor.user().emails[0].address;
        var qcms=Qcms.find({createdBy:user_mail,type:'training'});
        var modules=[];
        var themes=[];
        var arrayOfModulesId=[];
        var arrayOfThemesId=[];
        this.autorun(()=>{
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

        });

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

        $scope.removeQcm=function(){
            Meteor.call('removeQcm',this.qcm._id);
        }
    }

}

export default angular.module('training', [

    angularMeteor,angularMeteor

])
    .component('training',{
        templateUrl:template,
        controller:['$scope','$stateParams',TrainingCtrl]
    })

