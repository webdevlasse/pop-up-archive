angular.module('Directory.dashboard.controllers', ['Directory.loader', 'Directory.user'])
.controller('DashboardCtrl', [ '$scope', 'Item', 'Loader', 'Me', 'Search', function ItemsCtrl($scope, Item, Loader, Me, Search) {

  Me.authenticated(function (data) {
    $scope.recent = Search.recent();
  });

}])