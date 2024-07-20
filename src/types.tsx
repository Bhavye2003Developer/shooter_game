type playersType = {
  [id: string]: {
    color: number;
    x: number;
    y: number;
    radius: number;
  };
};

type playersBoundariesType = {
  [id: string]: {
    x: number;
    y: number;
    radius: number;
    color: number;
    isVisible: boolean;
  };
};

type curPlayerInfoType = {
  id: number;
  x: number;
  y: number;
};

export type { playersType, playersBoundariesType, curPlayerInfoType };
