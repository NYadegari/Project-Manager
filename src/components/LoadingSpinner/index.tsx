import { PiSpinnerBold } from "react-icons/pi";
import styles from './LoadingSpinner.module.scss'

const LoadingSpinner = () => {
  return (
    <div className={styles['loading-spinner']}>
      <PiSpinnerBold color='black' size={50} className='animate-spin'/>
    </div>
  );
};

export default LoadingSpinner;