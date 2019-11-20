const environment = {
	development: {
		apiLand: 'http://127.0.0.1:5001',
		apiGame: 'http://127.0.0.1:5002',
		apiChat: 'http://127.0.0.1:5003',
		//apiCron: 'http://127.0.0.1:5004',
		//bloodAppId: 'dX2zg30eNH2oJe3x',
		bloodAppId: 'eNXgx2z30e3H2oJd',
		devMode: false,
		leafmapMode: false, 
		myLandNewMode: true, //new MyLand, limit 500 Lands
		newVersionUI: true, //Right Click Buy Lands, SellLand, CancelLand | Buy Land in landLevel 19-23 | 
		notification : true, // notify Admin
		settingLandInfo: true,
		infiniteScroll: true, //using when scroll list
		mapBox: true,
		newBloodLandVersion: false,
		mapBoxKey: 'pk.eyJ1IjoiYmxhbmQxIiwiYSI6ImNrMWtldHl2ejBjczgzb25wNWlreDVkMjgifQ.7pdpqi8QyPySNEhFbcLzdA'
	},
	staging: {
		apiLand: 'http://178.128.212.64:3001',
		apiGame: 'http://178.128.212.64:4001',
		apiChat: 'http://178.128.212.64:5001',
		//apiCron: 'http://178.128.212.64:6001',
		//bloodAppId: 'dX2zg30eNH2oJe3x',
		bloodAppId: 'eNXgx2z30e3H2oJd',
		devMode: false,
		leafmapMode: false,
		myLandNewMode: true,
		newVersionUI: true,
		notification : true,
		settingLandInfo: true,
		infiniteScroll: true,
		newBloodLandVersion: false,
		mapBoxKey: 'pk.eyJ1IjoiYmxhbmQxIiwiYSI6ImNrMWtldHl2ejBjczgzb25wNWlreDVkMjgifQ.7pdpqi8QyPySNEhFbcLzdA'
	},
	production: {
		apiLand: 'https://if-land.blood.land:4000',
		apiGame: 'https://if-game.blood.land:4000',
		apiChat: '_______________________________',
		bloodAppId: 'HXW2IzgNGJe3I0Z1',
		devMode: false,	
		leafmapMode: false,
		myLandNewMode: true,
		newVersionUI: true,
		notification : true,
		settingLandInfo: true,
		infiniteScroll: false,
		newBloodLandVersion: false,
		mapBoxKey: 'pk.eyJ1IjoiYmxhbmQxIiwiYSI6ImNrMWtldHl2ejBjczgzb25wNWlreDVkMjgifQ.7pdpqi8QyPySNEhFbcLzdA'
	}
};

module.exports = {
	...(environment[process.env.NODE_ENV])
};



