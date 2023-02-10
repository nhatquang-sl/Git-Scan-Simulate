import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  Association,
  NonAttribute,
} from 'sequelize';
import dbContext from '../db-context';
import ScanEvent from './scan-event';
import Vulnerability from './vulnerability';

// https://sequelize.org/docs/v6/other-topics/typescript/
class ScanResult extends Model<
  InferAttributes<ScanResult, { omit: 'vulnerabilities' }>,
  InferCreationAttributes<ScanResult, { omit: 'vulnerabilities' }>
> {
  declare id: CreationOptional<number>;
  declare eventId: ForeignKey<ScanEvent['id']>;
  declare event?: NonAttribute<ScanEvent>;
  declare vulnerabilities?: NonAttribute<Vulnerability[]>;
  declare static associations: {
    vulnerabilities: Association<ScanResult, Vulnerability>;
  };
}

// https://sequelize.org/docs/v6/core-concepts/model-basics/#data-types
ScanResult.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    eventId: {
      type: DataTypes.INTEGER,
      references: {
        model: ScanEvent,
        key: 'id',
      },
    },
  },
  {
    // Other model options go here
    sequelize: dbContext.sequelize, // We need to pass the connection instance
    modelName: 'ScanResult', // We need to choose the model name
    timestamps: false,
  }
);

ScanResult.hasMany(Vulnerability, { as: 'vulnerabilities', foreignKey: 'scanResultId' });
ScanResult.belongsTo(ScanEvent, { as: 'event' });

export default ScanResult;
