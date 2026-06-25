/* eslint-disable @typescript-eslint/no-explicit-any */

interface clickProp {
  onClick?: any;
}

const Backdrop = ({ onClick }: clickProp) => {
  return (
    <div
      onClick={onClick}
      className="fixed inset-0 z-[99999] !w-full !h-full top-0 left-0 right-0 bottom-0 bg-[#7180967A] backdrop-blur-[1.5px] overflow-y-auto "
      // className="fixed overflow-hidden backdrop top-0 left-0 w-full h-screen z-[9999] bg-[rgba(0,0,0,0.75)] no-scroller"
    ></div>
  );
};

export default Backdrop;
