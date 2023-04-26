export interface Coordinates {
  /**
   * The x-coordinate of the point in a Cartesian coordinate system.
   */
  x: number;

  /**
   * The y-coordinate of the point in a Cartesian coordinate system.
   */
  y: number;

  /**
   * The z-coordinate of the point in a Cartesian coordinate system (optional).
   */
  z?: number;

  /**
   * The time point of a time-series data point (optional).
   */
  t?: number;

  /**
   * The channel of the data point, typically used in imaging or multi-channel data (optional).
   */
  channel?: number;

  /**
   * The sample identifier, used to differentiate between different samples or subjects (optional).
   */
  sample?: number;

  /**
   * The replicate identifier, used to differentiate between experimental replicates (optional).
   */
  replicate?: number;

  /**
   * The experiment identifier, used to differentiate between different experiments or study arms (optional).
   */
  experiment?: number;

  /**
   * a label to display with the object
   */
  label?: string;
}

export function emptyCoordinates(): Coordinates {
  return {
    x: 0,
    y: 0
  }
}
