import { Notification } from '../models/Notification.js';

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;

    const notifications = await Notification.find({
      $or: [
        { recipient: userId },
        { recipientRole: role },
        { recipientRole: 'all' },
        { recipientRole: null, recipient: null },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = notifications.filter((n) => {
      if (n.recipient && n.recipient.toString() === userId.toString()) {
        return !n.read;
      }
      return !n.readBy.some((id) => id.toString() === userId.toString());
    }).length;

    res.json({
      success: true,
      unreadCount,
      notifications,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found.' });
    }

    if (notification.recipient && notification.recipient.toString() === userId.toString()) {
      notification.read = true;
    } else {
      if (!notification.readBy.includes(userId)) {
        notification.readBy.push(userId);
      }
    }

    await notification.save();

    res.json({
      success: true,
      message: 'Notification marked as read.',
      notification,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const markAllRead = async (req, res) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;

    // Direct recipient
    await Notification.updateMany({ recipient: userId, read: false }, { read: true });

    // Role-based
    await Notification.updateMany(
      {
        $or: [{ recipientRole: role }, { recipientRole: 'all' }],
        readBy: { $ne: userId },
      },
      {
        $addToSet: { readBy: userId },
      }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read.',
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
