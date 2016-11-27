
import angular from 'angular';

import angularMeteor from 'angular-meteor';

import template from '../qcmChoose/qcmChoose.html';


import {Qcms} from '../../../api/qcms'
import {Modules} from '../../../api/modules'
import {Themes} from '../../../api/themes'
import {Questions} from '../../../api/questions'

class QcmChooseCtrl {

    constructor($scope,$reactive,$state) {
        
        'ngInject';
        $scope.viewModel(this);
        $reactive(this).attach($scope);
        var id="";
        $scope.mode='training';

        $scope.openModal=function(qcmId) {
            id=qcmId;
            if(this.mode==='exam'){
                $state.go('qcmExam',{qcmId:qcmId});
                //$(location).attr('href',"qcms/"+this.mode+"/"+id)

            }else{
                $(document).ready(function () {
                    $("#numberOfquestion").modal("show");
                });
            }
           
        };
        $scope.goToDoQcmPage=function(){
            var questionLimit=this.$ctrl.numberOfQuestions;
            if(this.mode==='training'){
                $(location).attr('href',"qcms/"+this.mode+"/"+id+"/"+questionLimit)

            };
            if(this.mode==='exam'){
                $state.go('qcmExam',{qcmId:id})
                //$(location).attr('href',"qcms/"+this.mode+"/"+id)

            }
        };
        $scope.range = function() {
            var isExam=this.mode=="exam";
            var max=Questions.find({qcm_id:id,examen:isExam}).count();
            var array = [];
            for (var i = 1; i <= max; i ++) {
                array.push(i);
            }
            return array;
        };
 
            $scope.validate=function(){
                
                this.numberOfQuestionsEntered=true;
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

        controller:['$scope','$reactive','$state','$stateParams',QcmChooseCtrl]

    });

