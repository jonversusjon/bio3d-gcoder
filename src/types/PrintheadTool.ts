import {
  emptyPrintheadToolBehavior, getEMDPrintHeadBehavior, getPhotocuringToolBehavior,
  getPneumaticPrintHeadBehavior, getSyringePumpPrintHeadBehavior,
  PrintheadToolBehavior
} from "./PrintheadToolBehavior";
import {Needle} from "./Needle";

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
  }
]

