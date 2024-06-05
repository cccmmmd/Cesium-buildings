import {
  Cartesian3,
  Math,
} from "cesium";

const defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlNjg4MmMxMC1kMjU0LTRhYzQtYjBjNy1jOGE5NjA0NDJhY2IiLCJpZCI6MjIwMTY1LCJpYXQiOjE3MTc1ODgxMjl9.iCZYMrdEM-Lhv-NODZyvN8I1If5zluGEoJrISx2_-ds';

const initLocation = {
    destination: Cartesian3.fromDegrees(121.56473, 25.02293, 600),
    orientation: {
      heading: Math.toRadians(0.0),
      pitch: Math.toRadians(-15.0),
    }
  };

  export {defaultAccessToken, initLocation};