
import ahuTypeKkbTemplate from './ahuTypeKkb.html';
import ahuTypeKkbsvg from './ahuTypeKkb.svg';

 
ahuTypeKkb.$inject = ['wiBaseDevice'];
function ahuTypeKkb(BaseDevice) {
        
    class ahuTypeKkbController extends BaseDevice {
        constructor() {
            super(...arguments); 
            this.diagram = ahuTypeKkbsvg;
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
        controller: ahuTypeKkbController,
        template: ahuTypeKkbTemplate
    };
}
export default ahuTypeKkb;