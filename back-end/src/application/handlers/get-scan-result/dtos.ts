import { Vulnerability } from '@database';

type Position = {
  line: number;
};

type Positions = {
  begin: Position;
};

type Location = {
  path: string;
  positions: Positions;
};

export class FindingDto {
  type!: string;
  location!: Location;

  constructor(vul: Vulnerability) {
    this.type = vul.type;
    this.location = {
      path: vul.path,
      positions: {
        begin: {
          line: vul.beginLine,
        },
      },
    };
  }
}
