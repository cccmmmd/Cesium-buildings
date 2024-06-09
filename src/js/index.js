import {
	Cartesian3,
	Math,
	Viewer,
	Terrain,
	createOsmBuildingsAsync,
	ScreenSpaceEventHandler,
	Cesium3DTileStyle,
	ScreenSpaceEventType,
} from "cesium";
import "cesium/Widgets/widgets.css";
import "../css/main.css";
import { defaultAccessToken, initLocation } from "./cesiumConfig.js";

const viewer = new Viewer("cesiumContainer", {
	terrain: Terrain.fromWorldTerrain(),
});
const spacehandler = new ScreenSpaceEventHandler(viewer.scene.canvas);

// Add Cesium OSM buildings to the scene as our example 3D Tileset.
const osmBuildingsTileset = await createOsmBuildingsAsync();
viewer.scene.primitives.add(osmBuildingsTileset);

// Set the initial camera to look at Seattle
viewer.camera.flyTo(initLocation);

const colorByType = () => {
	osmBuildingsTileset.style = new Cesium3DTileStyle({
		defines: {
			building_type: "${feature['building']}",
			building_type2: "${feature['part#building:part']}",
		},
		color: {
			conditions: [
				["${building_type} === null", "color('white')"],
				["${building_type} === 'house'", "color('skyblue')"],
				[
					"${building_type} === 'retail' || ${building_type} === 'industrial'",
					"color('violet')",
				],
				["${building_type} === 'hotel'", "color('purple')"],
				[
					"${building_type} === 'residential' || ${building_type} === 'apartments' || ${building_type} === 'house' ",
					"color('indianred')",
				],
				[
					"${building_type} === 'public' || ${building_type} === 'government' || ${building_type} === 'stadium' || ${building_type} === 'hospital' || ${building_type} === 'construction' || ${building_type} === 'service'",
					"color('green')",
				],
				[
					"${building_type} === 'school' || ${building_type} === 'university'",
					"color('dodgerblue')",
				],
				[
					"${building_type} === 'commercial' || ${building_type} === 'office' || ${building_type2} === 'commercial'",
					"color('yellow')",
				],
				[true, "color('white')"],
			],
		},
	});
};

const showResidential = () => {
	const buildingType = "residential";
	switch (buildingType) {
		case "residential":
			osmBuildingsTileset.style = new Cesium3DTileStyle({
				show: "${feature['building']} === 'residential' || ${feature['building']} === 'apartments' || ${feature['building']} === 'house'",
			});
			break;
		default:
			break;
	}
};

const highlightSchool = () => {
	osmBuildingsTileset.style = new Cesium3DTileStyle({
		color: {
			conditions: [
				[
					"${feature['building']} === 'university' || ${feature['building']} === 'school'",
					"color('fuchsia')",
				],
				[true, "color('white')"],
			],
		},
	});
};

// Color the buildings based on their distance from a selected central location
function colorByDistance(pLatitude, pLongitude) {
	osmBuildingsTileset.style = new Cesium3DTileStyle({
		defines: {
			distance: `distance(vec2(\${feature['cesium#longitude']}, \${feature['cesium#latitude']}), vec2(${pLongitude},${pLatitude}))`,
		},
		color: {
			conditions: [
				["${distance} > 0.050", "color('gold')"],
				["${distance} > 0.030", "color('deepskyblue')"],
				["${distance} > 0.010", "color('tomato')"],
				["${distance} > 0.0001", "color('chartreuse')"],
				[true, "color('white')"],
			],
		},
	});
}

const showByBuildingHeight = () => {
	osmBuildingsTileset.style = new Cesium3DTileStyle({
		defines: {
			height: "Number(${feature['building:levels']})",
			height2: "Number(${feature['part#building:levels']})",
		},
		color: {
			conditions: [
				["${height} >= 30 || ${height2} >= 30", "color('gold')"],
				["${height} >= 20 || ${height2} >= 20", "color('purple')"],
				["${height} >= 10 || ${height2} >= 10", "color('violet')"],
				["${height} >= 5 || ${height2} >= 5", "color('deepskyblue')"],
				["${height} < 5 || ${height2} < 5", "color('chartreuse')"],
				[true, "color('white')"],
			],
		},
	});
};

// remove the left click input event for selecting a central location
function removePicking() {
	document.querySelector(".infoPanel").style.visibility = "hidden";
	spacehandler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK);
}

// Add event listeners to dropdown menu_map options
document.querySelector(".infoPanel").style.visibility = "hidden";
const menu_map = document.getElementById("dropdown1");
const menu_place = document.getElementById("dropdown2");

menu_place.onchange = () => {
	const item = menu_place.options[menu_place.selectedIndex];
	if (item && typeof item.onselect === "function") {
		item.onselect();
	}
};

const taipei = {
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

const taichung = {
	destination: Cartesian3.fromDegrees(120.64049, 24.15635, 450),
	orientation: {
		heading: Math.toRadians(0.0),
		pitch: Math.toRadians(-20.0),
	},
};

const kaohsiung = {
	destination: Cartesian3.fromDegrees(120.29859, 22.60157, 650),
	orientation: {
		heading: Math.toRadians(0.0),
		pitch: Math.toRadians(-20.0),
	},
};

menu_place.options[0].onselect = () => {
	viewer.camera.flyTo(taipei);
	if (menu_map.selectedIndex === 1) {
		colorByDistance(25.03396, 121.5645); // (緯度、經度)
	}
};

menu_place.options[1].onselect = () => {
	viewer.camera.flyTo(taichung);
	if (menu_map.selectedIndex === 1) {
		colorByDistance(24.16293, 120.64052); // (緯度、經度)
	}
};

menu_place.options[2].onselect = () => {
	viewer.camera.flyTo(kaohsiung);
	if (menu_map.selectedIndex === 1) {
		colorByDistance(22.61162, 120.30016); // (緯度、經度)
	}
};

menu_map.onchange = () => {
	const item = menu_map.options[menu_map.selectedIndex];
	if (item && typeof item.onselect === "function") {
		item.onselect();
	}
};

menu_map.options[0].onselect = () => {
	removePicking();
	showByBuildingHeight();
};

menu_map.options[1].onselect = () => {
	// Default to Taipei 101 as the central location
	let place = menu_place.selectedIndex;
	switch (place) {
		case 0:
			colorByDistance(25.03396, 121.5645); // (緯度、經度)
			break;
		case 1:
			colorByDistance(24.16293, 120.64052); // (緯度、經度)
			break;
		case 2:
			colorByDistance(22.61162, 120.30016); // (緯度、經度)
			break;

		default:
			break;
	}

	document.querySelector(".infoPanel").style.visibility = "visible";

	spacehandler.setInputAction(function (mov) {
		viewer.selectedEntity = undefined;
		const pickbd = viewer.scene.pick(mov.position);
		if (pickbd) {
			// 緯度
			const platitude = pickbd.getProperty("cesium#latitude");
			// 經度
			const plongitude = pickbd.getProperty("cesium#longitude");

			colorByDistance(platitude, plongitude);
		}
	}, ScreenSpaceEventType.LEFT_CLICK);
};

menu_map.options[2].onselect = () => {
	removePicking();
	colorByType();
};

menu_map.options[3].onselect = () => {
	removePicking();
	highlightSchool();
};

menu_map.options[4].onselect = () => {
	removePicking();
	showResidential();
};

showByBuildingHeight();
