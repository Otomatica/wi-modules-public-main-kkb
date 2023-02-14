
import meteorologyTypeKkbTemplate from './meteorologyTypeKkb.html';
import meteorologyTypeKkbsvg from './meteorologyTypeKkb.svg';

 
meteorologyTypeKkb.$inject = ['wiBaseDevice'];
function meteorologyTypeKkb(BaseDevice) {
        
    class meteorologyTypeKkbController extends BaseDevice {
        constructor() {
            super(...arguments); 
            this.diagram = meteorologyTypeKkbsvg;
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
        controller: meteorologyTypeKkbController,
        template: meteorologyTypeKkbTemplate
    };
}
export default meteorologyTypeKkb;