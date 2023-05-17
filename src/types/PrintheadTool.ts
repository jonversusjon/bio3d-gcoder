import {
  emptyPrintheadToolBehavior, getEMDPrintHeadBehavior, getHdCameraToolBehavior, getPhotocuringToolBehavior,
  getPneumaticPrintHeadBehavior, getSyringePumpPrintHeadBehavior, getThermoplasicToolBehavior,
  PrintheadToolBehavior
} from "./PrintheadToolBehavior";

export interface PrintheadTool {
  description: string;
  iconUrl: string;
  behavior: PrintheadToolBehavior;
}

export function emptyPrintheadTool(): PrintheadTool {
  return {
    description: "generic printhead tool",
    iconUrl: '',
    behavior: emptyPrintheadToolBehavior()
  }
}

export const availablePrintheadTools:PrintheadTool[] = [
  {
    description: 'Pneumatic',
    iconUrl: '/assets/app-images/pneumatic_printhead_icon.png',
    behavior: getPneumaticPrintHeadBehavior()
  },{
    description: 'EMD',
    iconUrl: '/assets/app-images/emd_printhead_icon.png',
    behavior: getEMDPrintHeadBehavior()
  },{
    description: 'Syringe',
    iconUrl: '/assets/app-images/syringe_pump_icon.png',
    behavior: getSyringePumpPrintHeadBehavior()
  },{
    description: 'Photocuring',
    iconUrl: '/assets/app-images/photocuring_printhead_icon.png',
    behavior: getPhotocuringToolBehavior()
  },{
  description: 'Camera',
    iconUrl: '/assets/app-images/printhead_hd_camera.png',
    behavior: getHdCameraToolBehavior()
  },{
  description: 'Thermoplastic',
    iconUrl: '/assets/app-images/thermoplastic_printhead.png',
    behavior: getThermoplasicToolBehavior()
  }
]

