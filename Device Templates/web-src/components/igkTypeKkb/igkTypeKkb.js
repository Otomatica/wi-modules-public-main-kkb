
import igkTypeKkbTemplate from './igkTypeKkb.html';
import igkTypeKkbsvg from './igkTypeKkb.svg';

 
igkTypeKkb.$inject = ['wiBaseDevice'];
function igkTypeKkb(BaseDevice) {
        
    class igkTypeKkbController extends BaseDevice {
        constructor() {
            super(...arguments); 
            this.diagram = igkTypeKkbsvg;
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
        controller: igkTypeKkbController,
        template: igkTypeKkbTemplate
    };
}
export default igkTypeKkb;