/*
 * ========================================================================
 * Added by Reeth with ref to  Session Section  19-07-2017
 * ========================================================================
 */
app.controller("sessionController", ['$scope', '$rootScope', '$timeout', "Idle", "Keepalive", "$modal",
  function ($scope, $rootScope, $timeout, Idle, Keepalive, $modal) {

    // Scrolling Top of Page issue resolved using below line - Shashank Honrao on 20-Dec-2017
    window.scrollTo(0, 0);

    function closeModals() {
      if ($scope.warning) {
        $scope.warning.close();
        $scope.warning = null;
      }
    }

    $scope.$on('IdleStart', function () {
      closeModals();
      $scope.warning = $modal.open({
        templateUrl: 'warning-dialog.xhtml',
        windowClass: 'modal-danger'
      });
    });

    $scope.$on('IdleEnd', function () {
      closeModals();
    });

    $scope.$on('IdleTimeout', function () {
      closeModals();
      //window.location.href="/?method=logout&returnUrl=Profiles";
    });

    $scope.start = function () {
      closeModals();
      Idle.watch();
      $scope.started = true;
    };

    $scope.stop = function () {
      closeModals();
      Idle.unwatch();
      $scope.started = false;
    };

    $scope.start();

    /* Collapse functionality for breadcrumb-section and filter-page implemented 
     * by Shashank Honrao on 23-Nov-2017
     *  */

    var timeout;
    $(document).ready(function () {
      $(window).scroll(function () {
        clearTimeout(timeout);
        timeout = setTimeout(function () {
          if ($scope.mode == "List") {
            if ($(this).scrollTop() > 0) {
              $('#demo').collapse({
                toggle: true
              });
              $('#demo').collapse('hide');
              $scope.toggleView = true;
            } else {
              $('#demo').collapse({
                toggle: false
              });
              $('#demo').collapse('show');
              $scope.toggleView = false;
            };
          } else {
            if ($(this).scrollTop() > 0) {
              $('#demo').collapse({
                toggle: true
              });
              $('#demo').collapse('hide');
              $scope.toggleView = true;
            } else {
              $('#demo').collapse({
                toggle: false
              });
              $('#demo').collapse('show');
              $scope.toggleView = false;
            };
          }
          $scope.$apply();
        }, 500);
      });
    });

  }
]);