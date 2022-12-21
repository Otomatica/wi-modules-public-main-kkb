
import cracTypeKkbTemplate from './cracTypeKkb.html';
import cracTypeKkbsvg from './cracTypeKkb.svg';

 
cracTypeKkb.$inject = ['wiBaseDevice'];
function cracTypeKkb(BaseDevice) {
        
    class cracTypeKkbController extends BaseDevice {
        constructor() {
            super(...arguments); 
            this.diagram = cracTypeKkbsvg;
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
        controller: cracTypeKkbController,
        template: cracTypeKkbTemplate
    };
}
export default cracTypeKkb;