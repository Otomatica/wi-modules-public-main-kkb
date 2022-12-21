
baseDeviceControllerFactory.$inject = ['maPoint', '$mdMedia'];
function baseDeviceControllerFactory(maPoint, $mdMedia) {

    class baseDeviceController {
        static get $$ngIsClass() { return true; }
        static get $inject() { return ['$scope']; }
        
        constructor($scope) {
            this.$scope = $scope;
            this.$scope.points = {};
            this.$scope.$mdMedia = $mdMedia;
        }

        $onChanges(changes) {
            Object.keys(this.$scope.points).forEach(x => !this[x] && (delete this.$scope.points[x]));
            this.getPoints(changes);
        }

        getPoints(changes) {
            if(!this.bindingTag || (!this.deviceName && !this.bindingPoints)) return this.createMap([], changes);
            
            if(this.deviceName) 
                maPoint.query({rqlQuery: 'eq(deviceName,'+this.deviceName+')'}).$promise.then(points => this.createMap(points, changes));
            else if(this.bindingPoints) 
                this.createMap(this.bindingPoints, changes);
        }

        createMap(points, changes) {
            points.forEach(p => {
                let tagValue = p.tags[this.bindingTag];
                tagValue && (this.$scope.points[tagValue.toLowerCase()] = p);
            });

            //override static points
            let discard = ['deviceName', 'bindingPoints', 'bindingTag'];
            let staticPoints = Object.keys(changes).filter(prop => !discard.includes(prop) && this[prop]);
            staticPoints.forEach(prop => {
                maPoint.get({xid: this[prop]}).$promise.then(point => this.$scope.points[prop] = point)
            });
        }
    }

    return baseDeviceController;
}

export default baseDeviceControllerFactory;