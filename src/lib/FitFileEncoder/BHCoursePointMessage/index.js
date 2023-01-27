export default class BHCoursePointMessage {
  constructor(instruction, rMsg) {
    this.instruction = instruction;
    this.rMsg = rMsg;

    this.signLookup = {
      '-98': '23', // A U-turn without the knowledge if it is a right or left U-turn
      '-8': '23', // A left U-turn
      '-7': '19', // Keep left
      '-6': '53', // Not yet used: leave roundabout
      '-3': '20', // Turn sharp left
      '-2': '6', // Turn left
      '-1': '19', // Turn slight left
      0: '8', // Continue on street
      1: '19', // Turn slight right
      2: '7', // Turn right
      3: '21', // Turn sharp right
      4: '53', // The finish instruction before the last point
      5: '53', // The instruction before a via point
      6: '53', // The instruction before entering a roundabout
      7: '21', // Keep right
      8: '23', // A right U-turn,
    };
  }

  getMessage() {
    return {
      timestamp: this.rMsg.timeStamp,
      type: this.getName(this.instruction),
      name: this.instruction.text,
      position_lat: this.rMsg.positionLat,
      position_long: this.rMsg.positionLong,
      distance: this.rMsg.distance,
    };
  }

  // Translate instruction from bikehopper to fit format.
  getName(instruction) {
    switch (instruction.sign) {
      case -98:
        return 23;
      case -8:
        return 23;
      case -7:
        return 19;
      case -6:
        return 53;
      case -3:
        return 20;
      case -2:
        return 6;
      case -1:
        return 19;
      case 0:
        return 8;
      case 1:
        return 19;
      case 2:
        return 7;
      case 3:
        return 21;
      case 4:
        return 53;
      case 5:
        return 53;
      case 6:
        return 53;
      case 7:
        return 21;
      case 8:
        return 23;
      default:
        return 0;
    }
  }
}
