angular.module('Directory.dashboard.controllers', ['Directory.loader', 'Directory.user'])
.controller('DashboardCtrl', [ '$scope', 'Item', 'Loader', 'Me', 'Dashboard', function ItemsCtrl($scope, Item, Loader, Me, Dashboard) {
  new Dashboard();
  Me.authenticated(function (data) {
  });
}])