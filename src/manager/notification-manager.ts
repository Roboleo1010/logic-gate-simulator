import { store } from "react-notifications-component";

export enum NotificationType {
    Success = 'success',
    Error = 'danger',
    Info = 'info',
    Default = 'default',
    Warning = 'warning'
}

class NotificationManager {
    public static addNotification(title: string, message: string, type: NotificationType = NotificationType.Info, duration: number = 4000) {
        store.addNotification({
            title: title,
            message: message,
            type: type,
            insert: "top",
            container: "top-right",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
                duration: duration
            }
        });
    }
}

export default NotificationManager;