import { Cartesian3, Math } from "cesium";
import config from './config';
const defaultAccessToken = config.defaultAccessToken;
const initLocation = {
	destination: Cartesian3.fromDegrees(
		121.56486743767994,
		25.02477237064501,
		650
	),
	orientation: {
		heading: Math.toRadians(0.0),
		pitch: Math.toRadians(-20.0),
	},
};

export { defaultAccessToken, initLocation };
