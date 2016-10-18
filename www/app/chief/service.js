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
