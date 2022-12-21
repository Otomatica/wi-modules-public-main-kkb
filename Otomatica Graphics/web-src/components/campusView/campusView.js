
import componentTemplate from './campusView.html';

let loadTypes = ['Total', 'IT', 'Mechanic'];
let systemCount = 10;

let chartCount = 5;
let chartPointCount = 10;

let plotTypes = ['LINE', 'SPLINE', 'STEP', 'BAR'];
let stackTypes = ['none', 'regular', '100%'];
let valueAxis = ['left', 'right', 'left-2','right-2'];

const $inject = Object.freeze(['$scope', '$mdMedia','$element', 'maUiDateBar', 'maPoint', 'maDataPointTags', 'maRqlBuilder']);
class campusViewController {

    static get $inject() { return $inject; }
    static get $$ngIsClass() { return true; }

    constructor($scope, $mdMedia, $element, maUiDateBar, maPoint, maDataPointTags, maRqlBuilder) {
        this.$scope = $scope;
        this.$mdMedia = $mdMedia;
        this.$element = $element;
        this.$scope.dateBar = maUiDateBar;
        this.maPoint = maPoint;
        this.maDataPointTags = maDataPointTags;
        this.maRqlBuilder = maRqlBuilder;

        this.loadTypes = loadTypes;
        this.systemCount = systemCount;

        this.chartCount = chartCount;
        this.chartPointCount = chartPointCount;
    }

    $onInit() {
        if(!this.enabled) return;
        this.getFloorsAndRooms();
    }

    getFloorsAndRooms() {
        //get floors & rooms
        if(!this.floorTag || !this.campusTag || !this.campusValue) return;

        this.maDataPointTags.buildQuery(this.floorTag)
            .eq(this.campusTag, this.campusValue)
            .query().then(floors => {
                
                this.floors = floors.filter( x => x != null);
                this.floors.sort();
                if(!this.roomTag) return;

                this.rooms = {};
                this.floors.forEach(floor => {

                    let roomFilter = this.roomFilterRql ? ('&' + this.roomFilterRql) : '';
                    let query = new this.maRqlBuilder()
                        .eq(this.campusTag, this.campusValue)
                        .eq(this.floorTag, floor)
                        .toString() + roomFilter;

                    this.maDataPointTags.queryValues(this.roomTag, query).then( rooms => {
                        let floorRooms = rooms.filter(x => x != null);
                        floorRooms.sort();
                        this.rooms[floor] = floorRooms;
                    });
                });

            });
    }

    getChartPoints() {
        if(this.$scope.chartPoints) return;
        this.$scope.chartValues = {};
        this.$scope.chartPoints = {};
        this.$scope.chartOptions = {};

        for (let i = 0; i < chartCount; i++) {
            this.$scope.chartOptions[i] = { 
                valueAxes:[],
                legend: {
                    align: 'center',
                    spacing: 10,
                    verticalGap: 5,
                    valueWidth: 100,
                    labelWidth: 250
                }
            };
            valueAxis.forEach(x => {
                let axisKey = x.replace('-','');
                this.$scope.chartOptions[i].valueAxes.push({
                    axisColor: this['chart'+i+axisKey+'Color'] || '',
                    color: this['chart'+i+axisKey+'Color'] || '',
                    stackType: this['chart'+i+axisKey+'StackType'] || 'none',
                    title: this['chart'+i+axisKey+'Title'] || ''
                })
            });

            let xids = [];
            for (let j = 0; j < chartPointCount; j++)
                xids.push( {key:'chart'+i+'point'+j,  xid:this['chart'+i+'point'+j]} );

            this.maPoint.objQuery({query:'in(xid,'+ xids.map(x=>x.xid).join(',') + ')' }).$promise.then(points => {
                points.forEach(p => {
                    let pointKey = xids.find(x => x.xid == p.xid).key;
                    p.chartColour = this[pointKey+'color'] || p.chartColour;
                    p.plotType = this[pointKey+'type'] || p.plotType;
                    p.valueAxis = this[pointKey+'axis'] || p.valueAxis;
                });
                this.$scope.chartPoints[i] = points;
            });
        }
    }
}

let bindings = {
    enabled: '<?',
    campusTag: '@?',
    campusValue: '@?',
    floorTag: '@?',
    roomTag: '@?',
    roomFilterRql: '@?',

    //pue: '@?',
    outsideTemperature: '@?',
    outsideHumidity: '@?',
    //roomSize: '@?',
    //capacity: '@?',
    //fuelremtime: '@?'
   
};

