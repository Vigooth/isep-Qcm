
import angular from 'angular';

import angularMeteor from 'angular-meteor';

import qcmList from '../imports/components/professor/qcmList/qcmList'
import qcmCreate from '../imports/components/professor/qcmCreate/qcmCreate'
import qcmChoose from '../imports/components/student/qcmChoose/qcmChoose';
import qcmDo from '../imports/components/student/qcmDo/qcmDo';

import uiRouter from 'angular-ui-router';

angular.module('isep-qcm', [

  angularMeteor,
    uiRouter,
    qcmList.name,
    qcmCreate.name,
    qcmDo.name,
    qcmChoose.name
]).config(config);

function config($stateProvider,$locationProvider,$urlRouterProvider){
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
          params:{'qcmId':['$stateParams',function($stateParams){
              return $stateParams.qcmId;
          }]}

      })
      .state('qcmDo',{
          url:'/qcms/:qcmId',
          templateUrl:qcmDo,
          template:'<qcm-do></qcm-do>',


      });
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/qcm')
}