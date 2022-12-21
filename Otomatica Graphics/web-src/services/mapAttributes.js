import city from './../../web/geojson/city.json'
import cityMin from './../../web/geojson/city.min.json'
import district from './../../web/geojson/district.json'

mapAttributesFactory.$inject = ['$http', 'maUiSettings', 'maEvents'];
function mapAttributesFactory($http ,maUiSettings, maEvents) {

	let baseUrl = '/modules/otomaticaGraphics/web/geojson/';
    class mapAttributes {
        
        static city(highResolution) {
            return Promise.resolve({data: highResolution ? city : cityMin});
        }

        static district() {
        	return Promise.resolve({data:district});
        }

        static isDark() {
            //todo fix user theme name
            return maUiSettings.themes[maUiSettings.activeTheme].dark;
        }

        static alarmLevels() {
            return maEvents.levels;
        }
    }
    
    return mapAttributes;
}

export default mapAttributesFactory;