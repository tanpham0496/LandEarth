const environment = {
	development: {
		apiLand: 'http://127.0.0.1:5001',
		apiGame: 'http://127.0.0.1:5002',
		apiChat: 'http://127.0.0.1:5003',
		//apiCron: 'http://127.0.0.1:5004',
		bloodAppId: 'dX2zg30eNH2oJe3x',
		devMode: false,
		leafmapMode: false, 
		myLandNewMode: true, //new MyLand, limit 500 Lands
		newVersionUI: true, //Right Click Buy Lands, SellLand, CancelLand | Buy Land in landLevel 19-23 | 
		notification : true, // notify Admin
		settingLandInfo: true,
		infiniteScroll: true, //using when scroll list
		mapBox: true,
		newBloodLandVersion: false

	},
	staging: {
		apiLand: 'http://178.128.109.233:3001',
		apiGame: 'http://178.128.109.233:4001',
		apiChat: 'http://178.128.109.233:5001',
		//apiCron: 'http://178.128.109.233:6001',
		bloodAppId: 'dX2zg30eNH2oJe3x',
		devMode: false,
		leafmapMode: false,
		myLandNewMode: true,
		newVersionUI: true,
		notification : true,
		settingLandInfo: true,
		infiniteScroll: true,
		newBloodLandVersion: false
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
		newBloodLandVersion: false
	}
};

module.exports = {
	...(environment[process.env.NODE_ENV])
};



