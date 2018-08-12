const app = angular.module('app');
const window = require('window');
const cdn = window.cdn || '';

app.factory('orderDialog', [ '$mdDialog', '$state', '$http',  ($mdDialog, $state, $http) => {
  const publicInfo = {};
  const hide = () => {
    return $mdDialog.hide()
    .then(success => {
      dialogPromise = null;
      return;
    }).catch(err => {
      dialogPromise = null;
      return;
    });
  };
  publicInfo.hide = hide;
  const toUserPage = userId => {
    hide();
    $state.go('admin.userPage', { userId });
  };
  publicInfo.toUserPage = toUserPage;
  let dialogPromise = null;
  const confirmOrder = (orderId)  => {
          $http.post('/api/admin/order/confirm', {
              orderId,
          }).then(success => {
              publicInfo.order.status = "TRADE_SUCCESS";
          }).catch(err => {
              console.log(err);
          });
  };
  publicInfo.confirmOrder = confirmOrder;
  const isDialogShow = () => {
    if(dialogPromise && !dialogPromise.$$state.status) {
      return true;
    }
    return false;
  };
  const dialog = {
    templateUrl: `${ cdn }/public/views/dialog/order.html`,
    escapeToClose: false,
    locals: { bind: publicInfo },
    bindToController: true,
    controller: ['$scope', '$mdMedia', '$mdDialog', 'bind', function($scope, $mdMedia, $mdDialog, bind) {
      $scope.publicInfo = bind;
      $scope.setDialogWidth = () => {
        if($mdMedia('xs') || $mdMedia('sm')) {
          return {};
        }
        return { 'min-width': '400px' };
      };
    }],
    fullscreen: true,
    clickOutsideToClose: true,
  };
  const show = (order) => {
    if(isDialogShow()) {
      return dialogPromise;
    }
    publicInfo.order = order;
    dialogPromise = $mdDialog.show(dialog);
    return dialogPromise;
  };
  return {
    show,
  };
}]);

app.factory('orderFilterDialog' , [ '$mdDialog', '$http', ($mdDialog, $http) => {
  const publicInfo = {};
  $http.get('/api/admin/group').then(success => {
    publicInfo.groups = success.data;
    publicInfo.groups.unshift({ id: -1, name: '所有组', comment: '' });
  });
  const hide = () => {
    return $mdDialog.hide()
    .then(success => {
      dialogPromise = null;
      return;
    }).catch(err => {
      dialogPromise = null;
      return;
    });
  };
  publicInfo.hide = hide;
  let dialogPromise = null;
  const isDialogShow = () => {
    if(dialogPromise && !dialogPromise.$$state.status) {
      return true;
    }
    return false;
  };
  const dialog = {
    templateUrl: `${ cdn }/public/views/admin/orderFilterDialog.html`,
    escapeToClose: false,
    locals: { bind: publicInfo },
    bindToController: true,
    controller: ['$scope', '$mdDialog', '$localStorage', 'bind', function($scope, $mdDialog, $localStorage, bind) {
      $scope.publicInfo = bind;
      $scope.orderFilter = $localStorage.admin.orderFilterSettings;
    }],
    clickOutsideToClose: true,
  };
  const show = id => {
    publicInfo.id = id;
    if(isDialogShow()) {
      return dialogPromise;
    }
    dialogPromise = $mdDialog.show(dialog);
    return dialogPromise;
  };
  return {
    show,
    hide,
  };
}]);
