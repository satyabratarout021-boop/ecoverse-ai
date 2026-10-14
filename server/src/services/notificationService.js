import { Notification } from '../models/Notification.js';

let ioInstance = null;

export const setSocketIO = (io) => {
  ioInstance = io;
};

export const getSocketIO = () => ioInstance;

export const sendNotification = async ({
  recipient = null,
  recipientRole = null,
  title,
  message,
  type = 'system_alert',
  complaintId = null,
  complaintCode = '',
}) => {
  try {
    const notification = await Notification.create({
      recipient,
      recipientRole,
      title,
      message,
      type,
      complaintId,
      complaintCode,
    });

    if (ioInstance) {
      if (recipient) {
        ioInstance.to(`user:${recipient.toString()}`).emit('notification:new', notification);
      }
      if (recipientRole) {
        ioInstance.to(`role:${recipientRole}`).emit('notification:new', notification);
      }
      // General broadcast
      ioInstance.emit('notification:feed', notification);
    }

    return notification;
  } catch (err) {
    console.error('[NotificationService] Error creating notification:', err.message);
  }
};
