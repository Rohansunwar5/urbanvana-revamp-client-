import mongoose from 'mongoose';
import config from '@/lib/config';

declare global {
  // eslint-disable-next-line no-var
  var _mongooseConnection: Promise<typeof mongoose> | undefined;
}

const connectDB = async (): Promise<typeof mongoose> => {
  if (global._mongooseConnection) {
    return global._mongooseConnection;
  }
  global._mongooseConnection = mongoose.connect(config.MONGO_URI);
  return global._mongooseConnection;
};

export default connectDB;
