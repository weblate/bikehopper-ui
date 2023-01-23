import { FitEncoder } from 'gpx2fit';
import BHCoursePointMessage from './BHCoursePointMessage';

export default class FitFileEncoder {
  constructor(leg) {
    this.encoder = new FitEncoder();
    this.fitBlob = null;
    this.startDate = Date.now();
    this.lastTimeStamp = new Date(this.startDate).getTime();
    this.leg = leg;
    this.recordMessages = [];
  }

  // Get blob
  getBlob() {
    return this.encoder.createBlob();
  }

  // Convert geoJSON to fit file.
  createFit() {
    // writeFileIdMessage()
    this.encoder.writeFileId([
      {
        type: 31,
        manufacturer: 1,
        product: 0,
        serial_number: 12345,
        time_created: this.startDate,
        product_name: 'bikehopper',
      },
    ]);

    // writeCourseMessage()
    this.encoder.writeMessage('course', [
      { sport: 2, name: 'BikeHopper Course' },
    ]);

    // createRecordMessages()
    this.createRecordMessages();

    // calculateDistanceToPriorPointInMeters()
    this.calculateDistanceToPriorPointInMeters();

    // writeLapMessage()
    // this.encoder.write('lap', {})
    // writeTimerStartMessage()

    // writeRecordMessages()
    this.writeRecordMessages();

    // writeCoursePoints()
    // writeTimerStopMessage()

    // ** Write a message with the following information.
    // val cpm = CoursePointMesg()
    // cpm.timestamp = correspondingRecordMessage.timestamp
    // cpm.name = instruction.text
    // cpm.positionLong = correspondingRecordMessage.positionLong
    // cpm.positionLat = correspondingRecordMessage.positionLat
    // cpm.distance = correspondingRecordMessage.distance
    // cpm.type = getGarminSignFromGraphHopper(instruction.sign)
    // cpm.localNum = 4
    // return cpm
  }

  // Create our record messages.
  createRecordMessages() {
    this.recordMessages = this.leg.geometry.coordinates.map((m) => {
      this.lastTimeStamp += 10;
      return {
        positionLong: m[0],
        positionLat: m[1],
        altitude: m[2],
        timeStamp: this.lastTimeStamp,
        localNum: 5,
      };
    });
  }

  // Calculate distance between two GPS points.
  distanceBetween2Points(lat1, lon1, lat2, lon2) {
    const earthRadius = 6371000; // Meters
    const dLat = this.degToRad(lat2 - lat1);
    const dLng = this.degToRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degToRad(lat1)) *
        Math.cos(this.degToRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadius * c;
  }

  writeRecordMessages() {
    this.recordMessages.forEach((recordMessage) => {
      this.encoder.writeRecord([
        {
          altitude: recordMessage.altitude,
          distance: recordMessage.distance,
          timeStamp: recordMessage.timeStamp,
          position_lat: recordMessage.positionLat,
          position_long: recordMessage.positionLong,
        },
      ]);
    });
  }

  // Compute distance for every record message and update the record.
  calculateDistanceToPriorPointInMeters() {
    let distance = 0;
    let currentRecord;
    let priorRecord;

    for (let i = 0; i < this.recordMessages.length; i++) {
      currentRecord = this.recordMessages[i];
      if (i > 0) {
        priorRecord = this.recordMessages[i - 1];
        distance += this.distanceBetween2Points(
          priorRecord.positionLat,
          priorRecord.positionLong,
          currentRecord.positionLat,
          currentRecord.positionLong,
        );
      }
      currentRecord.distance = distance;
    }
  }

  // Convert degrees to radians
  degToRad(degrees) {
    return degrees * (Math.PI / 180);
  }
}
