
import angular from 'angular';
import baseDevice from './services/baseDevice'
import otAhuTypeKkb from './components/ahuTypeKkb/ahuTypeKkb';
import otCracTypeKkb from './components/cracTypeKkb/cracTypeKkb';
import otIgkTypeKkb from './components/igkTypeKkb/igkTypeKkb';
import otEfTypeKkb from './components/efTypeKkb/efTypeKkb';
import otFahuTypeKkb from './components/fahuTypeKkb/fahuTypeKkb';
import otVrfTypeKkb from './components/vrfTypeKkb/vrfTypeKkb';
import otVrfTypeKkb2 from './components/vrfTypeKkb2/vrfTypeKkb2';
import otVrfTypeKkb3 from './components/vrfTypeKkb3/vrfTypeKkb3';

import './deviceTemplates.css';

let deviceTemplatesModule = angular.module('wiDeviceTemplates', ['maUiApp']);
deviceTemplatesModule.optionalRequires = ['maDashboardDesigner'];

deviceTemplatesModule
    .factory('wiBaseDevice', baseDevice)
    .directive('otAhuTypeKkb', otAhuTypeKkb)
    .directive('otCracTypeKkb', otCracTypeKkb)
    .directive('otIgkTypeKkb', otIgkTypeKkb)
    .directive('otEfTypeKkb', otEfTypeKkb)
    .directive('otFahuTypeKkb', otFahuTypeKkb)
	.directive('otVrfTypeKkb', otVrfTypeKkb)
	.directive('otVrfTypeKkb2', otVrfTypeKkb2)
	.directive('otVrfTypeKkb3', otVrfTypeKkb3)
	
    .config(['$injector', function($injector) {
        
        if ($injector.has('maDesignerTagInfoProvider')) {
            $injector.get('maDesignerTagInfoProvider').addComponentSection({
                name: 'device-templates',
                translation: 'deviceTemplates.components',
                filter: {
                    moduleName: 'wiDeviceTemplates'
                },
                strictFilter: true
            }, 'device-templates');
        }

    }]);

export default deviceTemplatesModule;