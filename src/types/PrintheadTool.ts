import {
  emptyPrintheadToolBehavior, getEMDPrintHeadBehavior, getHdCameraToolBehavior, getPhotocuringToolBehavior,
  getPneumaticPrintHeadBehavior, getSyringePumpPrintHeadBehavior, getThermoplasicToolBehavior,
  PrintheadToolBehavior
} from "./PrintheadToolBehavior";

export interface PrintheadTool {
  description: string;
  behavior: PrintheadToolBehavior;
}

export function emptyPrintheadTool(): PrintheadTool {
  return {
    description: "generic printhead tool",
    behavior: emptyPrintheadToolBehavior()
  }
}

export const availablePrintheadTools:PrintheadTool[] = [
  {
    description: 'Pneumatic',
    behavior: getPneumaticPrintHeadBehavior()
  },{
    description: 'EMD',
    behavior: getEMDPrintHeadBehavior()
  },{
    description: 'Syringe',
    behavior: getSyringePumpPrintHeadBehavior()
  },{
    description: 'Photocuring',
    behavior: getPhotocuringToolBehavior()
  },{
  description: 'Camera',
    behavior: getHdCameraToolBehavior()
  },{
  description: 'Thermoplastic',
    behavior: getThermoplasicToolBehavior()
  }
]

