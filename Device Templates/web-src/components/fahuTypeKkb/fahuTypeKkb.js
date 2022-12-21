
import fahuTypeKkbTemplate from './fahuTypeKkb.html';
import fahuTypeKkbsvg from './fahuTypeKkb.svg';
 
fahuTypeKkb.$inject = ['wiBaseDevice'];
function fahuTypeKkb(BaseDevice) {
        
    class fahuTypeKkbController extends BaseDevice {
        constructor() {
            super(...arguments); 
            this.diagram = fahuTypeKkbsvg;
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
        controller: fahuTypeKkbController,
        template: fahuTypeKkbTemplate
    };
}
export default fahuTypeKkb;