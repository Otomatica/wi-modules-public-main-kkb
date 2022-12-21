
import vrfTypeKkb3Template from './vrfTypeKkb3.html';
 
vrfTypeKkb3.$inject = ['wiBaseDevice'];
function vrfTypeKkb3(BaseDevice) {
        
    class vrfTypeKkb3Controller extends BaseDevice {
        constructor() {
            super(...arguments);
        }
        
        $onChanges(changes) {
            super.$onChanges(...arguments);
        }
        
        $onInit() {
            //this.$scope
            //this.$scope.points
            //this.$scope.$mdMedia
             this.$scope.hidden = false;
              this.$scope.test = false;
        }
   }
    
    return {
        restrict: 'E',
        scope: {},
        bindToController: {
            bindingTag: '@?',
            deviceName: '@?',
            bindingPoints: '<?'
        },        
        designerInfo: {
            icon: 'storage',
            attributes: {
            }
        },
        controllerAs: '$ctrl',
        controller: vrfTypeKkb3Controller,
        template: vrfTypeKkb3Template
    };
}
export default vrfTypeKkb3;