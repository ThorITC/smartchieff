angular.module('smartchiefApp', ['ionic', 'chief']);

angular.module('smartchiefApp').run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
});

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

angular.module('chief', []);

angular.module('chief').constant('API_URL', 'http://smartchief.loc');

angular.module('chief').factory('chiefFactory', chiefFact);
angular.module('chief').factory('ingredientFactory', ingredientFact);

chiefFact.$inject = ['$http', '$q', 'API_URL'];
function chiefFact($http, $q, API_URL){
  var factoryObject = {
    randomDish: _randomDish,
    rateDish: _rateDish,
    getDishById: _getDishById,
    searchRecipe: _serachRecipe
  };

  function _randomDish(){
    var defer = $q.defer();
    $http.get(API_URL + '/random-recipe/').then(function(data){
      defer.resolve(data);
    }, function(error){
      defer.reject();
    });
    return defer.promise;
  };

  function _rateDish(_id, _rate){
    $http.put(API_URL + '/rating/?id='+_id+'&rate='+_rate);
  };

  function _getDishById(id){
    var defer = $q.defer();
    $http.get(API_URL+'/recipe/', {
      params:{
        id: id
      }
    }).then(function(data){
      defer.resolve(data);
    }, function(error){
      defer.reject();
    });
    return defer.promise;
  };

  function _serachRecipe(key){
    var defer = $q.defer();
    $http.get(API_URL + '/search-recipe/', {
      params:{
        search: key.slice(1)
      }
    }).then(function(data){
      defer.resolve(data);
    }, function(error){
      defer.reject();
    });
    return defer.promise;
  };

  return factoryObject;
}

ingredientFact.$inject = ['$http', '$q', 'API_URL'];
function ingredientFact($http, $q, API_URL){
  var factoryObject = {
    getPopularIngredients:_getPopularIngredients,
  };

  function _getPopularIngredients(){
    var defer = $q.defer();
    $http.get(API_URL + '/top-ingredients/').then(function(data){
      defer.resolve(data);
    }, function(error){
      defer.reject();
    })
    return defer.promise;
  };

  return factoryObject;
}

angular.module('chief').controller('randomDishController', randomDishCtrl);
angular.module('chief').controller('detailController', detailCtrl);
angular.module('chief').controller('searchController', searchCtrl);
angular.module('chief').controller('consrtuctorController', constCtrl);

randomDishCtrl.$inject = ['$scope', 'chiefFactory'];
function randomDishCtrl($scope, chiefFactory){
  var vm = this;

  vm.getRandomDish = _getRandomDish;
  vm.rate = _rate;
  vm.randomDish = null;


  function _getRandomDish(){
    chiefFactory.randomDish().then(function(data){
      vm.randomDish = data.data;
      $scope.$broadcast('scroll.refreshComplete');
    });
  }

  function _rate(rate){
    chiefFactory.rateDish(vm.randomDish.dish.id, rate);
    if(rate === 1){
      vm.randomDish.dish.rating.likes++;
    }else{
      vm.randomDish.dish.rating.dislikes++;
    }
  }
};

detailCtrl.$inject = ['$scope', '$stateParams', 'chiefFactory'];
function detailCtrl($scope, $stateParams, chiefFactory){
  var vm = this;

  vm.dish = null;
  vm.init = getDishById();

  function getDishById(){
    var dishId = $stateParams.recipeId;
    chiefFactory.getDishById(dishId).then(function(data){
      data.data.recipe.recipe = angular.fromJson(data.data.recipe.recipe);
      vm.dish = data.data;
      console.log(data.data);
    });
  }

  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    viewData.enableBack = true;
  });
}

searchCtrl.$inject = ['chiefFactory'];
function searchCtrl(chiefFactory){
  var vm = this;
  vm.searchKey = null;
  vm.recipeList = null;

  vm.search = searchMethod;

  function searchMethod(){
    chiefFactory.searchRecipe(vm.searchKey).then(function(data){
      vm.recipeList = data.data;
    });
  }
}


constCtrl.$inject = ['ingredientFactory'];
function constCtrl(ingredientFactory){
  var vm = this;
  vm.ingredientsList = null;

  vm.getIngredients = _getIngredients;

  function _getIngredients(){
    ingredientFactory.getPopularIngredients().then(function(data){
      vm.ingredientsList = data.data;
    }, function(error){
      console.log(error);
    });
  }
}
