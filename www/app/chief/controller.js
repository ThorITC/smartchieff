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
