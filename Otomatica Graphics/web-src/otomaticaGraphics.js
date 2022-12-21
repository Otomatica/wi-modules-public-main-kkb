
import angular from 'angular';

import mapTurkiye from './components/maps/turkiye';
import mapKocaeli from './components/maps/kocaeli';
import mapAnkara from './components/maps/ankara';
import mapIstanbul from './components/maps/istanbul';
import mapIzmir from './components/maps/izmir';
import mapTekirdag from './components/maps/tekirdag';

import campusView from './components/campusView/campusView';
import mapAttributes from './services/mapAttributes';

import './otomaticaGraphics.css';

let otomaticaGraphicsModule = angular.module('wiOtomaticaGraphics', ['maUiApp']);
otomaticaGraphicsModule.optionalRequires = ['maDashboardDesigner'];

otomaticaGraphicsModule
    .component('wiMapTurkiye', mapTurkiye)
    .component('wiMapKocaeli', mapKocaeli)
    .component('wiMapAnkara', mapAnkara)
    .component('wiMapIstanbul', mapIstanbul)
    .component('wiMapIzmir', mapIzmir)
    .component('wiMapTekirdag', mapTekirdag)
    .component('wiCampusView', campusView)
    .factory('wiMapAttributes', mapAttributes)
    .config(['$injector', function($injector) {
        if ($injector.has('maDesignerTagInfoProvider')) {
            $injector.get('maDesignerTagInfoProvider').addComponentSection({
                name: 'otomatica-graphics',
                translation: 'otomaticaGraphics.components',
                filter: {
                    moduleName: 'wiOtomaticaGraphics'
                },
                strictFilter: true
            }, 'otomatica-graphics');
        }
    }]);

export default otomaticaGraphicsModule;