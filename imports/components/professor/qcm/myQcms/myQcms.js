
import angular from 'angular';

import angularMeteor from 'angular-meteor';
import template from './myQcms.html';
import _ from 'lodash';

import angularBootstrap from 'angular-ui-bootstrap';

import {Questions} from '../../../../api/questions'
import {Answers} from '../../../../api/answers'
import {Themes} from '../../../../api/themes'
import {Qcms} from '../../../../api/qcms'
import {Modules} from '../../../../api/modules'
class MyQcmsCtrl{
    constructor($scope,$state) {
        'ngInject';
        $scope.viewModel(this);
        var user_mail=Meteor.user().emails[0].address;
        var qcms=Qcms.find({createdBy:user_mail});
        console.log($state)

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

        $scope.removeQcm=function(){
            Meteor.call('removeQcm',this.qcm._id);
        }
    }

}

export default angular.module('myQcms', [

    angularMeteor,angularMeteor

])
    .component('myQcms',{
        templateUrl:template,
        controller:['$scope','$state',MyQcmsCtrl]
    })

