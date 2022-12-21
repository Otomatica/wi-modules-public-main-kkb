
import componentTemplate from './template.html';

let systemCount = 6;
let campuses = ['AvrupaDC', 'Corlu'];
let polyAreas = ['Cerkezkoy', 'Corlu'];
let regionFilter = 'Tekirdag';
let attributeCount = 7;
let iconShift = 0.01;
let mapOptions = {
    center: [41.06433922234843, 27.47406005859375],
    zoom: 9.0,
    options: {
        zoomSnap: 0.1,
        zoomDelta: 0.1,
        maxZoom:12.5, 
        minZoom:9
    }
}

const $inject = Object.freeze(['$scope', '$mdMedia','$element', 'maUiDateBar', 'wiMapAttributes', '$compile']);
class mapTekirdagController {

    static get $inject() { return $inject; }
    static get $$ngIsClass() { return true; }

    constructor($scope, $mdMedia, $element, maUiDateBar, wiMapAttributes, $compile) {
        this.$scope = $scope;
        this.$mdMedia = $mdMedia;
        this.$element = $element;
        this.$scope.dateBar = maUiDateBar;
        this.wiMapAttributes = wiMapAttributes;
        this.isDark = wiMapAttributes.isDark();
        this.$compile = $compile;

        this.systemCount = systemCount;
        this.campuses = campuses.map(x => ({key:x}));
        this.polyAreas = polyAreas;
        this.mapOptions = mapOptions;
        this.attributeCount = attributeCount;

        this.polygonRefresh = 0;
    }

    $onInit() {
       if(!this.enabled) return;
        this.coordinates = {};
        this.wiMapAttributes.district().then(res => {
            let features = res.data.features.filter(x => x.properties.region == regionFilter);

            features.forEach(feature => {
               
                polyAreas.includes(feature.properties.key) && this.initMarkers(feature);
                feature.$scope = this.$scope;
                feature.properties.style = {
                    fillColor: (this.isDark ? 'black' : 'silver'),
                    color: (this.isDark ? 'white' : 'black'), 
                    weight: 0.4,
                    fillOpacity: 1,
                    strokeOpacity: 1
                };
            })
            this.polygons = {features : features};

            this.$scope.polygonScope = this.$scope.$new();
            let template = 
                `<div layout="column" layout-align="start center" style="min-width:250px;">
                    <span>
                        <span ng-bind="name"></span>
                        <span ng-bind="valueSuffix"></span>
                    </span>
                    <wi-active-events-display active-events="activeEvents" show-single-event="true"></wi-active-events-display>
                </div>`;

            this.$scope.polygonTemplate = this.$compile('<div>' + template + '</div>')(this.$scope.polygonScope);
            //

            this.$scope.$watchCollection('$ctrl.activePolyEvents', (nV, oV) => {
                if(nV == oV || this.selectedRuler) return;
                Object.keys(nV).forEach( area => this.updatePolygon(area, nV[area].color) );
            });
        });

        this.attributes = [];
         __non_webpack_require__(['d3'], d3 => {
            for (let i = 0; i < attributeCount; i++) {
                this['attribute'+i+'title'] && this.attributes.push({
                    index: i,
                    title: this['attribute'+i+'title'],
                    unit: this['attribute'+i+'unit'],
                    minValue: this['attribute'+i+'minValue'],
                    maxValue: this['attribute'+i+'maxValue'],
                    minColor: this['attribute'+i+'minColor'],
                    maxColor: this['attribute'+i+'maxColor'],
                    scale: d3.scaleLinear()
                        .domain([this['attribute'+i+'minValue'], this['attribute'+i+'maxValue']])
                        .range([this['attribute'+i+'minColor'], this['attribute'+i+'maxColor']]),
                    marksCount: this['attribute'+i+'marksCount']
                });
            }
        });
    }

    resetPolygon($model) {
        this.polyAreas.forEach(x => {
            let color = this.activePolyEvents && this.activePolyEvents[x] && this.activePolyEvents[x].color;
            color = $model ? null : color;
            this.updatePolygon(x, color);
        });
    }

    updatePolygon(key, color, attribute, point) {
        color = color || (this.isDark ? 'black' : 'silver');
        if(attribute && point) color = attribute.scale(point.value);
        let polygon = this.polygons.features.find(x => x.properties.key == key);
        polygon.point = point;
        polygon.properties.style.fillColor = color;
        this.polygonRefresh++;
    }

