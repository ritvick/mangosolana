import * as Mongoose from "mongoose";

let database: Mongoose.Connection;
export const connect = async () => {
  // add your own uri below
  const uri = "mongodb://mongodb/test?retryWrites=true&w=majority";
  if (database) {
    return;
  }
  await Mongoose.connect(uri);
  database = Mongoose.connection;
};
export const disconnect = async () => {
  if (!database) {
    return;
  }
  await Mongoose.disconnect();
};