export default class BHCoursePointMessage {
  constructor(instruction, correspondingRecordMessage) {
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
      8: '23', // A right U-turn
    };
  }

  getMessage() {}
}
