import {
  Ion,
  Viewer,
  Terrain,
  createOsmBuildingsAsync,
  Cartesian3,
  Math,
} from "cesium";
import "cesium/Widgets/widgets.css";
import "../css/main.css";
import {defaultAccessToken, initLocation} from './cesiumConfig.js';

const viewer = new Cesium.Viewer("cesiumContainer", {
  terrain: Cesium.Terrain.fromWorldTerrain(),
});
const spacehandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

// Add Cesium OSM buildings to the scene as our example 3D Tileset.
const osmBuildingsTileset = await Cesium.createOsmBuildingsAsync();
viewer.scene.primitives.add(osmBuildingsTileset);

// Set the initial camera to look at Seattle
viewer.scene.camera.setView(initLocation);


const colorByType = () => {
  osmBuildingsTileset.style = new Cesium.Cesium3DTileStyle({
    defines: {
      building_type: "${feature['building']}",
      building_type2: "${feature['part#building:part']}",
    },
    color: {
      conditions: [ 
        ["${building_type} === null", "color('white')"],
        ["${building_type} === 'house'", "color('skyblue')"],
        ["${building_type} === 'retail'", "color('violet')"],
        ["${building_type} === 'residential'", "color('indianred')"], 
        ["${building_type} === 'apartments'", "color('purple')"], 
        ["${building_type} === 'public' || ${building_type} === 'government' || ${building_type} === 'stadium' || ${building_type} === 'hospital' || ${building_type} === 'construction' ", "color('green')"],
        ["${building_type} === 'service'", "color('green')"],
        ["${building_type} === 'school' || ${building_type} === 'university'", "color('dodgerblue')"],
        ["${building_type} === 'commercial' || ${building_type} === 'office' || ${building_type2} === 'commercial'", "color('yellow')"],
        [true, "color('white')"]
      ],
    }, 
  });
}

const showResidential = () => {
  const buildingType = 'residential'
  switch (buildingType) {
      case "residential":
        osmBuildingsTileset.style = new Cesium.Cesium3DTileStyle({
          show: "${feature['building']} === 'residential' || ${feature['building']} === 'apartments'",
        });
        break;
      default:
        break;
  }
}

const highlightSchool = () => {
  osmBuildingsTileset.style = new Cesium.Cesium3DTileStyle({
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
}


// Color the buildings based on their distance from a selected central location
function colorByDistance(pLatitude, pLongitude) {
  osmBuildingsTileset.style = new Cesium.Cesium3DTileStyle({
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
  osmBuildingsTileset.style = new Cesium.Cesium3DTileStyle({
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
        [true, "color('white')"]
      ],
    }, 
  });
}

// remove the left click input event for selecting a central location
function removePicking() {
  document.querySelector(".infoPanel").style.visibility = "hidden";
  spacehandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

// Add event listeners to dropdown menu options
document.querySelector(".infoPanel").style.visibility = "hidden";
const menu = document.getElementById("dropdown");


menu.onchange = function () {
  const item = menu.options[menu.selectedIndex];
  if (item && typeof item.onselect === "function") {
    item.onselect();
  }
};

menu.options[0].onselect = function () {
  removePicking();
  showByBuildingHeight();
};

menu.options[1].onselect = function () {
  // Default to Taipei 101 as the central location
  colorByDistance(25.03396, 121.5645); // (緯度、經度)

  document.querySelector(".infoPanel").style.visibility = "visible";
  
  spacehandler.setInputAction(function (mov) {
    viewer.selectedEntity = undefined;
    const pickbd = viewer.scene.pick(mov.position);
    if (pickbd) {

      // 緯度
      const platitude = pickbd.getProperty(
        "cesium#latitude"
      );
      // 經度
      const plongitude = pickbd.getProperty(
        "cesium#longitude"
      );
     
      colorByDistance(platitude, plongitude);
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};

menu.options[2].onselect = function () {
  removePicking();
  colorByType();
};

menu.options[3].onselect = function () {
  removePicking();
  highlightSchool();
};


menu.options[4].onselect = function () {
  removePicking();
  showResidential();
};





showByBuildingHeight(); 