angular.module('smartchiefApp').config(configMethod);

configMethod.$inject = ['$stateProvider', '$urlRouterProvider'];
function configMethod($stateProvider, $urlRouterProvider) {

  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.random', {
    url: '/random',
    views: {
      'tab-random': {
        templateUrl: 'templates/tab-random.html',
        controller: 'randomDishController',
        controllerAs: 'vm'
      }
    }
  })

  .state('tab.search', {
      url: '/search',
      views: {
        'tab-search': {
          templateUrl: 'templates/tab-search.html',
          controller: 'searchController',
          controllerAs: 'vm'
        }
      }
    })
    .state('recipe-detail', {
      url: '/recipe/:recipeId',
      templateUrl: 'templates/new-recipe-detail.html',
      controller: 'detailController',
      controllerAs: 'vm'
    })

  .state('tab.construct', {
    url: '/construct',
    views: {
      'tab-construct': {
        templateUrl: 'templates/tab-construct.html',
        controller: 'consrtuctorController',
        controllerAs: 'vm'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/random');

};
