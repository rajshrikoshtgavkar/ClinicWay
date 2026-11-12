import { useEffect, useState } from "react";

export default function Timer({ deadLine }: { deadLine: Date }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = deadLine.getTime() - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [deadLine]);
  return (
    <div className="grid grid-flow-col gap-2 text-center auto-cols-max justify-center items-center">
      <div className="flex p-2 flex-col bg-base-100 rounded-box shadow-md items-center">
        <span className="countdown font-mono text-base">
          <span style={{ "--value": timeLeft.days } as any}></span>
        </span>
        days
      </div>
      <span>:</span>
      <div className="flex p-2 flex-col bg-base-100 rounded-box shadow-md items-center">
        <span className="countdown font-mono text-base">
          <span style={{ "--value": timeLeft.hours } as any}></span>
        </span>
        hrs
      </div>
      <span>:</span>
      <div className="flex p-2 flex-col bg-base-100 rounded-box shadow-md items-center">
        <span className="countdown font-mono text-base">
          <span style={{ "--value": timeLeft.minutes } as any}></span>
        </span>
        min
      </div>
      <span>:</span>
      <div className="flex p-2 flex-col bg-base-100 rounded-box shadow-md items-center">
        <span className="countdown font-mono text-base">
          <span style={{ "--value": timeLeft.seconds } as any}></span>
        </span>
        sec
      </div>
    </div>
  );
}