    onEachFeature(feature, layer) {
        layer.bindTooltip((layer) => {
            let mapScope = layer.feature.$scope;

            let name = layer.feature.properties.Name;
            let value = layer.feature.point && layer.feature.point.renderedValue;
            let renderedValue = mapScope && mapScope.$ctrl.selectedRuler && value;
            let valueSuffix = renderedValue ? (' ' + renderedValue) : '';
            let activeEvents = mapScope.$ctrl.activePolyEvents && mapScope.$ctrl.activePolyEvents[layer.feature.properties.key];

            mapScope.$apply(() => {
                mapScope.polygonScope.name = name;
                mapScope.polygonScope.valueSuffix = valueSuffix;
                mapScope.polygonScope.activeEvents = activeEvents;
            });

            return mapScope.polygonTemplate[0];
        });

        layer.on({
            click: () => {
                let key = feature.$scope.$ctrl.polyTag;
                let value = feature.$scope.$ctrl['polyTagValue'+feature.properties.key];
                if(!key || !value) return;
                feature.$scope.$apply(() => feature.$scope.$root.navigate(key , value));
            }
        });
    }

    initMarkers(feature) {
        //init default markerCoordinates
        this.coordinates[feature.properties.key] = {};
        for (let i = 0; i < this.systemCount; i++) {
            this.coordinates[feature.properties.key][i] = [feature.properties.latitude, feature.properties.longitude + (i * iconShift)];
        }
    }
}

let bindings = {
    enabled: '<?',
    polyTag: '@?',
    campusTag: '@?'
};

let attributes = {
    enabled: {type:'boolean'},
    polyTag: {type:'string', defaultValue: 'Kampus'},
    campusTag: {type:'string', defaultValue: 'Kampus'}
};

campuses.forEach(x => {
    bindings['campus'+x+'Temp'] = '@?';
    attributes['campus'+x+'Temp'] = {label: x + ' Temperature Xid', type: 'string'};
});

for (let i = 0; i < systemCount; i++) {
    bindings['system'+i+'title'] = '@?';
    attributes['system'+i+'title'] = {label: 'System ' + i + ' Title', type: 'string'};

    bindings['system'+i+'icon'] = '@?';
    attributes['system'+i+'icon'] = {label: 'System ' + i + ' Icon', type: 'string'};

    bindings['system'+i+'query'] = '@?';
    attributes['system'+i+'query'] = {label: 'System ' + i + ' Query', type: 'string'};
}

polyAreas.forEach(x => {
    bindings['polyTagValue'+x] = '@?';
    attributes['polyTagValue'+x] = {label: x + ' Tag Value', type: 'string'};

    for (let i = 0; i < systemCount; i++) {
        bindings['system'+x+i+'coordinate'] = '<?';
        attributes['system'+x+i+'coordinate'] = {type:'', label: x + ' System ' + i +' Coordinate'};
    }
});

for (let i = 0; i < attributeCount; i++) {
    bindings['attribute'+i+'title'] = '@?';
    attributes['attribute'+i+'title'] = {label: 'Attribute ' + i +' Title', type:'string'};
    bindings['attribute'+i+'unit'] = '@?';
    attributes['attribute'+i+'unit'] = {label: 'Attribute ' + i +' Unit', type:'string'};
    bindings['attribute'+i+'minValue'] = '<?';
    attributes['attribute'+i+'minValue'] = {label: 'Attribute ' + i +' Min Value', type:''};
    bindings['attribute'+i+'maxValue'] = '<?';
    attributes['attribute'+i+'maxValue'] = {label: 'Attribute ' + i +' Max Value', type:''};
    bindings['attribute'+i+'minColor'] = '@?';
    attributes['attribute'+i+'minColor'] = {label: 'Attribute ' + i +' Min Color', type:'color'};
    bindings['attribute'+i+'maxColor'] = '@?';
    attributes['attribute'+i+'maxColor'] = {label: 'Attribute ' + i +' Max Color', type:'color'};
    bindings['attribute'+i+'marksCount'] = '<?';
    attributes['attribute'+i+'marksCount'] = {label: 'Attribute ' + i +' Marks Count', type:''};

    polyAreas.forEach(x => {
        bindings['attribute'+i+x] = '@?';
        attributes['attribute'+i+x] = {label: x +' Attribute ' + i + ' Xid', type: 'string'};
    });
}

export default {
    bindings: bindings,
    designerInfo: {
        translation: 'otomaticaGraphics.mapTekirdag.version',
        icon: 'map',
        size: {width: '100%', height: '100%'},
        attributes: attributes
    },
    require: {},
    controller: mapTekirdagController,
    template: componentTemplate
};