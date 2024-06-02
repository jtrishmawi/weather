
type CompassProps = {
  direction: number;
  className?: string;
};

export const Compass = ({ direction, className }: CompassProps) => {
  return (
    <svg viewBox="0 0 312.20001 312.20001" version="1.1" className={className}>
      <circle
        fill="#153359"
        cx="156.10001"
        cy="156.10001"
        r="156.10001"
        id="circle252"
      />
      <circle fill="#3cc2d9" cx="157" cy="156.10001" r="117.5" id="circle253" />
      <circle fill="#eceff0" cx="157" cy="156.10001" r="84" id="circle254" />
      <polygon
        fill="#c4c6c6"
        points="156.6,218.2 156.6,218.2 156.6,218.2 156.6,218.1 165.7,173.8 195.4,195.3 195.4,195.4 195.4,195.3 195.5,195.4 195.4,195.3 173.8,165.5 218.2,156.5 218.3,156.5 218.2,156.5 173.8,147.5 195.4,117.7 195.5,117.6 195.4,117.7 195.4,117.6 195.4,117.7 165.6,139.3 156.6,94.9 156.6,94.8 156.6,94.9 147.6,139.3 117.8,117.7 117.7,117.6 117.8,117.7 117.7,117.6 117.8,117.7 139.2,147.4 95,156.5 94.9,156.5 95,156.5 139.3,165.6 117.8,195.3 117.7,195.4 117.8,195.3 117.7,195.4 117.8,195.3 147.5,173.8 156.6,218.1 "
        id="polygon254"
      />
      <g
        id="north"
        className="origin-center"
        style={{ transform: `rotate(${direction}deg)` }}
      >
        <polygon
          fill="#dc1f27"
          points="144.90888,156.8539 156.57615,81.688427 170.64758,156.28822 "
          id="polygon255"
        />
        <polygon
          fill="#153359"
          points="170.64758,156.14679 157.42467,231.31227 144.90888,156.8539 "
          id="polygon256"
        />
      </g>
      <circle
        fill="#153359"
        cx="226.10001"
        cy="86.300018"
        r="4.5999999"
        id="circle258"
      />
      <circle
        fill="#153359"
        cx="86.400002"
        cy="225.99998"
        r="4.5999999"
        id="circle259"
      />
      <circle
        fill="#153359"
        cx="226.10001"
        cy="225.99998"
        r="4.5999999"
        id="circle260"
      />
      <circle
        fill="#153359"
        cx="86.400002"
        cy="86.300018"
        r="4.5999999"
        id="circle261"
      />
      <path
        fill="#eceff0"
        d="m 152.6,261 c 0.8,0.4 2,0.8 3.3,0.8 1.4,0 2.1,-0.6 2.1,-1.4 0,-0.8 -0.6,-1.3 -2.2,-1.8 -2.2,-0.8 -3.6,-2 -3.6,-3.8 0,-2.2 1.9,-3.9 4.9,-3.9 1.5,0 2.6,0.3 3.3,0.7 l -0.7,2.4 c -0.5,-0.3 -1.4,-0.6 -2.7,-0.6 -1.3,0 -1.9,0.6 -1.9,1.3 0,0.8 0.7,1.2 2.4,1.8 2.3,0.8 3.4,2 3.4,3.9 0,2.2 -1.7,4 -5.3,4 -1.5,0 -3,-0.4 -3.7,-0.8 z"
        id="path263"
      />
      <path
        fill="#eceff0"
        d="m 151.1,61.4 v -13 h 3.4 l 2.7,4.8 c 0.8,1.4 1.5,3 2.1,4.5 h 0.1 c -0.2,-1.7 -0.3,-3.5 -0.3,-5.4 v -3.9 h 2.7 v 13 h -3.1 l -2.8,-5 c -0.8,-1.4 -1.6,-3.1 -2.3,-4.6 h -0.1 c 0.1,1.7 0.1,3.6 0.1,5.7 v 3.9 z"
        id="path262"
      />
      <path
        fill="#eceff0"
        d="m 51.3,162.6 -3.1,-13 h 3.1 l 1,5.4 c 0.3,1.5 0.6,3.2 0.8,4.5 v 0 c 0.2,-1.4 0.5,-3 0.9,-4.6 l 1.1,-5.3 h 3.1 l 1,5.5 c 0.3,1.5 0.5,2.9 0.7,4.4 v 0 c 0.2,-1.4 0.5,-3 0.8,-4.5 l 1.1,-5.3 h 3 l -3.4,13 h -3.2 l -1.1,-5.6 c -0.3,-1.3 -0.5,-2.5 -0.6,-4 v 0 c -0.2,1.5 -0.4,2.7 -0.8,4 l -1.2,5.6 h -3.2 z"
        id="path264"
      />
      <path
        fill="#eceff0"
        d="m 258.7,157.1 h -4.8 v 3.1 h 5.4 v 2.4 H 251 v -13 h 8 v 2.4 h -5.1 v 2.7 h 4.8 z"
        id="path265"
      />
    </svg>
  );
};
