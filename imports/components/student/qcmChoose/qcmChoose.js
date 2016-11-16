
import angular from 'angular';

import angularMeteor from 'angular-meteor';

import template from '../qcmChoose/qcmChoose.html';


import {Qcms} from '../../../api/qcms'
import {Modules} from '../../../api/modules'
import {Themes} from '../../../api/themes'
import {Questions} from '../../../api/questions'

class QcmChooseCtrl {

    constructor($scope) {
        
        'ngInject';
        $scope.viewModel(this);
        var id="";
        
        $scope.openModal=function(qcmId) {
            id=qcmId;
            $(document).ready(function () {
                $("#numberOfquestion").modal("show");
            });
        };
        $scope.goToDoQcmPage=function(){
            var questionLimit=$scope.$ctrl.numberOfQuestions;
            $(location).attr('href',"qcms/"+id+"/"+questionLimit)
        };
        $scope.range = function() {
            var max=Questions.find({qcm_id:id}).count();
            var array = [];
            for (var i = 1; i <= max; i ++) {
                array.push(i);
            }
            return array;
        };
 
            $scope.validate=function(){
                
                $scope.numberOfQuestionsEntered=true;
            };

        $scope.numberOfQuestionsEntered=false;
        this.helpers({
          
            questions(b){
                console.log(b);
                return Questions.find({})
            },

            qcms(){
                    return Qcms.find({})

            },
            returnIdmodulee(){
                return Qcms.find({})

        },
            modules(){
                return Modules.find({})
            },
            themes(){
                return Themes.find({})
            }

        })

    }


}



export default angular.module('qcmChoose', [

    angularMeteor
])

    .component('qcmChoose', {

        templateUrl: template,

        controller:['$scope','$stateParams',QcmChooseCtrl]

    });

