
import vrfTypeKkbTemplate from './vrfTypeKkb.html';
import vrfTypeKkbFanSvg from './vrfTypeKkbFan.svg';
import vrfTypeKkbAirSvg from './vrfTypeKkbAir.svg';

 
vrfTypeKkb.$inject = ['wiBaseDevice'];
function vrfTypeKkb(BaseDevice) {
        
    class vrfTypeKkbController extends BaseDevice {
        constructor() {
            super(...arguments);
            this.diagramAir = vrfTypeKkbAirSvg;
            this.diagramFan = vrfTypeKkbFanSvg; 
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
        controller: vrfTypeKkbController,
        template: vrfTypeKkbTemplate
    };
}
export default vrfTypeKkb;