let attributes = {
    enabled: {type:'boolean'},
    campusTag: {type:'string', defaultValue: 'Kampus'},
    floorTag: {type:'string', defaultValue: 'Kat'},
    roomTag: {type:'string', defaultValue: 'Oda'},
    roomFilterRql: {type:'string', defaultValue: 'eq(tags.Oda Tipi,IT Ekipman Barındıran)'},

    //pue: {label: 'PUE Xid', type:'string'},
    outsideTemperature: {label: 'Outside Temperature Xid', type:'string'},
    outsideHumidity: {label: 'Outside Humidity Xid', type:'string'},
    //roomSize: {type:'string', label: 'Room size'},
    //capacity: {type:'string', label: 'Capacity'},
   	//fuelremtime: {type:'string', label: 'Lowest Remaining Fuel Time'},
   
};

/*loadTypes.forEach(x => {
    bindings['load'+x+'Design'] = '@?';
    attributes['load'+x+'Design'] = {type:'string', label: x + ' Load Design'};

    bindings['load'+x+'Present'] = '@?';
    attributes['load'+x+'Present'] = {label: x + ' Load Present Xid', type:'string'};

    bindings['load'+x+'Rate'] = '@?';
    attributes['load'+x+'Rate'] = {label: x + ' Load Rate Xid', type:'string'};
});
*/

for (let i = 0; i < systemCount; i++) {
    bindings['system'+i+'title'] = '@?';
    attributes['system'+i+'title'] = {label: 'System '+ i + ' Title', type: 'string'};

    bindings['system'+i+'query'] = '@?';
    attributes['system'+i+'query'] = {label: 'System '+ i + ' Query', type:'string'};

    bindings['system'+i+'icon'] = '@?';
    attributes['system'+i+'icon'] = {label: 'System '+ i + ' Icon', type:'string'};
}


for (let i = 0; i < systemCount; i++) {
    bindings['floorSystem'+i+'title'] = '@?';
    attributes['floorSystem'+i+'title'] = {label: 'Floor System '+ i + ' Title', type: 'string'};

    bindings['floorSystem'+i+'query'] = '@?';
    attributes['floorSystem'+i+'query'] = {label: 'Floor System '+ i + ' Query', type:'string'};

    bindings['floorSystem'+i+'icon'] = '@?';
    attributes['floorSystem'+i+'icon'] = {label: 'Floor System '+ i + ' Icon', type:'string'};
}

for (let i = 0; i < systemCount; i++) {

    bindings['roomSystem'+i+'title'] = '@?';
    attributes['roomSystem'+i+'title'] = {label: 'Room System '+ i + ' Title', type: 'string'};

    bindings['roomSystem'+i+'query'] = '@?';
    attributes['roomSystem'+i+'query'] = {label: 'Room System '+ i + ' Query', type:'string'};

    bindings['roomSystem'+i+'icon'] = '@?';
    attributes['roomSystem'+i+'icon'] = {label: 'Room System '+ i + ' Icon', type:'string'};
}

for (let i = 0; i < chartCount; i++) {
    bindings['chart'+i+'title'] = '@?';
    attributes['chart'+i+'title'] = {label: 'Chart ' + i +' Title', type:'string'};

    valueAxis.forEach(x => {
        let axisKey = x.replace('-','');
        bindings['chart'+i+axisKey+'Title'] = '@?';
        attributes['chart'+i+axisKey+'Title'] = {label: 'Chart ' + i +' '+ axisKey + ' Title', type:'string'};
        bindings['chart'+i+axisKey+'Color'] = '@?';
        attributes['chart'+i+axisKey+'Color'] = {label: 'Chart ' + i +' '+ axisKey + ' Color', type:'color'};
        bindings['chart'+i+axisKey+'StackType'] = '@?';
        attributes['chart'+i+axisKey+'StackType'] = {label: 'Chart ' + i +' '+ axisKey + ' Stack Type', options:stackTypes};
    })

    for (let j = 0; j < chartPointCount; j++) {
        bindings['chart'+i+'point'+j] = '@?';
        attributes['chart'+i+'point'+j] = {label: 'Chart ' + i +' Point ' + j + ' Xid', type:'string'};
        bindings['chart'+i+'point'+j+'color'] = '@?';
        attributes['chart'+i+'point'+j+'color'] = {label: 'Chart ' + i +' Point ' + j + ' Color', type:'color'};
        bindings['chart'+i+'point'+j+'type'] = '@?';
        attributes['chart'+i+'point'+j+'type'] = {label: 'Chart ' + i +' Point ' + j + ' Plot Type', options: plotTypes};
        bindings['chart'+i+'point'+j+'axis'] = '@?';
        attributes['chart'+i+'point'+j+'axis'] = {label: 'Chart ' + i +' Point ' + j + ' Axis', options: valueAxis};
    }
}

export default {
    bindings: bindings,
    designerInfo: {
        translation: 'otomaticaGraphics.campusView.version',
        icon: 'location_city',
        size: {width: '100%', height: '100%'},
        attributes: attributes
    },
    require: {},
    controller: campusViewController,
    template: componentTemplate
};