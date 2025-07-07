const mongoose = require('mongoose');
//const { Schema } = mongoose;

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status: {
        type: String,
        enum: {
            values: ['ignored', 'interested', 'accepted', 'rejected'],
            message: '{VALUE} is not supported',
        },
        required: true,
    },
    
},
{ timestamps: true}
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });


connectionRequestSchema.pre("save", function (next) {
  // checking if fromUserId is same as toUserId

  if (this.fromUserId.equals(this.toUserId)) {
    throw new Error("You Could not send request to yourself");
  }

  next();
});

const connectionRequest = new mongoose.model('connectionRequest', connectionRequestSchema);
module.exports = connectionRequest;