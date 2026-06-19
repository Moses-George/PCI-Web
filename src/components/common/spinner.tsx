import { ClipLoader } from 'react-spinners';

interface SpinnerProps {
  size?: number;
  color?: string;
}

const Spinner = ({ size = 50, color = '#3b82f6' }: SpinnerProps) => {
  return <ClipLoader color={color} size={size} speedMultiplier={0.8} />;
};

export default Spinner;