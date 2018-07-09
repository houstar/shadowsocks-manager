const app = angular.module('app');

app
.controller('AdminOrderSettingController', ['$scope', '$state', '$http',
  ($scope, $state, $http) => {
    $scope.setTitle('订单设置');
    $scope.setMenuButton('arrow_back', 'admin.settings');
    $http.get('/api/admin/order').then(success => {
      $scope.orders = success.data;
    });
    $scope.editOrder = id => {
      $state.go('admin.editOrder', { id });
    };
    $scope.setFabButton(() => {
      $state.go('admin.newOrder');
    });
  }
])
.controller('AdminNewOrderController', ['$scope', '$state', '$http',
  ($scope, $state, $http) => {
    $scope.setTitle('新增订单');
    $scope.setMenuButton('arrow_back', 'admin.order');

    $scope.typeList = [
      { key: '周', value: 2 },
      { key: '月', value: 3 },
      { key: '天', value: 4 },
      { key: '小时', value: 5 },
    ];

    $http.get('/api/admin/server').then(success => {
      $scope.servers = success.data;
    });
    $scope.order = {
      type: 2,
      cycle: 1,
      alipay: 0,
      paypal: 0,
      flow: 100000000,
    };
    $scope.orderServer = !!$scope.order.server;
    $scope.orderServerObj = {};
    $scope.cancel = () => { $state.go('admin.order'); };
    $scope.confirm = () => {
      const server = Object.keys($scope.orderServerObj)
      .map(m => {
        if($scope.orderServerObj[m]) {
          return +m;
        }
      })
      .filter(f => f);
      $scope.order.server = $scope.orderServer ? server : null;
      $http.post('/api/admin/order', $scope.order).then(success => {
        $state.go('admin.order');
      });
    };
  }
])
.controller('AdminEditOrderController', ['$scope', '$state', '$http', '$stateParams', 'confirmDialog',
  ($scope, $state, $http, $stateParams, confirmDialog) => {
    $scope.setTitle('编辑订单');
    $scope.setMenuButton('arrow_back', 'admin.order');

    $scope.typeList = [
      {key: '周', value: 2},
      {key: '月', value: 3},
      {key: '天', value: 4},
      {key: '小时', value: 5},
    ];

    $scope.orderId = $stateParams.id;
    $http.get('/api/admin/server').then(success => {
      $scope.servers = success.data;
    });
    $http.get(`/api/admin/order/${ $scope.orderId }`).then(success => {
      $scope.order = success.data;
      $scope.orderServer = !!$scope.order.server;
      $scope.orderServerObj = {};
      if($scope.order.server) {
        $scope.servers.forEach(server => {
          if($scope.order.server.indexOf(server.id) >= 0) {
            $scope.orderServerObj[server.id] = true;
          } else {
            $scope.orderServerObj[server.id] = false;
          }
        });
      }
    });
    $scope.cancel = () => { $state.go('admin.order'); };
    $scope.delete = () => {
      confirmDialog.show({
        text: '真的要删除此订单吗？',
        cancel: '取消',
        confirm: '删除',
        error: '删除订单失败',
        fn: function () { return $http.delete(`/api/admin/order/${ $scope.orderId }`); },
      }).then(() => {
        $state.go('admin.order');
      });
    };
    $scope.confirm = () => {
      const server = Object.keys($scope.orderServerObj)
      .map(m => {
        if($scope.orderServerObj[m]) {
          return +m;
        }
      })
      .filter(f => f);
      $scope.order.server = $scope.orderServer ? server : null;
      $http.put(`/api/admin/order/${ $scope.orderId }`, $scope.order).then(success => {
        $state.go('admin.order');
      });
    };
  }
])
;