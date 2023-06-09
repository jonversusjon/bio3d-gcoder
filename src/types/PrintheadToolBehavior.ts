import { PrintCode } from "./PrintCode";

export interface PrintheadToolBehavior {
  gcode?: {
    tCommands?: PrintCode[];
    gCommands?: PrintCode[];
    mCommands?: PrintCode[];
  };
  hasCamera?: boolean;
  hasTemperatureControl?: boolean;
  temperatureRange?: {
    min: number;
    max: number;
    step: number;
  };
  canExtrude?: boolean;
  hasPhotocuring?: boolean;
  wavelengths?: number[];
  ledIntensity?: number;
  hasSyringePump?: boolean;
  hasEmd?: boolean;
  emdMode?: 'droplet'|'continuous';
  hasPneumaticControl?: boolean;
  hasHdCamera?: boolean;
  supportedCameraCommands?: string[];
  hasChamberLightsControl?: boolean;
  supportedChamberLightCommands?: string[];
  hasVolumetricControl?: boolean;
  supportedVolumetricCommands?: string[];
  suggestedInk?: string[];
}

// TODO: photocuring: LED intensity
// TODO: EMD: pressure,
//      droplet mode: valve open time(us), cycle time(us)
//      continuous mode: dispensing time(us)
// TODO: syringe pump: extrusion rate (nL/s), volume of extrusion (nL)
// TODO: camera: filename for images

// TODO: ADD thermoplastic printhead

export function emptyPrintheadToolBehavior(): PrintheadToolBehavior {
  return {
    gcode: {
      gCommands: [...commonGcodes],
      mCommands: [...commonMcodes],
      tCommands: [],
    },
  };
}

export function getPneumaticPrintHeadBehavior():PrintheadToolBehavior {
  return {
    ...emptyPrintheadToolBehavior(),
    hasPneumaticControl: true,
    hasTemperatureControl: true,
    temperatureRange: {
      min: 30,
      max: 65,
      step: 0.5,
    },
    canExtrude: true,
    suggestedInk: ["CELLINK", "CELLINK START", "CELLINK LAMININK+"],
  }
}

export function getEMDPrintHeadBehavior():PrintheadToolBehavior {
  return {
    ...emptyPrintheadToolBehavior(),
    hasTemperatureControl: true,
    temperatureRange: {
      min: 30,
      max: 65,
      step: 0.5,
    },
    canExtrude: true,
    hasEmd: true,
    suggestedInk: ["gelMA", "alginate", "fibrin", "cell media"],
  }
}

export function getSyringePumpPrintHeadBehavior():PrintheadToolBehavior {
  return {
    ...emptyPrintheadToolBehavior(),
    hasTemperatureControl: true,
    temperatureRange: {
      min: 30,
      max: 65,
      step: 0.5,
    },
    canExtrude: true,
    hasSyringePump: true,
    suggestedInk: ["collagen", "gelMA", "alginate", "fibrin", "crosslinking solution"],
  }
}

export function getPhotocuringToolBehavior():PrintheadToolBehavior {
  return {
    ...emptyPrintheadToolBehavior(),
    hasPhotocuring: true,
    suggestedInk: ["GELMA", "GELXA", "START X"],
    wavelengths: [365,405,450,485,520],
    gcode: {
      gCommands: [...commonGcodes],
      mCommands: [...commonMcodes, M805]
    }
  }
}

export function getHdCameraToolBehavior():PrintheadToolBehavior {
  return {
    ...emptyPrintheadToolBehavior(),
    hasCamera: true,
  }
}

