### :warning: Notice
This app is currently under development and is not yet complete. Some features may not work as expected, and the app may contain bugs.

### Version
The current version of the app is 0.1.

# Getting Started

Follow these steps to set up and run the project on your local machine:

1. **Clone the repository** - Clone this repository to your local machine using the command:
   
>`git clone https://github.com/jonversusjon/bio3d-gcoder.git`

2. **Install Node.js** - If you don't have Node.js installed, download and install it from the official [Node.js website](https://nodejs.org/).

3. **Navigate to the project folder** - Change your current working directory to the project folder using the command:

>`cd bio3d-gcoder`

4. **Install dependencies** - Run the following command to install all required dependencies:This command will install `jspdf`, `html2canvas`, and other dependencies listed in the `package.json` file.


>`npm install`
    

5. **Run the application** - Start the development server using the command:

>`ng serve`

## Real-World Print Test Calibration

To ensure the accuracy of the 3D bioprinter movements in the application, it is crucial to perform a real-world print test and calibrate the modeled plate dimensions. This section provides step-by-step instructions on how to perform a real-world print test and enter the calibration values into the program.

### Performing the Real-World Print Test

1. **Select a test plate**: Choose a well-plate that you want to use for the calibration test. Make sure the plate is clean and free of any obstructions or contaminants.

2. **Position the plate on the 3D bioprinter**: Place the well-plate on the 3D bioprinter's stage, making sure it is aligned correctly and securely fastened.

3. **Perform a test print**: Using the 3D bioprinter's control software, perform a test print on the selected well-plate. Make sure to print a pattern that covers a significant area of the plate and involves movements in the X, Y, and Z axes. This will help ensure accurate calibration.

4. **Measure the printed pattern**: After the test print is completed, carefully measure the dimensions of the printed pattern on the well-plate. Take measurements in the X, Y, and Z axes, and compare them to the expected dimensions based on the application's settings.



### Entering the Calibration Values into the Program

1. **Calculate the calibration values**: For each axis (X, Y, Z), divide the measured dimension by the expected dimension to obtain the calibration value.

   For example, if the measured X dimension is 98mm and the expected X dimension is 100mm, the calibration value for the X axis would be 98 / 100 = 0.98.

2. **Open the application**: Launch the 3D bioprinter application and navigate to the plate-map component.

3. **Enter the calibration values**: In the plate-map component, you will find input fields labeled "X Calibration", "Y Calibration", and "Z Calibration". Enter the corresponding calibration values calculated in step 1.

4. **Apply the calibration values**: Click the "Apply" button to update the application with the new calibration values. The program will now adjust the plate dimensions, positions, and movements based on the calibration values.

5. **Verify the calibration**: After entering the calibration values, you can perform another real-world print test to verify the accuracy of the calibration. If the results are still not satisfactory, you can repeat the calibration process until the desired accuracy is achieved.


# For Contributors:

## Gcodegeneratorajs

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.5.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
