
import angular from 'angular';

import angularMeteor from 'angular-meteor';

import qcmList from '../imports/components/professor/qcmList/qcmList'
import qcmCreate from '../imports/components/professor/qcmCreate/qcmCreate'
import qcmChoose from '../imports/components/student/qcmChoose/qcmChoose';
import qcmTraining from '../imports/components/student/qcmTraining/qcmTraining';

import uiRouter from 'angular-ui-router';


angular.module('isep-qcm', [

  angularMeteor,
    uiRouter,
    qcmList.name,
    qcmCreate.name,
    qcmChoose.name,
    qcmTraining.name
]).config(config);

function config($stateProvider,$locationProvider,$urlRouterProvider){
    'ngInject';
  $stateProvider
      .state('qcmList',{
        url:"/qcm",
        templateUrl:qcmList,
        template:'<qcm-list></qcm-list>'
      })
      .state('qcmCreate',{
          url:"/qcm/:qcmId",
          templateUrl:qcmCreate,
          params:{'qcmId':['$stateParams',function($stateParams){
              return $stateParams.qcmId;
          }]},
          template:'<qcm-create></qcm-create>'
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
          template:'<qcm-training></qcm-training>'

      });
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/qcm')
}