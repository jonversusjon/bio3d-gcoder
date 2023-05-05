import { PrintCode } from "./PrintCode";

export interface PrintHeadBehavior {
  printHeadDescription: string;
  gcode?: {
    tCommands: PrintCode[];
    gCommands: PrintCode[];
    mCommands: PrintCode[];
  };
  hasCamera?: boolean;
  hasTemperatureControl?: boolean;
  temperatureRange?: {
    min: number;
    max: number;
    step: number;
  };
  hasPhotocuring?: boolean;
  wavelengths?: number[];
  hasSyringePump?: boolean;
  hasEMD?: boolean;
  hasPneumaticControl?: boolean;
  hasHDcamera?: boolean;
  supportedCameraCommands?: string[];
  hasChamberLightsControl?: boolean;
  supportedChamberLightCommands?: string[];
  hasVolumetricControl?: boolean;
  supportedVolumetricCommands?: string[];
  suggestedInk?: string[];
}

export function emptyPrintHeadBehavior(): PrintHeadBehavior {
  return {
    printHeadDescription: "New generic printhead",
    gcode: {
      gCommands: [...commonGcodes],
      mCommands: [...commonMcodes],
      tCommands: [],
    },
    hasCamera: false,
    hasTemperatureControl: false,
    temperatureRange: { min: 0, max: 0, step: 0 },
    hasPhotocuring: false,
    wavelengths: [],
    hasSyringePump: false,
    hasEMD: false,
    hasPneumaticControl: false,
    hasHDcamera: false,
    supportedCameraCommands: [],
    hasChamberLightsControl: false,
    supportedChamberLightCommands: [],
    hasVolumetricControl: false,
    supportedVolumetricCommands: [],
    suggestedInk: [],
  };
}

export function getPneumaticPrintHeadBehavior() {
  return {
    ...emptyPrintHeadBehavior(),
    printHeadDescription: "Pneumatic Printhead",
    hasPneumaticControl: true,
    hasTemperatureControl: true,
    temperatureRange: {
      min: 30,
      max: 65,
      step: 0.5,
    },
    suggestedInk: ["CELLINK", "CELLINK START", "CELLINK LAMININK+"],
  }
}

export function getEMDPrintHeadBehavior() {
  return {
    ...emptyPrintHeadBehavior(),
    printHeadDescription: "Electro-magnetic Droplet Printhead",
    hasTemperatureControl: true,
    temperatureRange: {
      min: 30,
      max: 65,
      step: 0.5,
    },
    suggestedInk: ["gelMA", "alginate", "fibrin", "cell media"],
  }
}

export function getSyringePumpPrintHeadBehavior() {
  return {
    ...emptyPrintHeadBehavior(),
    printHeadDescription: "Syringe Pump Printhead",
    hasTemperatureControl: true,
    temperatureRange: {
      min: 30,
      max: 65,
      step: 0.5,
    },
    suggestedInk: ["collagen", "gelMA", "alginate", "fibrin", "crosslinking solution"],
  }
}

export function getPhotocuringToolhead() {
  return {
    ...emptyPrintHeadBehavior(),
    printHeadDescription: "Syringe Pump Printhead",
    hasPhotocuring: true,
    suggestedInk: ["GELMA", "GELXA", "START X"],
    wavelengths: ["365nm","405nm","450nm","485nm","520nm","custom"],
    gCode: {
      mCommands: {
        ...commonMcodes,
        M805
      }
    }
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

export const M805: PrintCode = {
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



export const availablePrintHeads = [
  getPneumaticPrintHeadBehavior(),
  getEMDPrintHeadBehavior(),
  getSyringePumpPrintHeadBehavior(),
];