export function getThermoplasicToolBehavior():PrintheadToolBehavior {
  return {
    ...emptyPrintheadToolBehavior(),
    suggestedInk: ["PLA", "PCL", "PLGA"],
    canExtrude:true,
  }
}
export const commonMcodes:PrintCode[] = [
  { code: "M750",
    description: "Start material extrusion",
    parameters: {
      paramCode: ["T", "P"],
      paramDescription: "Tn Pnnn: Printhead T at pressure P",
      paramNotes: ["This is a dual command, the machine sets the pressure and extrudes material. If P parameter is omitted, " +
      "the currently set pressure for the active tool is used.",
        "T parameter indicates which printhead is concerned. Accepted values are 0,1,2,3,4 and 5.",
        "P specifies the set pressure in kPa. If a printhead is not pressure-based, this command does nothing."]
    }
  },
  { code: "M751",
    description: "Stop material extrusion",
    parameters: {
      paramCode: ["T"],
      paramDescription: "Tn: Printhead T",
      paramNotes: ["It is recommended that an M750 command is followed by an M751command for the same printhead before an" +
      " M750 command for another printhead is sent.",
        "Printhead T(0,1,2,3,4,5) will stop extruding "]
    },
  },
  {
    code: "M773",
    description: "Set printhead pressure",
    parameters: {
      paramCode: ["T", "P"],
      paramDescription: "Tn Pnnn: Printhead T at pressure P",
      paramNotes: [""]
    }
  }];

export const commonGcodes: PrintCode[] = [
  { code: "G0",
    parameters:
      {paramCode: ["X","Y","Z","F"],
        paramDescription: "Xnnn Ynnn Znnn Fnnn: arrival point at (X, Y, Z) at feedrate F",
        paramNotes: ["X, Y, Z parameters define the arrival point of the tool. The parameters are expressed in millimeters",
          "F parameter is the translation speed expressed in mm/min. If F parameter is absent, the latest F set value will be used."]},
    description: "absolute travel move command" },
  { code: "G1",
    parameters:
      {paramCode: ["X","Y","Z","E","F"],
        paramDescription: "Xnnn Ynnn Znnn Ennn Fnnn: arrival point at (X, Y, Z) with extrusion length E at feedrate F",
        paramNotes: ["X, Y, Z parameters define the arrival point of the tool. The parameters are expressed in millimeters.",
          "E parameter controls extrusion. If E>0, material will be extruded. If E=0 or E<0 or E parameter is absent, the system will not extrude material.",
          "F parameter is the translation speed expressed in mm/min. If F parameter is absent, the latest F set value will be used."]},
    description: "absolute move command" },
  { code: "G4",
    parameters:
      {paramCode: ["S","P"],
        paramDescription: "Snnn Pnnn: for S seconds and P milliseconds",
        paramNotes: ["S parameter is expressed in seconds", "P parameter is expressed in milliseconds "]},
    description: "pause command" },
  { code: "G7",
    parameters:
      {paramCode: ["X","Y","Z","E","F"],
        paramDescription: "Xnnn Ynnn Znnn Ennn Fnnn: arrival point at (X, Y, Z) with extrusion length E at feedrate F",
        paramNotes: ["X, Y, Z parameters define the tool's movement length from the current position. The parameters are expressed in millimeters",
          "E parameter controls extrusion. If E>0, material will be extruded. If E=0 or E<0 or E parameter is absent, the system will not extrude material.",
          "F parameter is the translation speed expressed in mm/min. If F parameter is absent, the latest F set value will be used."]},
    description: "relative move command" },
  { code: "G92",
    parameters:
      {paramCode: ["X","Y","Z"],
        paramDescription: "Xnnn Ynnn Znnn: position coordinates (X, Y, Z)",
        paramNotes: ["Set the current position to X, Y and Z parameters. If no parameters are given, the position is assumed to be (X0,Y0,Z0)."]},
    description: "set position" },
];

const M805: PrintCode = {
  code: "M805",
  description: "Turn on/off photocuring modules",
  parameters: {
    paramCode: ["T", "P"],
    paramDescription: "Tn Pnnn: Printhead T at pressure P",
    paramNotes: ["T parameter indicates which printhead or module is concerned. " +
    "If photocuring toolheads are used, accepted values are 0,1,2,3,4 and 5. If built-in photocuring modules are " +
    "employed, accepted values are 10,11,12 and 13 (from left to right).","P parameter sets the LED intensity between " +
    "0 and 255. LED will be turned off for P0. LED will be turned on for P255"
    ]
  }
}

export const M810: PrintCode = {
  code: "M810",
  description: "Set the color of the chamber lights",
  parameters: {
    paramCode: ["R", "E", "B", "N"],
    paramDescription: "Rnnn Ennn Bnnn Wnnn: REd intensity R, Green intensity E, Blue intensity B, White intensity N",
    paramNotes: ["R, E, B, N respectively stand for red, green, blue and white. Accepted values are between 0 and 255"
    ]
  }
}

