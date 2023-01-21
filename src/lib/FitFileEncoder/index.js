import { FitEncoder } from 'gpx2fit';
import BHCoursePointMessage from './BHCoursePointMessage';

export default class FitFileEncoder {
  constructor(leg) {
    this.encoder = new FitEncoder();
    this.fitBlob = null;
    this.startDate = Date().now();
    this.lastTimeStamp = new Date(this.startDate.getTime());
    this.leg = leg;
    this.recordMessages = [];
  }

  // Get blob
  getBlob() {}

  // Convert geoJSON to fit file.
  createFit() {
    // writeFileIdMessage()
    encoder.writeFileId({
      type: 31,
      manufacturer: 1,
      product: 0,
      serial_number: 12345,
      time_created: startDate,
      product_name: 'bikehopper',
    });

    // writeCourseMessage()
    encoder.write('course', { sport: 2, name: 'BikeHopper Course' });

    // createRecordMessages()
    this.createRecordMessages();

    // calculateDistanceToPriorPointInMeters()
    // writeLapMessage()
    // writeTimerStartMessage()
    // writeRecordMessages()
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
    this.recordMessages = this.leg[0].geometry.coordinates.map((m) => {
      console.log('Converting message');
      return {
        positionLong: m.point[0],
        positionLat: m.point[1],
        altitude: m.point[2],
        timeStamp: this.lastTimeStamp,
        localNum: 5,
      };
    });
  }

  // Compute distance for every record message and update the record.
  calculateDistanceToPriorPointInMeters() {
    let distance = 0;
    this.recordMessages.forEach((r, i) => {
      if (i > 0) {
        distance += self.distanceBetween2Points(lat1, lon1, lat2, lon2);
      }
      r.distance = distance;
    });
  }

  // Calculate distance between two GPS points.
  distanceBetween2Points(lat1, lon1, lat2, lon2) {
    const earthRadius = 6371000; // Meters
    const dLat = Math.toRadians(lat2 - lat1);
    const dLng = Math.toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(Math.toRadians(lat1)) *
        Math.cos(Math.toRadians(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadius * c;
  }
}
