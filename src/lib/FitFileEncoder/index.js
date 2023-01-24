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
    this.writeFileIdMessage();
    this.createRecordMessages();
    this.calculateDistanceToPriorPointInMeters();
    this.startTimer();
    this.writeRecordMessages();
    this.writeLapMessage();
    // writeCoursePoints()
    this.stopTimer();
  }

  writeFileIdMessage() {
    this.encoder.writeFileId({
      type: 'course',
      time_created: this.startDate,
    });
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

  // TODO: Am I doing this right?  Should I not write an array?
  // Should I transform it into an array of objects and just write that one array?
  writeRecordMessages() {
    console.log('Writing record messages...');
    this.recordMessages.forEach((recordMessage) => {
      console.log(recordMessage);
      this.encoder.writeRecord({
        altitude: recordMessage.altitude,
        distance: recordMessage.distance,
        timestamp: recordMessage.timeStamp,
        position_lat: recordMessage.positionLat,
        position_long: recordMessage.positionLong,
      });
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

  startTimer() {
    this.encoder.writeEvent({
      timestamp: this.recordMessages[0].timeStamp,
      event: 'timer',
      event_time: 'start',
      event_group: 0,
    });
  }

  stopTimer() {
    this.encoder.writeEvent({
      timestamp: this.recordMessages[this.recordMesages.length - 1].timeStamp,
      event: 'timer',
      event_time: 'stop_disable_all',
      event_group: 0,
    });
  }

  // TODO: Write lap message.
  writeLapMessage() {
    const firstMessage = this.recordMessages[0];
    const lastMessage = this.recordMessages[this.recordMessages.length - 1];

    this.encoder.writeMessage('lap', {
      start_time: firstMessage.timeStamp,
      start_position_lat: firstMessage.positionLat,
      start_position_long: firstMessage.positionLong,
      end_position_lat: lastMessage.positionLat,
      end_position_long: lastMessage.positionLong,
      total_elapsed_time: lastMessage.timeStamp - firstMessage.timeStamp,
      total_time_time: lastMessage.timeStamp - firstMessage.timeStamp,
    });
  }
}
