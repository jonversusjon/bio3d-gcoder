export interface PrintCode {
  code: string;
  description: string;
  parameters: {
    paramCode: string[],
    paramDescription: string,
    paramNotes?: string[]
  }
  notes?: string;
}
