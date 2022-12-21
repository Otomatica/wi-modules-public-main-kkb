
import vrfTypeKkb2Template from './vrfTypeKkb2.html';
import vrfTypeKkb2FanSvg from '../vrfTypeKkb/vrfTypeKkbFan.svg';
import vrfTypeKkb2AirSvg from '../vrfTypeKkb/vrfTypeKkbAir.svg';

 
vrfTypeKkb2.$inject = ['wiBaseDevice'];
function vrfTypeKkb2(BaseDevice) {
        
    class vrfTypeKkb2Controller extends BaseDevice {
        constructor() {
            super(...arguments);
            this.diagramAir = vrfTypeKkb2AirSvg;
            this.diagramFan = vrfTypeKkb2FanSvg; 
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
        controller: vrfTypeKkb2Controller,
        template: vrfTypeKkb2Template
    };
}
export default vrfTypeKkb2;