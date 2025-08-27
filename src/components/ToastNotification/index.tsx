import styles from './ToastNotification.module.scss';

interface ToastProps {
  message: string;
  index: number;
}

const ToastNotification = ({ message, index }: ToastProps) => {
  return (
    <div 
      className={styles.toast}
      style={{ bottom: `${20 + (index * 70)}px` }} // Stack toasts vertically
    >
      {message}
    </div>
  );
};

export default ToastNotification;