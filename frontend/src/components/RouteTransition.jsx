import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function RouteTransition({ children }) {
  const location = useLocation();
  const [renderChildren, setRenderChildren] = useState(false);

  useEffect(() => {
    // keep it deterministic: don't render as opacity-0 for a long time
    setRenderChildren(true);
  }, [location.pathname]);


  return (
    <div
      className={
        renderChildren
          ? 'animate-[routeIn_420ms_ease-out_both]'
          : 'opacity-0'
      }
    >
      {children}

      <style>{`
        @keyframes routeIn {
          from { opacity: 0; transform: translateY(10px) scale(0.99); filter: blur(6px); }
          to   { opacity: 1; transform: translateY(0) scale(1); filter: blur(0px); }
        }
      `}</style>
    </div>
  );
}

