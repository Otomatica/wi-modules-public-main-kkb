
import efTypeKkbTemplate from './efTypeKkb.html';
import efTypeKkbsvg from './efTypeKkb.svg';

 
efTypeKkb.$inject = ['wiBaseDevice'];
function efTypeKkb(BaseDevice) {
        
    class efTypeKkbController extends BaseDevice {
        constructor() {
            super(...arguments); 
            this.diagram = efTypeKkbsvg;
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
             
	            let tooltipTitleArr = [this.tooltipTitle1,this.tooltipTitle2,this.tooltipTitle3]
	            let tooltipLocalsArr = [
	                this.tooltipLocals1 ? this.tooltipLocals1.split(",") : [],
	                this.tooltipLocals2 ? this.tooltipLocals2.split(",") : [],
	                this.tooltipLocals3 ? this.tooltipLocals3.split(",") : []
	            ]
	            let tooltipLocalNamesArr = [
	                this.tooltipLocalNames1 ? this.tooltipLocalNames1.split(",") : [],
	                this.tooltipLocalNames2 ? this.tooltipLocalNames2.split(",") : [],
	                this.tooltipLocalNames3 ? this.tooltipLocalNames3.split(",") : []
	            ]
	            this.addTooltipEvents("Text_airduct1", tooltipTitleArr, tooltipLocalsArr, tooltipLocalNamesArr);
        }
        
        addTooltipEvents(ID, tooltipTitle, tooltipLocals, tooltipLocalNames) {
            if(!tooltipTitle[0] || !tooltipLocals[0] || !tooltipLocalNames[0]) {
                return false;
            }
            this.waitForElm('.' + $scope.deviceName + ' #' + ID).then((elm) => {
                console.log(elm)
                elm.addEventListener('mouseover', (event) => {
                    this.waitForElm('md-tooltip').then((tooltip) => {
                        console.log(tooltip)
                        let customHtml = "";
                        
                        for(let i=0;i<tooltipTitle.length;i++) {
                            if(!tooltipTitle[i]) continue;
                            customHtml += '<h5 class="tooltip-header">' + tooltipTitle[i] + '</h5>';
                            for(let j=0;j<tooltipLocals.length;j++) {
                                if(!tooltipLocals[i][j]) continue;
                                customHtml += '<span>' + tooltipLocals[i][j];
                                if(!tooltipLocalNames[i][j]) {
                                    customHtml += '<br/>';
                                    continue;
                                }
                                customHtml += ' | ' + tooltipLocalNames[i][j] + '</span><br/>';
                            }
                        }
                        
                        tooltip.innerHTML = customHtml;
                    });
                })
            });
        }
        
       waitForElm(selector) {
            return new Promise(resolve => {
                if (document.querySelector(selector)) {
                    return resolve(document.querySelector(selector));
                }
        
                const observer = new MutationObserver(mutations => {
                    if (document.querySelector(selector)) {
                        resolve(document.querySelector(selector));
                        observer.disconnect();
                    }
                });
        
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            });
        }
        
   }
    
    return {
        restrict: 'E',
        scope: {},
        bindToController: {
            bindingTag: '@?',
            deviceName: '@?',
            bindingPoints: '<?',           
        },        
        designerInfo: {
            icon: 'storage',
            attributes: {
            }
        },
        controllerAs: '$ctrl',
        controller: efTypeKkbController,
        template: efTypeKkbTemplate
    };
}
export default efTypeKkb;