
import angular from 'angular';

import angularMeteor from 'angular-meteor';
import ngSanitize from 'angular-sanitize';

import qcmList from '../imports/components/professor/qcmList/qcmList'
import qcmStats from '../imports/components/professor/qcmStats/qcmStats'
import qcmCreate from '../imports/components/professor/qcmCreate/qcmCreate'
import qcmCreateExam from '../imports/components/professor/qcmCreateExam/qcmCreateExam'
import qcmChoose from '../imports/components/student/qcmChoose/qcmChoose';
import qcmTraining from '../imports/components/student/qcmTraining/qcmTraining';
import qcmExam from '../imports/components/student/qcmExam/qcmExam';
import login from '../imports/components/register/login';
import create from '../imports/components/professor/qcm/create/create';
import myQcms from '../imports/components/professor/qcm/myQcms/myQcms';
import uiRouter from 'angular-ui-router';
import {Qcms} from '../imports/api/qcms';


angular.module('isep-qcm', [
  angularMeteor,
    uiRouter,
    ngSanitize,
    qcmList.name,
    qcmStats.name,
    qcmCreate.name,
    qcmCreateExam.name,
    qcmChoose.name,
    qcmTraining.name,
    qcmExam.name,
    login.name,
    create.name,
    myQcms.name,
    'accounts.ui'
]).config(config);

function config($stateProvider,$locationProvider,$urlRouterProvider){
    'ngInject';
  $stateProvider
      
      .state('qcmList',{
        url:"/qcm",
        templateUrl:qcmList,
        template:'<qcm-list></qcm-list>'
      })
      .state('myQcms',{
        templateUrl:myQcms,
        template:'<my-qcms></my-qcms>'
      })
      .state('create',{
        templateUrl:create,
        template:'<create></create>'
      })
      .state('qcmCreate',{
          url:"/qcm/:qcmId",
          templateUrl:qcmCreate,
          params:{'qcmId':['$stateParams',function($stateParams){
              return $stateParams.qcmId;
          }]},
          template:'<qcm-create></qcm-create>'
      })
      .state('login',{
          url:"/login",
          templateUrl:login,
          template:'<login></login>'
      })
      .state('qcmCreateExam',{
          url:"/qcm/exam/:qcmId",
          templateUrl:qcmCreateExam,
          params:
          {
              'qcmId':['$stateParams',function($stateParams){
                  return $stateParams.qcmId;
              }]
          },
       
          template:'<qcm-create-exam></qcm-create-exam>'
      })
      .state('qcmStats',{
          url:'/qcm/stats/:qcmId',
          templateUrl:qcmStats,
          template:'<qcm-stats></qcm-stats>',
          params:{
              'qcmId':['$stateParams',function($stateParams){
                  return $stateParams.qcmId;
              }],
              'question':['$stateParams',function($stateParams){
                  return $stateParams.question;
              }]}

      })
      .state('qcmChoose',{
          url:"/qcms",
          templateUrl:qcmChoose,
          template:'<qcm-choose></qcm-choose>',
          controller:function($scope){
          },
          params:{
              'qcmId':['$stateParams',function($stateParams){
              return $stateParams.qcmId;
          }],
              'question':['$stateParams',function($stateParams){
              return $stateParams.question;
          }]}

      })
      .state('qcmTraining',{
          url:'/qcms/training/:qcmId/:question',
          templateUrl:qcmTraining,
          template:'<qcm-training></qcm-training>',
          controller:function($stateParams,$state){if(!($stateParams.question>0)){$state.go('qcmChoose')}}

      })
.state('qcmExam',{
        url:"/qcms/exam/:qcmId/:question?bonus&penalty",
        templateUrl:qcmExam,
        template:'<qcm-exam></qcm-exam>',
    controller:function($scope,$stateParams,$state){
        var qcmId=$stateParams.qcmId;
        var qcm=Qcms.findOne({_id:qcmId});
        var qcmNotFound=!qcm;
        //if(((qcmNotFound)||($stateParams.question!=qcm.numberOfExamQuestions))){$state.go('qcmChoose')}
        }


});
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/qcm')
}