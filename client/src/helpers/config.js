const environment = {
	development: {
		apiLand: 'http://127.0.0.1:5001',
		apiGame: 'http://127.0.0.1:5002',
		bloodAppId: 'HXW2IzgNGJe3I0Z1',
		devMode: false,
		leafmapMode: false, 
		myLandNewMode: true, //new MyLand, limit 500 Lands
		newVersionUI: true, //Right Click Buy Lands, SellLand, CancelLand | Buy Land in landLevel 19-23 | 
		notification : true, // notify Admin
		settingLandInfo: true, 
	},
	staging: {
		apiLand: 'http://178.128.109.233:3001',
		apiGame: 'http://178.128.109.233:4001',
		bloodAppId: 'dX2zg30eNH2oJe3x',
		devMode: false,
		leafmapMode: false,
		myLandNewMode: true,
		newVersionUI: true,
		notification : true,
		settingLandInfo: true,
	},
	production: {
		apiLand: 'https://if-land.blood.land:4000',
		apiGame: 'https://if-game.blood.land:4000',
		bloodAppId: 'HXW2IzgNGJe3I0Z1',
		devMode: false,	
		leafmapMode: false,
		myLandNewMode: false,
		newVersionUI: false,
		notification : false,
		settingLandInfo: false,
	}
};

module.exports = {
	...(environment[process.env.NODE_ENV])
};



