import angular from 'angular';

export default angular.module('wiTemip', ['maUiApp'])
	.config(['maSystemSettingsProvider', (maSystemSettingsProvider) => {
        maSystemSettingsProvider.addSystemAlarmLevelSetting({
            key: "systemEventAlarmLevel.TEMIP_INFORM_FAILURE",
            translation: "event.system.inform"
        });
        maSystemSettingsProvider.addSystemAlarmLevelSetting({
            key: "systemEventAlarmLevel.TEMIP_ACTIVESYNC_FAILURE",
            translation: "event.system.activeSync"
        });
	}]);