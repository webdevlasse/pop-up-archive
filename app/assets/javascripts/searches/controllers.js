angular.module('Directory.searches.controllers', ['Directory.loader', 'Directory.searches.models', 'Directory.searches.filters', 'Directory.collections.models', 'prxSearch'])
.controller('SearchCtrl', ['$scope', '$location', 'Query', function ($scope, $location, Query) {
  $scope.location = $location;
  $scope.$watch('location.search().query', function (search) {
    $scope.query = new Query(search);
  });
}])
.controller('GlobalSearchCtrl', ['$scope', 'Query', '$location', function ($scope, Query, $location) {
  $scope.query = new Query();
  $scope.go = function () {
    $location.path('/search');
    $scope.query.commit();
    $scope.query = new Query();
  }
}])
.controller('ExploreCtrl', ['$scope', 'Exploration', function ($scope, Exploration) {
  // debugger
  $scope.letters= ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
  $scope.facet_selections=[{name:"Collection", value: "collection_title"}, {name:"Series", value: "series_title"}, {name:"Episode", value: "episode_title"},];
  var facet = "series_title";
  var letter = "A";
  var term = "seriesTitle";
  $scope.exploration=Exploration.query({letter: letter, facet: facet}).then(function(data) { 
          console.log(data);
          $scope.terms=data.facets[term].terms;
          console.log($scope.terms);
  });
  $scope.setFacet = function (facet){
    $scope.exploration=Exploration.query({letter: letter, facet: facet}).then(function(data) {
      console.log(data);
      $scope.terms=data.facets[term].terms;
      console.log(data.facets.seriesTitle.terms);
      console.log($location);
    });  
  };
  $scope.setLetter = function (letter) {
    $scope.exploration=Exploration.query({letter: letter, facet: facet}).then(function(data) {
      console.log(data);
      $scope.terms=data.facets[term].terms;
      console.log($scope.terms);
      console.log($location);
    });
  };
}])
.controller('SearchResultsCtrl', ['$scope', 'Search', 'Loader', '$location', '$routeParams', 'Query', 'Collection', 'SearchResults', function ($scope, Search, Loader, $location, $routeParams, Query, Collection, SearchResults) {
  $scope.location = $location;
  
  $scope.$watch('location.search().query', function (searchquery) {
    $scope.query = new Query(searchquery);
    fetchPage();
  });

  $scope.$watch('location.search().page', function (page) {
    fetchPage();
  });

  $scope.$on("datasetChanged", function () {
    fetchPage();
  });

  $scope.nextPage = function () {
    $location.search('page', (parseInt($location.search().page) || 1) + 1);
    fetchPage();
  }

  $scope.backPage = function () {
    $location.search('page', (parseInt($location.search().page) || 2) - 1);
    fetchPage();
  }


  $scope.addSearchFilter = function (filter) {
    $scope.query.add(filter.field+":"+'"'+filter.name+'"');
  }

  function fetchPage () {
    searchParams = {};

    if ($routeParams.contributorName) {
      searchParams['filters[contributor]'] = $routeParams.contributorName;
    }

    if (typeof $routeParams.collectionId !== 'undefined') {
      searchParams['filters[collection_id]'] = $routeParams.collectionId;
    }

    if ($scope.query) {
      searchParams.query = $scope.query.toSearchQuery();
    }
    searchParams.page = $location.search().page;

    if (!$scope.search) {
      $scope.search = Loader.page(Search.query(searchParams));
    } else {
      Loader(Search.query(searchParams), $scope);
    }

    $scope.$watch('search', function (search) {
      SearchResults.setResults(search);
    });
  }
}]);