import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import dbContext from '../db-context';

// https://sequelize.org/docs/v6/other-topics/typescript/
class ScanEvent extends Model<InferAttributes<ScanEvent>, InferCreationAttributes<ScanEvent>> {
  declare id: CreationOptional<number>;
  declare repoName: string;
  status: 'Queued' | 'In Progress' | 'Success' | 'Failure' = 'Queued';
  declare startedAt: CreationOptional<Date>;
  declare finishedAt: CreationOptional<Date>;
  declare createdAt: CreationOptional<Date>;
}

// https://sequelize.org/docs/v6/core-concepts/model-basics/#data-types
ScanEvent.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    repoName: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
    },
    startedAt: {
      type: DataTypes.DATE,
    },
    finishedAt: {
      type: DataTypes.DATE,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
  },
  {
    // Other model options go here
    sequelize: dbContext.sequelize, // We need to pass the connection instance
    modelName: 'ScanEvent', // We need to choose the model name
    updatedAt: false,
  }
);

export default ScanEvent;
