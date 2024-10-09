import mongoose from "mongoose";

export class MongooseConnection {
  constructor() {
    this.mongooseConnection = mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  static async connect() {
    if (this.mongooseConnection) {
      return this.mongooseConnection;
    }

    this.mongooseConnection = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
}
